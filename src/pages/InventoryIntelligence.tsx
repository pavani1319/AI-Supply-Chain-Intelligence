import React from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  MapPin,
  ShieldCheck,
  RotateCw,
  DollarSign,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { InventoryResponse, DatasetMetadata } from '../types';

interface InventoryIntelligenceProps {
  inventoryData: InventoryResponse | null;
  metadata: DatasetMetadata | null;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const InventoryIntelligence: React.FC<InventoryIntelligenceProps> = ({
  inventoryData,
  metadata,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation
}) => {
  if (!inventoryData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Calculating safety stock & reorder points...</p>
        </div>
      </div>
    );
  }

  const { summary, by_category, items } = inventoryData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Critical Shortage':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
            <AlertTriangle className="h-3 w-3" />
            Critical Shortage
          </span>
        );
      case 'Reorder Needed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-400">
            <TrendingDown className="h-3 w-3" />
            Reorder Needed
          </span>
        );
      case 'Overstocked':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 text-[11px] font-semibold text-purple-300">
            <RotateCw className="h-3 w-3" />
            Overstocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Sufficient
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Boxes className="h-3.5 w-3.5" />
            <span>Dynamic Stock Level & Reorder Point (ROP) Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Inventory Optimization & Safety Stock Intelligence
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Statistical buffer calculations based on daily demand velocity, supplier lead time variance, and service level factors (95% confidence).
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-1.5 px-2">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <select
              id="filter-inventory-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              {metadata?.product_types.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2 border-l border-slate-800">
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <select
              id="filter-inventory-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="All">All Strategic Hubs</option>
              {metadata?.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-4 shadow-lg shadow-rose-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Critical Shortage</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-400">
            {summary.critical_shortage} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Stock ≤ 10 units (immediate stockout risk)</div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Reorder Triggered</span>
            <TrendingDown className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            {summary.reorder_needed} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Stock Level ≤ Reorder Point (ROP)</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Sufficient Stock</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {summary.sufficient_stock} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Healthy buffer and turnover</div>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-lg shadow-indigo-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Inventory Valuation</span>
            <DollarSign className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-400">
            ${summary.total_inventory_value.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Avg {summary.avg_stock_per_sku} units per SKU</div>
        </div>
      </div>

      {/* Category Breakdown & Reorder Formulations Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Breakdown Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Boxes className="h-4 w-4 text-indigo-400" />
              Category Inventory Volume & Critical Alert Density
            </h3>
            <p className="text-xs text-slate-400">Total units on hand vs critical shortage items</p>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={by_category} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total_stock" name="Total In-Stock Units" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="critical_items" name="Critical Shortage SKUs" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistical Formulas Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              Academic Formulation
            </h3>
            <p className="text-xs text-slate-400">Explainable inventory optimization</p>
          </div>

          <div className="space-y-3.5 text-xs text-slate-300 py-2">
            <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="font-bold text-indigo-300">Safety Stock (SS)</div>
              <div className="font-mono text-[11px] text-slate-200 mt-1">
                SS = Z × √((L × σ_D²) + (D² × σ_L²))
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Z=1.65 (95% service level), L=Lead time, D=Daily demand rate.
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
              <div className="font-bold text-emerald-300">Reorder Point (ROP)</div>
              <div className="font-mono text-[11px] text-slate-200 mt-1">
                ROP = (Daily Demand × Lead Time) + Safety Stock
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Threshold that automatically triggers vendor purchase order.
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
            Computed on 100% authentic Kaggle dataset values.
          </div>
        </div>
      </div>

      {/* Inventory Master Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">SKU Inventory & Reorder Status Catalog</h3>
            <p className="text-xs text-slate-400">Showing {items.length} items matching active filters</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Hub (City)</th>
                <th className="py-2.5 px-3">Stock On Hand</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Safety Stock</th>
                <th className="py-2.5 px-3">ROP</th>
                <th className="py-2.5 px-3">Turnover Ratio</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {items.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{item.sku}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans capitalize">{item.product_type}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{item.location}</td>
                  <td className={`py-3 px-3 font-bold ${item.stock_level <= 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {item.stock_level}
                  </td>
                  <td className="py-3 px-3 text-slate-300">{item.lead_time_days}d</td>
                  <td className="py-3 px-3 text-indigo-300">{item.safety_stock}</td>
                  <td className="py-3 px-3 text-amber-300">{item.reorder_point}</td>
                  <td className="py-3 px-3 text-emerald-400">{item.turnover_ratio}x</td>
                  <td className="py-3 px-3 font-sans">{getStatusBadge(item.stock_status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
