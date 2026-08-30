import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { DemandForecasting } from './pages/DemandForecasting';
import { InventoryIntelligence } from './pages/InventoryIntelligence';
import { RiskAlertCenter } from './pages/RiskAlertCenter';
import { RegionalAnalysis } from './pages/RegionalAnalysis';
import { SkuExplorer } from './pages/SkuExplorer';
import { AboutProject } from './pages/AboutProject';
import { apiService } from './services/api';
import {
  DatasetMetadata,
  ExecutiveSummary,
  ForecastResponse,
  InventoryResponse,
  RiskResponse,
  RegionalResponse,
  ProductsResponse,
  AboutResponse
} from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Global Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('All');
  const [selectedSku, setSelectedSku] = useState<string>('All');
  const [skuSearchQuery, setSkuSearchQuery] = useState<string>('');
  const [skuCurrentPage, setSkuCurrentPage] = useState<number>(1);

  // Data Store
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [summaryData, setSummaryData] = useState<ExecutiveSummary | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryResponse | null>(null);
  const [riskData, setRiskData] = useState<RiskResponse | null>(null);
  const [regionalData, setRegionalData] = useState<RegionalResponse | null>(null);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [aboutData, setAboutData] = useState<AboutResponse | null>(null);

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Check health
      try {
        const health = await apiService.checkHealth();
        setIsBackendHealthy(health.status === 'healthy');
      } catch (hErr) {
        setIsBackendHealthy(false);
      }

      // 2. Fetch parallel dataset queries
      const [
        metaRes,
        summaryRes,
        forecastRes,
        inventoryRes,
        riskRes,
        regionalRes,
        productsRes,
        aboutRes
      ] = await Promise.all([
        apiService.getMetadata(),
        apiService.getExecutiveSummary(),
        apiService.getForecast({
          product_type: selectedCategory,
          location: selectedLocation,
          sku: selectedSku
        }),
        apiService.getInventory({
          product_type: selectedCategory,
          location: selectedLocation
        }),
        apiService.getRisks({
          risk_level: selectedRiskFilter,
          location: selectedLocation,
          product_type: selectedCategory
        }),
        apiService.getRegionalAnalysis(selectedLocation),
        apiService.getProducts({
          search: skuSearchQuery,
          product_type: selectedCategory,
          location: selectedLocation,
          page: skuCurrentPage,
          page_size: 15
        }),
        apiService.getAboutInfo()
      ]);

      setMetadata(metaRes);
      setSummaryData(summaryRes);
      setForecastData(forecastRes);
      setInventoryData(inventoryRes);
      setRiskData(riskRes);
      setRegionalData(regionalRes);
      setProductsData(productsRes);
      setAboutData(aboutRes);
      setIsBackendHealthy(true);
    } catch (err: any) {
      console.error('Failed to load supply chain dataset:', err);
      setError(err.message || 'Failed to communicate with supply chain backend service.');
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedCategory,
    selectedLocation,
    selectedRiskFilter,
    selectedSku,
    skuSearchQuery,
    skuCurrentPage
  ]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Alert counters for sidebar badges
  const riskAlertCount = riskData?.summary?.high_risk_count || 0;
  const criticalStockCount = inventoryData?.summary?.critical_shortage || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        isBackendHealthy={isBackendHealthy}
        totalRecords={metadata?.total_records || 100}
        onRefresh={loadAllData}
        isLoading={isLoading}
      />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          riskAlertCount={riskAlertCount}
          criticalStockCount={criticalStockCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {error && (
            <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs text-rose-200 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="font-semibold text-rose-300">Connection Note:</strong> {error}
                </div>
              </div>
              <button
                onClick={loadAllData}
                className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-500 flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              data={summaryData}
              riskData={riskData}
              onNavigateToForecast={() => setActiveTab('forecasting')}
              onNavigateToInventory={() => setActiveTab('inventory')}
              onNavigateToRisks={() => setActiveTab('risks')}
            />
          )}

          {activeTab === 'forecasting' && (
            <DemandForecasting
              forecastData={forecastData}
              metadata={metadata}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedSku={selectedSku}
              setSelectedSku={setSelectedSku}
              onFilterChange={loadAllData}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryIntelligence
              inventoryData={inventoryData}
              metadata={metadata}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          )}

          {activeTab === 'risks' && (
            <RiskAlertCenter
              riskData={riskData}
              metadata={metadata}
              selectedRiskFilter={selectedRiskFilter}
              setSelectedRiskFilter={setSelectedRiskFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          )}

          {activeTab === 'regions' && (
            <RegionalAnalysis
              regionalData={regionalData}
              metadata={metadata}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
            />
          )}

          {activeTab === 'skus' && (
            <SkuExplorer
              productsData={productsData}
              metadata={metadata}
              searchQuery={skuSearchQuery}
              setSearchQuery={setSkuSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              currentPage={skuCurrentPage}
              setCurrentPage={setSkuCurrentPage}
            />
          )}

          {activeTab === 'about' && (
            <AboutProject aboutData={aboutData} metadata={metadata} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
