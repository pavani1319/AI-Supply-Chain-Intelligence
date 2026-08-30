import React, { useState } from 'react';
import {
  Search,
  Layers,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Boxes,
  Truck,
  ShieldAlert,
  Percent,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ProductsResponse, SKUProduct, DatasetMetadata } from '../types';

interface SkuExplorerProps {
  productsData: ProductsResponse | null;
  metadata: DatasetMetadata | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedLocation: string;
  setSelectedLocation: (l: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}

export const SkuExplorer: React.FC<SkuExplorerProps> = ({
  productsData,
  metadata,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  currentPage,
  setCurrentPage
}) => {
  const [selectedSkuDetail, setSelectedSkuDetail] = useState<SKUProduct | null>(null);

  if (!productsData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Loading catalog from dataset...</p>
        </div>
      </div>
    );
  }

  const { items, total, total_pages, page } = productsData;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Search className="h-3.5 w-3.5" />
            <span>Kaggle Dataset Master Product Catalog</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            SKU & Product Master Explorer
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Complete inventory catalog containing all 100 SKUs and 24 operational features, with instant multi-column search and deep-dive modal telemetry.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              id="input-sku-search"
              placeholder="Search SKU, category, supplier..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 text-xs text-slate-200 rounded-lg pl-8 pr-3 py-1.5 border border-slate-700 outline-none focus:border-indigo-500 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1.5 px-2 border-l border-slate-800">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <select
              id="filter-sku-category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
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
              id="filter-sku-location"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
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

      {/* Main SKU Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{items.length}</strong> of <strong className="text-white">{total}</strong> SKUs
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-2 font-mono">
              Page {page} of {total_pages || 1}
            </span>
            <button
              onClick={() => setCurrentPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              id="btn-sku-prev-page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(total_pages, page + 1))}
              disabled={page >= total_pages}
              id="btn-sku-next-page"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:bg-slate-700 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Price ($)</th>
                <th className="py-2.5 px-3">Demand (Sold)</th>
                <th className="py-2.5 px-3">Revenue ($)</th>
                <th className="py-2.5 px-3">Stock Units</th>
                <th className="py-2.5 px-3">Hub Location</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Carrier</th>
                <th className="py-2.5 px-3">Defect %</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {items.map((sku) => (
                <tr key={sku.sku} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white">{sku.sku}</td>
                  <td className="py-3 px-3 text-slate-300 font-sans capitalize">{sku.product_type}</td>
                  <td className="py-3 px-3 text-slate-200">${sku.price.toFixed(2)}</td>
                  <td className="py-3 px-3 text-emerald-400 font-bold">{sku.number_of_products_sold}</td>
                  <td className="py-3 px-3 text-slate-200">${sku.revenue_generated.toLocaleString()}</td>
                  <td className={`py-3 px-3 font-bold ${sku.stock_levels <= 10 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {sku.stock_levels}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans">{sku.location}</td>
                  <td className="py-3 px-3 text-slate-300">{sku.lead_times}d</td>
                  <td className="py-3 px-3 font-sans text-slate-300">{sku.shipping_carriers}</td>
                  <td className="py-3 px-3 text-amber-400">{sku.defect_rates}%</td>
                  <td className="py-3 px-3 text-center font-sans">
                    <button
                      onClick={() => setSelectedSkuDetail(sku)}
                      id={`btn-view-${sku.sku}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 transition-all hover:bg-indigo-600 hover:text-white"
                    >
                      <Eye className="h-3 w-3" />
                      View All 24 Features
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive SKU Detail Modal */}
      {selectedSkuDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-mono font-bold">
                  {selectedSkuDetail.sku.replace('SKU', '')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedSkuDetail.sku}
                    <span className="text-xs font-normal text-slate-400 capitalize px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                      {selectedSkuDetail.product_type}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Distribution Hub: <strong className="text-slate-200">{selectedSkuDetail.location}</strong> | Supplier: <strong className="text-slate-200">{selectedSkuDetail.supplier_name}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSkuDetail(null)}
                id="btn-close-sku-modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 24 Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Selling Price</span>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">${selectedSkuDetail.price.toFixed(2)}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Demand (Units Sold)</span>
                <div className="text-base font-bold font-mono text-white mt-1">{selectedSkuDetail.number_of_products_sold}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Revenue Generated</span>
                <div className="text-base font-bold font-mono text-slate-200 mt-1">${selectedSkuDetail.revenue_generated.toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Stock Levels</span>
                <div className={`text-base font-bold font-mono mt-1 ${selectedSkuDetail.stock_levels <= 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {selectedSkuDetail.stock_levels} units
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Availability Index</span>
                <div className="text-base font-bold font-mono text-indigo-400 mt-1">{selectedSkuDetail.availability}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Lead Time (Supplier)</span>
                <div className="text-base font-bold font-mono text-amber-400 mt-1">{selectedSkuDetail.lead_times} days</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Manufacturing Lead</span>
                <div className="text-base font-bold font-mono text-amber-400 mt-1">{selectedSkuDetail.manufacturing_lead_time} days</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Shipping Transit Time</span>
                <div className="text-base font-bold font-mono text-amber-400 mt-1">{selectedSkuDetail.shipping_times} days</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Shipping Carrier</span>
                <div className="text-sm font-semibold text-white mt-1">{selectedSkuDetail.shipping_carriers}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Shipping Costs</span>
                <div className="text-base font-bold font-mono text-emerald-400 mt-1">${selectedSkuDetail.shipping_costs.toFixed(2)}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Transport Mode</span>
                <div className="text-sm font-semibold text-indigo-300 mt-1">{selectedSkuDetail.transportation_modes}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Logistics Route</span>
                <div className="text-sm font-semibold text-indigo-300 mt-1">{selectedSkuDetail.routes}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Manufacturing Cost</span>
                <div className="text-base font-bold font-mono text-slate-200 mt-1">${selectedSkuDetail.manufacturing_costs.toFixed(2)}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Production Volume</span>
                <div className="text-base font-bold font-mono text-slate-200 mt-1">{selectedSkuDetail.production_volumes}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Defect Rate</span>
                <div className="text-base font-bold font-mono text-rose-400 mt-1">{selectedSkuDetail.defect_rates}%</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Inspection Result</span>
                <div className="text-sm font-semibold text-emerald-400 mt-1">{selectedSkuDetail.inspection_results}</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedSkuDetail(null)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-bold text-white hover:bg-slate-700"
              >
                Close Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
