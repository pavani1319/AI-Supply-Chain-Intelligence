import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Layers,
  MapPin,
  Filter,
  ArrowRight,
  TrendingDown,
  Info
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
import { RiskResponse, DatasetMetadata } from '../types';

interface RiskAlertCenterProps {
  riskData: RiskResponse | null;
  metadata: DatasetMetadata | null;
  selectedRiskFilter: string;
  setSelectedRiskFilter: (filter: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const RiskAlertCenter: React.FC<RiskAlertCenterProps> = ({
  riskData,
  metadata,
  selectedRiskFilter,
  setSelectedRiskFilter,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation
}) => {
  if (!riskData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Computing deterministic multi-factor risk scores...</p>
        </div>
      </div>
    );
  }

  const { summary, location_risk, category_risk, records } = riskData;

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'High Risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[11px] font-bold text-rose-400">
            <AlertTriangle className="h-3 w-3" />
            High Risk
          </span>
        );
      case 'Medium Risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold text-amber-400">
            <AlertCircle className="h-3 w-3" />
            Medium Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            Low Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Deterministic Multi-Factor Risk Assessment Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Supply Chain Risk & Vulnerability Center
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Explainable mathematical risk scoring (0-100) combining Stockout Threat (35%), Fulfillment Delay (25%), Quality QA Defect Rate (25%), and Logistics Transit (15%).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-1.5 px-2">
            <Filter className="h-3.5 w-3.5 text-rose-400" />
            <select
              id="filter-risk-level"
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-rose-500"
            >
              <option value="All">All Risk Severities</option>
              <option value="High Risk">High Risk Only</option>
              <option value="Medium Risk">Medium Risk Only</option>
              <option value="Low Risk">Low Risk Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2 border-l border-slate-800">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <select
              id="filter-risk-category"
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
              id="filter-risk-location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="All">All Hubs</option>
              {metadata?.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Risk KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-4 shadow-lg shadow-rose-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>High Risk SKUs</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-rose-400">
            {summary.high_risk_count} <span className="text-xs font-normal text-slate-400">SKUs ({summary.high_risk_pct}%)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Score ≥ 65 (Urgent attention)</div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Medium Risk SKUs</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            {summary.medium_risk_count} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Score 35 - 64 (Active monitoring)</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Low Risk SKUs</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            {summary.low_risk_count} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Score &lt; 35 (Stable operations)</div>
        </div>

        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-lg shadow-indigo-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Portfolio Avg Score</span>
            <Info className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-400">
            {summary.avg_risk_score} / 100
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Weighted mathematical index</div>
        </div>
      </div>

      {/* Risk by Region & Category Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Regional Risk Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              Regional Risk Distribution
            </h3>
            <p className="text-xs text-slate-400">High, Medium, and Low risk SKU counts per distribution hub</p>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={location_risk} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="high" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" name="Low Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Risk Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Category Risk Breakdown
            </h3>
            <p className="text-xs text-slate-400">Product line vulnerability comparison</p>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={category_risk} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="high" name="High Risk" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="medium" name="Medium Risk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="low" name="Low Risk" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Risk Records Table & Contributing Factors */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">SKU Risk Scorecards & Explainable Drivers</h3>
            <p className="text-xs text-slate-400">Showing {records.length} assessed items matching active filters</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {records.map((r) => (
            <div
              key={r.sku}
              className={`rounded-xl border p-4 transition-all ${
                r.risk_level === 'High Risk'
                  ? 'border-rose-500/30 bg-rose-950/20'
                  : r.risk_level === 'Medium Risk'
                  ? 'border-amber-500/30 bg-amber-950/20'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-bold text-white">{r.sku}</span>
                  <span className="text-xs text-slate-300 capitalize">{r.product_type}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-500" />
                    {r.location}
                  </span>
                  {getRiskBadge(r.risk_level)}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Risk Score</div>
                    <div
                      className={`text-lg font-black font-mono ${
                        r.risk_score >= 65 ? 'text-rose-400' : r.risk_score >= 35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {r.risk_score} / 100
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Reason & Risk Breakdown */}
              <div className="mt-3 flex flex-col md:flex-row md:items-center justify-between gap-2 border-t border-slate-800/80 pt-3 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-300 font-medium">
                    <strong className="text-slate-200">Primary Root Cause:</strong> {r.primary_reason}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {r.risk_factors.map((factor, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 border border-slate-700"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric pills */}
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
                  <span>Stock: <strong className="text-slate-200">{r.stock_level}</strong></span>
                  <span>Lead: <strong className="text-slate-200">{r.lead_time}d</strong></span>
                  <span>Defect: <strong className="text-slate-200">{r.defect_rate}%</strong></span>
                  <span>Inspection: <strong className="text-slate-200">{r.inspection_result}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
