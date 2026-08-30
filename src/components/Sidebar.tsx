import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Boxes,
  AlertTriangle,
  MapPin,
  Search,
  BookOpen,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  riskAlertCount: number;
  criticalStockCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  riskAlertCount,
  criticalStockCount
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      description: 'KPIs & macro metrics',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'forecasting',
      label: 'Demand Forecasting',
      description: 'RandomForest ML engine',
      icon: TrendingUp,
      badge: 'ML',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'inventory',
      label: 'Inventory Intelligence',
      description: 'Stock, ROP & Safety stock',
      icon: Boxes,
      badge: criticalStockCount > 0 ? `${criticalStockCount} critical` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
    {
      id: 'risks',
      label: 'Risk & Alert Center',
      description: 'Explainable risk scoring',
      icon: AlertTriangle,
      badge: riskAlertCount > 0 ? `${riskAlertCount} alerts` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'regions',
      label: 'Regional Analysis',
      description: 'City & logistics performance',
      icon: MapPin,
      badge: null,
    },
    {
      id: 'skus',
      label: 'SKU / Product Explorer',
      description: 'Master catalog & filters',
      icon: Search,
      badge: '100 SKUs',
      badgeColor: 'bg-slate-700/50 text-slate-300 border-slate-600/30',
    },
    {
      id: 'about',
      label: 'About Project',
      description: 'System architecture & methods',
      icon: BookOpen,
      badge: 'Docs',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-900/95 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-3 mb-2 border-b border-slate-800/80">
          <h1 className="text-xs font-extrabold text-white tracking-tight leading-snug">
            AI Supply Chain Intelligence – Demand Forecasting &amp; Inventory Risk Management
          </h1>
        </div>
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-semibold tracking-tight truncate">
                    {item.label}
                  </div>
                  <div className={`text-[11px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`ml-2 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium shrink-0 ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60 m-2 rounded-xl">
        <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span>AI Supply Chain v1.0</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          FastAPI + Scikit-learn Random Forest + React Dashboard
        </p>
      </div>
    </aside>
  );
};
