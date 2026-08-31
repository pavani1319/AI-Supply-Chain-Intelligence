import express from 'express';
import path from 'path';
import http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createServer as createViteServer } from 'vite';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const PYTHON_PORT = 8085;
const BACKEND_URL = process.env.BACKEND_URL || 'https://ai-supply-chain-api.onrender.com';

let pythonProcess: ChildProcess | null = null;

function isBackendHealthy(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 503);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function trySpawnPython(candidates: string[], index: number, resolve: () => void) {
  if (index >= candidates.length) {
    console.warn('[Backend] Could not launch Python backend automatically. Falling back to local static JSON bundle.');
    resolve();
    return;
  }

  const cmd = candidates[index];
  console.log(`[Backend] Trying Python executable: '${cmd}'...`);

  let resolved = false;
  const proc = spawn(cmd, ['backend/main.py'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PYTHONUNBUFFERED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  pythonProcess = proc;

  proc.stdout?.on('data', (data) => {
    const msg = data.toString();
    console.log(`[Python FastAPI] ${msg.trim()}`);
    if (msg.includes('Uvicorn running') || msg.includes('Application startup complete') || msg.includes('8085') || msg.includes('8000')) {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }
  });

  proc.stderr?.on('data', (data) => {
    const errMsg = data.toString().trim();
    if (errMsg) console.error(`[Python Err] ${errMsg}`);
  });

  proc.on('error', (err) => {
    console.log(`[Backend] Executable '${cmd}' failed: ${err.message}`);
    if (!resolved) {
      resolved = true;
      trySpawnPython(candidates, index + 1, resolve);
    }
  });

  proc.on('exit', (code, signal) => {
    if (code !== 0 && code !== null && !resolved) {
      console.log(`[Backend] Executable '${cmd}' exited with code=${code}. Trying next candidate...`);
      resolved = true;
      trySpawnPython(candidates, index + 1, resolve);
    } else {
      console.log(`[Python Process Exited] code=${code} signal=${signal}`);
    }
  });

  setTimeout(() => {
    if (!resolved) {
      resolved = true;
      resolve();
    }
  }, 3000);
}

async function startPythonBackend(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[Backend] Production environment detected. Using deployed FastAPI backend at: ${BACKEND_URL}`);
    return;
  }

  const active = await isBackendHealthy(PYTHON_PORT);
  if (active) {
    console.log(`[Backend] Active Python FastAPI server detected on http://127.0.0.1:${PYTHON_PORT}. Reusing backend.`);
    return;
  }

  return new Promise((resolve) => {
    console.log('[Backend] Launching Python FastAPI server...');
    const candidates = process.platform === 'win32'
      ? ['py', 'python', 'python3']
      : ['python3', 'python', 'py'];
    trySpawnPython(candidates, 0, resolve);
  });
}

async function startServer() {
  await startPythonBackend();

  const app = express();

  const targetUrl = process.env.NODE_ENV === 'production'
    ? BACKEND_URL
    : `http://127.0.0.1:${PYTHON_PORT}`;

  console.log(`[Proxy] Forwarding /api requests to: ${targetUrl}`);

  // Proxy /api/* directly to the Python FastAPI backend
  const apiProxy = createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    ws: false,
    pathRewrite: (pathStr) => {
      return pathStr.startsWith('/api') ? pathStr : `/api${pathStr}`;
    },
    on: {
      error: (err, req, res: any) => {
        console.error('[API Proxy Error]', err.message);
        if (res && !res.headersSent && typeof res.status === 'function') {
          res.status(503).json({
            error: 'Supply chain Python backend is starting or unavailable.',
            detail: err.message,
          });
        }
      }
    }
  });

  app.use('/api', apiProxy);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Full-Stack Supply Chain Intelligence running on http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('[Server] Gracefully shutting down...');
    if (pythonProcess) {
      pythonProcess.kill('SIGTERM');
    }
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('[Fatal Server Startup Error]', err);
  process.exit(1);
});
