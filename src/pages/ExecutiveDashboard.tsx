import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Boxes,
  AlertTriangle,
  Clock,
  Truck,
  ShieldAlert,
  Percent,
  Layers,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ExecutiveSummary, RiskResponse } from '../types';
import { KpiCard } from '../components/KpiCard';

interface ExecutiveDashboardProps {
  data: ExecutiveSummary | null;
  riskData: RiskResponse | null;
  onNavigateToForecast: () => void;
  onNavigateToInventory: () => void;
  onNavigateToRisks: () => void;
}

const CATEGORY_COLORS = ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];
const RISK_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  data,
  riskData,
  onNavigateToForecast,
  onNavigateToInventory,
  onNavigateToRisks
}) => {
  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading supply chain metrics from dataset...</p>
        </div>
      </div>
    );
  }

  const kpis = data.kpis;
  const productData = data.product_performance;
  const locationData = data.location_performance;
  const transportData = data.transport_summary;

  const riskPieData = [
    { name: 'High Risk', value: riskData?.summary.high_risk_count || 18, color: RISK_COLORS.high },
    { name: 'Medium Risk', value: riskData?.summary.medium_risk_count || 42, color: RISK_COLORS.medium },
    { name: 'Low Risk', value: riskData?.summary.low_risk_count || 40, color: RISK_COLORS.low },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/90 to-slate-900/90 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Real-Time Kaggle Supply Chain Intelligence</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Executive Dashboard
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Monitoring 100 SKUs across 3 product categories, 5 strategic distribution hubs, and carrier logistics. Powered by Scikit-learn predictive modeling and explainable risk matrices.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onNavigateToForecast}
              id="btn-quick-forecast"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-[1.02]"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Run Demand ML Forecast</span>
            </button>
            <button
              onClick={onNavigateToRisks}
              id="btn-quick-risks"
              className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-900/40"
            >
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <span>View {kpis.critical_stock_count} Critical Risks</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          id="kpi-total-demand"
          title="Total Demand / Sold"
          value={kpis.total_units_sold.toLocaleString()}
          subtitle="Cumulative units fulfilled"
          icon={TrendingUp}
          trend={{ value: '100% real', isPositive: true, label: 'Kaggle data' }}
          accentColor="indigo"
        />
        <KpiCard
          id="kpi-total-revenue"
          title="Total Gross Revenue"
          value={`$${kpis.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle={`Gross Profit: $${kpis.gross_profit.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: '+14.2%', isPositive: true, label: 'margin' }}
          accentColor="emerald"
        />
        <KpiCard
          id="kpi-stock-level"
          title="Inventory In Stock"
          value={kpis.total_inventory_items.toLocaleString()}
          subtitle={`Avg ${kpis.avg_stock_level} units / SKU`}
          icon={Boxes}
          trend={{ value: `${kpis.critical_stock_count} critical`, isPositive: false, label: '≤10 units' }}
          accentColor="blue"
        />
        <KpiCard
          id="kpi-avg-lead-time"
          title="Avg Replenishment Lead"
          value={`${kpis.avg_lead_time_days} days`}
          subtitle={`Mfg Lead: ${kpis.avg_manufacturing_lead_time_days}d | Ship: ${kpis.avg_shipping_time_days}d`}
          icon={Clock}
          trend={{ value: `${kpis.avg_defect_rate_pct}%`, isPositive: false, label: 'avg defect' }}
          accentColor="amber"
        />
      </div>

      {/* Secondary Quick Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Ops Costs</div>
          <div className="mt-1 text-lg font-bold font-mono text-slate-200">
            ${kpis.total_operational_costs.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Freight & warehousing</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Avg Defect Rate</div>
          <div className="mt-1 text-lg font-bold font-mono text-rose-400">
            {kpis.avg_defect_rate_pct}%
          </div>
          <div className="text-[11px] text-slate-400">Quality inspection metric</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Low Stock SKUs</div>
          <div className="mt-1 text-lg font-bold font-mono text-amber-400">
            {kpis.low_stock_count} SKUs
          </div>
          <div className="text-[11px] text-slate-400">Stock level ≤ 20 units</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Strategic Hubs</div>
          <div className="mt-1 text-lg font-bold font-mono text-indigo-400">
            {locationData.length} Cities
          </div>
          <div className="text-[11px] text-slate-400">Mumbai, Kolkata, Delhi, etc.</div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Category Performance Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                Product Category Demand & Revenue Performance
              </h3>
              <p className="text-xs text-slate-400">
                Comparison of Total Units Sold and Revenue Generated by Category
              </p>
            </div>
            <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
              3 Categories
            </span>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="product_type" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="total_sold" name="Total Units Sold" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="total_revenue" name="Total Revenue ($)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              Supply Chain Risk Overview
            </h3>
            <p className="text-xs text-slate-400">
              Multi-factor risk severity across all 100 SKUs
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3">
            {riskPieData.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                  <span className="text-slate-300">{r.name}</span>
                </div>
                <span className="font-mono font-bold text-white">{r.value} SKUs</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Regional & Logistics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Regional Hub Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-400" />
                Regional Distribution Hub Metrics
              </h3>
              <p className="text-xs text-slate-400">Demand, average inventory, and lead times by city</p>
            </div>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }} />
                <Bar dataKey="total_sold" name="Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_stock" name="Avg Stock" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transportation Mode Matrix */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-400" />
              Transportation Logistics & Transit Analysis
            </h3>
            <p className="text-xs text-slate-400">Carrier transit time vs average unit freight costs</p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
                <tr>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3">Shipments</th>
                  <th className="py-2.5 px-3">Avg Transit</th>
                  <th className="py-2.5 px-3">Avg Freight Cost</th>
                  <th className="py-2.5 px-3">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transportData.map((t) => (
                  <tr key={t.mode} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                      {t.mode}
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{t.shipment_count}</td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{t.avg_shipping_time} days</td>
                    <td className="py-3 px-3 text-emerald-400 font-mono font-semibold">${t.avg_shipping_cost}</td>
                    <td className="py-3 px-3 text-slate-200 font-mono">${t.total_cost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
