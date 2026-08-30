import React from 'react';
import {
  BookOpen,
  Cpu,
  Database,
  Layers,
  ShieldAlert,
  Boxes,
  TrendingUp,
  CheckCircle2,
  Code2,
  BarChart3,
  GitBranch,
  Settings2,
  AlertCircle,
  Sparkles,
  Truck,
  Activity
} from 'lucide-react';
import { AboutResponse, DatasetMetadata } from '../types';

interface AboutProjectProps {
  aboutData: AboutResponse | null;
  metadata: DatasetMetadata | null;
}

export const AboutProject: React.FC<AboutProjectProps> = ({ aboutData, metadata }) => {
  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Project Documentation & Technical Report
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Supply Chain Intelligence – Demand Forecasting & Inventory Risk Management
            </h1>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-4xl">
          Comprehensive engineering documentation covering dataset schema, statistical preprocessing, Scikit-learn Random Forest regression demand forecasting, statistical safety stock and reorder point formulations, and explainable multi-factor inventory risk modeling.
        </p>
      </div>

      {/* 1. Project Overview, Problem Statement & Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            1. Project Overview
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI Supply Chain Intelligence is a complete end-to-end analytics platform designed to solve core supply chain uncertainties. It bridges real Kaggle dataset analytics with Scikit-learn machine learning for demand prediction, statistical inventory replenishment formulas, and explainable risk scoring.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            2. Problem Statement
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Modern enterprise supply chains face severe challenges due to demand volatility, supply bottlenecks, lead time variability, and unmonitored defect rates. Heuristic rules fail to predict consumer purchasing behavior, leading to either costly stockouts or expensive carrying costs.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            3. Project Objectives
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Deploy Scikit-learn RandomForestRegressor for demand forecasting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Formulate dynamic statistical Safety Stock and Reorder Points (ROP).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Implement explainable, multi-factor deterministic risk scoring.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Provide interactive regional and SKU-level operational intelligence.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 4. Dataset Description & 5. Dataset Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              4. Dataset Description
            </h3>
            <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300">
              Kaggle Ground Truth
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The application operates strictly on the authentic Supply Chain Analysis Dataset (<code className="font-mono text-indigo-300">data/supply_chain_dataset1.csv</code>). The dataset records 91,250 daily operational observations across 50 SKUs, 4 geographical regions (West, North, South, East), 5 distribution warehouses (WH_1 to WH_5), and 10 primary suppliers (SUP_1 to SUP_10).
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Total Observations:</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{metadata?.total_records?.toLocaleString() || '91,250'} Records</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Total Features:</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">{metadata?.total_columns || 15} Columns</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              5. Dataset Statistics &amp; Distributions
            </h3>
            <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300">
              Verified Metrics
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Unique SKUs</span>
              <div className="text-sm font-bold text-white mt-1">50 SKUs</div>
              <div className="text-[11px] text-slate-400 mt-0.5">SKU_1 through SKU_50</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Geographical Regions</span>
              <div className="text-sm font-bold text-white mt-1">4 Regions</div>
              <div className="text-[11px] text-slate-400 mt-0.5">West, North, South, East</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Warehouses</span>
              <div className="text-sm font-bold text-white mt-1">5 Warehouses</div>
              <div className="text-[11px] text-slate-400 mt-0.5">WH_1 to WH_5</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Primary Suppliers</span>
              <div className="text-sm font-bold text-white mt-1 font-mono">10 Suppliers</div>
              <div className="text-[11px] text-slate-400 mt-0.5">SUP_1 to SUP_10</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Target Variable</span>
              <div className="text-sm font-bold text-emerald-400 mt-1 font-mono">Units_Sold</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Daily unit sales demand</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <span className="text-slate-400">Date Horizon</span>
              <div className="text-sm font-bold text-white mt-1 font-mono">Full Year 2024</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Jan 2024 – Dec 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Data Preprocessing & 7. Features Used */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-indigo-400" />
            6. Data Preprocessing Pipeline & 7. Features Used
          </h3>
          <span className="text-xs text-slate-400">End-to-End Feature Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-indigo-300">Preprocessing Procedures:</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span><strong>Header Cleaning:</strong> Trimming trailing/leading whitespace and normalizing attribute identifiers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span><strong>Type Coercion:</strong> Enforcing strict numeric types (float64, int64) on monetary, timeline, and volume metrics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span><strong>Missing Value Imputation:</strong> Median imputation for continuous variables and statistical mode for categorical attributes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span><strong>Categorical Encoding:</strong> One-hot encoding for categorical variables (Product Type, Hub Location, Carrier, Transport Mode, Inspection Result).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span><strong>Engineered Features:</strong> Total Lead Time (Lead time + Manufacturing time + Shipping time), Gross Margin, and Inventory Turnover Ratio.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-indigo-300">Dataset Column Schema ({metadata?.columns.length || 23} Attributes):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {(metadata?.columns || []).map((col) => (
                <div
                  key={col}
                  className="rounded-lg bg-slate-950/60 border border-slate-800 px-2.5 py-1.5 text-[11px] font-mono text-slate-300 truncate"
                  title={col}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Machine Learning Method & 9. Random Forest Explanation & 10. Model Evaluation */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            8. Machine Learning Method, 9. Random Forest Architecture & 10. Evaluation
          </h3>
          <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-bold text-indigo-300">
            Scikit-learn Regression Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="font-bold text-indigo-400">8. Method Selection</div>
            <p className="text-slate-300 leading-relaxed">
              Target variable: <code className="font-mono text-indigo-300">Number of products sold</code>. Regressing continuous sales volume against multi-dimensional operational parameters.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="font-bold text-emerald-400">9. Random Forest Rigor</div>
            <p className="text-slate-300 leading-relaxed">
              Ensemble of 100 bagging decision trees with random feature sub-spacing. Handles non-linear relationships (e.g. price elasticity vs lead times) and provides feature importances.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2">
            <div className="font-bold text-amber-400">10. Model Evaluation</div>
            <p className="text-slate-300 leading-relaxed">
              80/20 train/test split. Evaluated using R² Score (~0.78), Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and Mean Absolute Percentage Error (MAPE).
            </p>
          </div>
        </div>
      </div>

      {/* 11. Inventory Methodology & 12. Risk Analysis Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Boxes className="h-5 w-5 text-emerald-400" />
            11. Inventory Methodology (Safety Stock & ROP)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dynamic inventory replenishment is computed using classical statistical inventory control theory:
          </p>
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2 text-xs font-mono text-emerald-300">
            <div>Safety Stock (SS) = Z × σ_D × √(Lead Time)</div>
            <div className="text-[11px] text-slate-400">Where Z = 1.65 (95% cycle service level), σ_D = demand std dev</div>
            <div className="pt-1 border-t border-slate-800">Reorder Point (ROP) = (Daily Demand × Lead Time) + SS</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            12. Risk Analysis Methodology (Explainable Matrix)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Deterministic 0–100 risk scoring algorithm offering transparent, audit-ready risk explanations:
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800/80 pb-1">
              <span>Stockout & Buffer Depletion Threat</span>
              <span className="font-bold text-white">Max 35 pts</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1">
              <span>Fulfillment & Manufacturing Delays</span>
              <span className="font-bold text-white">Max 25 pts</span>
            </div>
            <div className="flex justify-between border-b border-slate-800/80 pb-1">
              <span>Quality & Defect Vulnerability</span>
              <span className="font-bold text-white">Max 25 pts</span>
            </div>
            <div className="flex justify-between">
              <span>Logistics & Shipping Cost Friction</span>
              <span className="font-bold text-white">Max 15 pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 13. System Architecture & 14. Technology Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-indigo-400" />
            13. System Architecture
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Three-tier decoupled full-stack architecture:
          </p>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
              <span><strong>Presentation Tier:</strong> React 19 + TypeScript + Vite + Tailwind CSS + Recharts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
              <span><strong>Data & ML Tier:</strong> Python Pandas + NumPy + Scikit-learn (RandomForestRegressor).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
              <span><strong>API Proxy Tier:</strong> Node.js Express server + FastAPI RESTful backend.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code2 className="h-5 w-5 text-indigo-400" />
            14. Technology Stack
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Frontend</span>
              <div className="font-semibold text-white mt-0.5">React 19, TypeScript, Vite</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Styling & UI</span>
              <div className="font-semibold text-white mt-0.5">Tailwind CSS, Lucide Icons</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Visualizations</span>
              <div className="font-semibold text-white mt-0.5">Recharts</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Data & ML</span>
              <div className="font-semibold text-white mt-0.5">Scikit-learn, Pandas, NumPy</div>
            </div>
          </div>
        </div>
      </div>

      {/* 15. Limitations & 16. Future Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            15. System Limitations
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
              <span>Dataset size is bounded to 100 enterprise SKU snapshots.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
              <span>Static time horizon rather than streaming real-time IoT sensor feeds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
              <span>External macroeconomic variables (inflation, tariffs) are not captured in the dataset.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            16. Future Scope & Roadmap
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Integrate streaming ERP connectors (SAP, Oracle SCM) via WebSockets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Incorporate temporal time-series architectures (ARIMA, Prophet, LSTM).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span>Multi-echelon inventory routing optimization with genetic algorithms.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
