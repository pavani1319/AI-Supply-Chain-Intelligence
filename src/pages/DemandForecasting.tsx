import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  Sparkles,
  BarChart3,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { ForecastResponse, ScenarioPredictionResponse, DatasetMetadata } from '../types';
import { apiService } from '../services/api';

interface DemandForecastingProps {
  forecastData: ForecastResponse | null;
  metadata: DatasetMetadata | null;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  selectedSku: string;
  setSelectedSku: (sku: string) => void;
  onFilterChange: () => void;
}

export const DemandForecasting: React.FC<DemandForecastingProps> = ({
  forecastData,
  metadata,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedSku,
  setSelectedSku,
  onFilterChange
}) => {
  // Interactive What-If Scenario Simulator state
  const [scenarioSku, setScenarioSku] = useState<string>('SKU0');
  const [scenarioPrice, setScenarioPrice] = useState<number>(50);
  const [scenarioStock, setScenarioStock] = useState<number>(45);
  const [scenarioLeadTime, setScenarioLeadTime] = useState<number>(10);
  const [scenarioOrderQty, setScenarioOrderQty] = useState<number>(60);
  const [scenarioShippingCost, setScenarioShippingCost] = useState<number>(4.5);
  const [scenarioLocation, setScenarioLocation] = useState<string>('Mumbai');
  const [scenarioCategory, setScenarioCategory] = useState<string>('haircare');

  const [simResult, setSimResult] = useState<ScenarioPredictionResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simError, setSimError] = useState<string | null>(null);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    setSimError(null);
    try {
      const res = await apiService.predictScenario({
        sku: scenarioSku,
        product_type: scenarioCategory,
        location: scenarioLocation,
        price: scenarioPrice,
        stock_levels: scenarioStock,
        lead_times: scenarioLeadTime,
        order_quantities: scenarioOrderQty,
        shipping_costs: scenarioShippingCost,
      });
      setSimResult(res);
    } catch (err: any) {
      setSimError(err.message || 'Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  if (!forecastData) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm text-slate-400">Training Scikit-learn Random Forest regressor on dataset...</p>
        </div>
      </div>
    );
  }

  const { metrics, top_features, summary, comparison_data } = forecastData;

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Cpu className="h-3.5 w-3.5" />
            <span>Scikit-learn RandomForestRegressor Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Machine Learning Demand Forecasting
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Trained on real Kaggle supply chain records. Predicts product unit demand based on price, inventory availability, lead times, logistics costs, and regional fulfillment parameters.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl">
          <div className="flex items-center gap-1.5 px-2">
            <Layers className="h-3.5 w-3.5 text-indigo-400" />
            <select
              id="filter-forecast-category"
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
              id="filter-forecast-location"
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

      {/* Scikit-Learn Model Evaluation Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-4 shadow-lg shadow-indigo-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>R² Score (Accuracy)</span>
            <HelpCircle className="h-3.5 w-3.5 text-indigo-400" title="Coefficient of Determination (Goodness of Fit)" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-indigo-400">
            {metrics.r2_score}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Variance explained by features</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 shadow-lg shadow-emerald-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>MAE (Mean Absolute Error)</span>
            <HelpCircle className="h-3.5 w-3.5 text-emerald-400" title="Average deviation from actual sales in units" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-emerald-400">
            ±{metrics.mae} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Average forecast variance</div>
        </div>

        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/90 p-4 shadow-lg shadow-blue-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>RMSE (Root Mean Square)</span>
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" title="Penalizes large prediction outliers" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-blue-400">
            {metrics.rmse} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Standard deviation of residuals</div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
            <span>Train/Test Split</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-amber-400">
            80 / 20
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{metrics.train_samples} Train / {metrics.test_samples} Test Samples</div>
        </div>
      </div>

      {/* Main ML Forecast vs Actual Chart */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Historical Demand (Actual) vs ML Predicted Demand
            </h3>
            <p className="text-xs text-slate-400">
              Direct comparison across evaluated SKU batches. Note the clear separation between verified historical sales and ML predicted demand.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              Historical Actual
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-400"></span>
              ML Prediction
            </span>
          </div>
        </div>

        <div className="mt-4 h-80 w-full">
          {comparison_data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-500">
              No records match selected filter criteria.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparison_data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="sku" stroke="#94a3b8" fontSize={10} tickLine={false} interval={Math.ceil(comparison_data.length / 20)} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: 'Units Sold', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Historical Actual Demand"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: '#10b981' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  name="RandomForest ML Prediction"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  dot={{ r: 2, fill: '#818cf8' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Feature Importance & Interactive What-If Scenario Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Feature Importance */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Random Forest Feature Importance
            </h3>
            <p className="text-xs text-slate-400">
              Gini impurity reduction percentage across tree splits in Scikit-learn
            </p>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top_features}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} unit="%" />
                <YAxis dataKey="feature" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={110} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  formatter={(val: any) => [`${val}%`, 'Importance']}
                />
                <Bar dataKey="importance" name="Relative Weight" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* What-If Interactive Scenario Simulator */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-slate-900/90 to-indigo-950/20 p-5 shadow-lg">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                Interactive "What-If" Demand Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Adjust operational parameters to simulate real-time ML demand response
              </p>
            </div>
            <span className="rounded-md bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
              Live Inference
            </span>
          </div>

          <form onSubmit={handleRunSimulation} className="mt-4 space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Target Category</label>
                <select
                  value={scenarioCategory}
                  onChange={(e) => setScenarioCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="haircare">Haircare</option>
                  <option value="skincare">Skincare</option>
                  <option value="cosmetics">Cosmetics</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Strategic Hub (Location)</label>
                <select
                  value={scenarioLocation}
                  onChange={(e) => setScenarioLocation(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Price ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={scenarioPrice}
                  onChange={(e) => setScenarioPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Stock Units</label>
                <input
                  type="number"
                  value={scenarioStock}
                  onChange={(e) => setScenarioStock(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Lead Time (Days)</label>
                <input
                  type="number"
                  value={scenarioLeadTime}
                  onChange={(e) => setScenarioLeadTime(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSimulating}
              id="btn-run-simulation"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSimulating ? 'Executing Python ML Inference...' : 'Calculate Demand Forecast'}</span>
            </button>
          </form>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="mt-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300">Model Prediction:</span>
                <span className="text-lg font-black font-mono text-emerald-400">
                  {simResult.predicted_demand} units
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Random Forest estimated a demand of <strong className="text-white">{simResult.predicted_demand} units</strong> based on a selling price of ${scenarioPrice} at the {scenarioLocation} distribution center.
              </p>
            </div>
          )}
          {simError && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
              {simError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
