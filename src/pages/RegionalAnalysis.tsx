import React from 'react';
import {
  MapPin,
  Truck,
  TrendingUp,
  DollarSign,
  Boxes,
  Clock,
  Layers,
  AlertTriangle
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
import { RegionalResponse, DatasetMetadata } from '../types';

interface RegionalAnalysisProps {
  regionalData: RegionalResponse | null;
  metadata: DatasetMetadata | null;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
}

export const RegionalAnalysis: React.FC<RegionalAnalysisProps> = ({
  regionalData,
  metadata,
  selectedLocation,
  setSelectedLocation
}) => {
  if (!regionalData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading regional distribution hub data...</p>
        </div>
      </div>
    );
  }

  const { regional_overview, sku_details } = regionalData;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <MapPin className="h-3.5 w-3.5" />
            <span>Geographical Fulfillment & Logistics Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Regional Hub & Logistics Performance
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Cross-city supply chain analysis comparing consumer demand velocity, warehousing stock buffers, carrier freight costs, and replenishment lead times.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <MapPin className="h-4 w-4 text-emerald-400 ml-2" />
          <select
            id="filter-regional-location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="All">All 5 Distribution Hubs</option>
            {metadata?.locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Regional City Hub Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {regional_overview.map((reg) => (
          <div
            key={reg.location}
            className={`rounded-2xl border p-4 shadow-lg transition-all ${
              selectedLocation === reg.location
                ? 'border-emerald-500 bg-emerald-950/30 shadow-emerald-500/10'
                : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-white text-sm">{reg.location}</span>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                {reg.sku_count} SKUs
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Units Sold:</span>
                <span className="font-mono font-bold text-white">{reg.total_units_sold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revenue:</span>
                <span className="font-mono font-bold text-emerald-400">${reg.total_revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Stock:</span>
                <span className="font-mono font-bold text-slate-200">{reg.avg_stock_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Lead Time:</span>
                <span className="font-mono font-bold text-amber-400">{reg.avg_lead_time}d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Freight:</span>
                <span className="font-mono font-bold text-indigo-400">${reg.avg_shipping_cost}</span>
              </div>
            </div>

            {reg.critical_stock_count > 0 && (
              <div className="mt-3 rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-1 text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {reg.critical_stock_count} SKUs in critical shortage
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparative Regional Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales vs Stock by Location */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Boxes className="h-4 w-4 text-emerald-400" />
              Demand Fulfilled vs Average Stock In Hubs
            </h3>
            <p className="text-xs text-slate-400">Comparing sales volume to inventory buffers</p>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regional_overview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total_units_sold" name="Total Units Sold" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avg_stock_level" name="Avg Stock Level" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Times vs Shipping Costs */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              Average Lead Times (Days) vs Shipping Costs ($)
            </h3>
            <p className="text-xs text-slate-400">Operational lead times & carrier freight cost distribution</p>
          </div>

          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regional_overview} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="location" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#818cf8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="avg_lead_time" name="Avg Lead Time (Days)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="avg_shipping_cost" name="Avg Shipping Cost ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional SKU Master Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Regional SKU Logistics & Carriers</h3>
            <p className="text-xs text-slate-400">Showing {sku_details.length} SKUs in active filter</p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Hub</th>
                <th className="py-2.5 px-3">Units Sold</th>
                <th className="py-2.5 px-3">Revenue</th>
                <th className="py-2.5 px-3">Stock Level</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Shipping Carrier</th>
                <th className="py-2.5 px-3">Route</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sku_details.map((sku) => (
                <tr key={sku.sku} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{sku.sku}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans capitalize">{sku.product_type}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{sku.location}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sku.sold}</td>
                  <td className="py-3 px-3 text-slate-200">${sku.revenue.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-300">{sku.stock}</td>
                  <td className="py-3 px-3 text-amber-300">{sku.lead_time}d</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{sku.carrier}</td>
                  <td className="py-3 px-3 font-sans text-indigo-300">{sku.route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
