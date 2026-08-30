import React from 'react';
import { Activity, Database, Cpu, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  isBackendHealthy: boolean;
  totalRecords: number;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  isBackendHealthy,
  totalRecords,
  onRefresh,
  isLoading
}) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'forecasting': return 'Demand Forecasting';
      case 'inventory': return 'Inventory Intelligence';
      case 'risks': return 'Risk & Alert Center';
      case 'regions': return 'Regional Analysis';
      case 'skus': return 'SKU Explorer';
      case 'about': return 'About Project';
      default: return 'AI Supply Chain Intelligence';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-md shadow-indigo-500/20">
          <Layers className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            {getTabTitle(activeTab)}
          </h1>
          <p className="text-xs text-slate-400">
            Real Kaggle Supply Chain Dataset Analysis & Scikit-learn Pipeline
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Dataset badge */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300">
          <Database className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-mono font-medium text-slate-200">{totalRecords > 0 ? totalRecords : 100}</span>
          <span className="text-slate-400">Records (24 Features)</span>
        </div>

        {/* ML Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-emerald-900/50 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-400">
          <Cpu className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-medium">RandomForest ML</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Health status */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1.5 text-xs">
          <Activity className={`h-3.5 w-3.5 ${isBackendHealthy ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className={isBackendHealthy ? 'text-emerald-300 font-medium' : 'text-amber-300 font-medium'}>
            {isBackendHealthy ? 'API Active' : 'Connecting...'}
          </span>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          id="btn-refresh-data"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-50"
          title="Reload dataset & retrain ML model"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>
    </header>
  );
};
