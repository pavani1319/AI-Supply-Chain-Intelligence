export interface DatasetMetadata {
  total_records: number;
  total_columns: number;
  columns: string[];
  data_types: Record<string, string>;
  missing_values: Record<string, number>;
  product_types: string[];
  locations: string[];
  carriers: string[];
  suppliers: string[];
  transportation_modes: string[];
  routes: string[];
  sku_count: number;
}

export interface ExecutiveSummary {
  kpis: {
    total_units_sold: number;
    total_revenue: number;
    total_inventory_items: number;
    avg_stock_level: number;
    critical_stock_count: number;
    low_stock_count: number;
    avg_lead_time_days: number;
    avg_shipping_time_days: number;
    avg_manufacturing_lead_time_days: number;
    avg_defect_rate_pct: number;
    total_operational_costs: number;
    gross_profit: number;
  };
  product_performance: Array<{
    product_type: string;
    total_sold: number;
    avg_sold: number;
    total_revenue: number;
    avg_stock: number;
    total_costs: number;
    avg_defect_rate: number;
    sku_count: number;
  }>;
  location_performance: Array<{
    location: string;
    total_sold: number;
    total_revenue: number;
    avg_stock: number;
    avg_lead_time: number;
    avg_shipping_cost: number;
    sku_count: number;
  }>;
  transport_summary: Array<{
    mode: string;
    avg_shipping_cost: number;
    avg_shipping_time: number;
    total_cost: number;
    shipment_count: number;
  }>;
}

export interface MLMetrics {
  mae: number;
  rmse: number;
  r2_score: number;
  mape_pct: number;
  train_samples: number;
  test_samples: number;
  model_type: string;
  n_estimators: number;
  max_depth: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface ForecastRecord {
  sku: string;
  product_type: string;
  location: string;
  actual: number;
  predicted: number;
  error: number;
  split: string;
}

export interface ForecastResponse {
  metrics: MLMetrics;
  top_features: FeatureImportance[];
  all_features: FeatureImportance[];
  summary: {
    total_records_evaluated: number;
    total_actual_demand: number;
    total_predicted_demand: number;
    avg_actual_demand: number;
    avg_predicted_demand: number;
    forecast_bias: number;
  };
  comparison_data: ForecastRecord[];
}

export interface ScenarioPredictionResponse {
  sku: string;
  product_type: string;
  location: string;
  predicted_demand: number;
  actual_demand: number;
  delta: number;
  inputs: Record<string, any>;
}

export interface InventoryItem {
  sku: string;
  product_type: string;
  location: string;
  supplier: string;
  stock_level: number;
  availability: number;
  order_quantity: number;
  lead_time_days: number;
  manufacturing_lead_time_days: number;
  number_sold: number;
  price: number;
  inventory_value: number;
  safety_stock: number;
  reorder_point: number;
  stock_status: 'Critical Shortage' | 'Reorder Needed' | 'Sufficient' | 'Overstocked';
  turnover_ratio: number;
}

export interface InventoryResponse {
  summary: {
    total_skus: number;
    critical_shortage: number;
    reorder_needed: number;
    sufficient_stock: number;
    overstocked: number;
    total_inventory_value: number;
    avg_stock_per_sku: number;
  };
  by_category: Array<{
    category: string;
    total_stock: number;
    total_value: number;
    critical_items: number;
    reorder_items: number;
    count: number;
  }>;
  items: InventoryItem[];
}

export interface RiskRecord {
  sku: string;
  product_type: string;
  location: string;
  supplier: string;
  carrier: string;
  risk_score: number;
  risk_level: 'High Risk' | 'Medium Risk' | 'Low Risk';
  badge_color: 'red' | 'amber' | 'emerald';
  primary_reason: string;
  risk_factors: string[];
  stock_level: number;
  lead_time: number;
  shipping_time: number;
  defect_rate: number;
  inspection_result: string;
  demand_sold: number;
}

export interface RiskResponse {
  summary: {
    total_analyzed: number;
    high_risk_count: number;
    medium_risk_count: number;
    low_risk_count: number;
    avg_risk_score: number;
    high_risk_pct: number;
    evaluation_methodology: string;
  };
  location_risk: Array<{
    location: string;
    high: number;
    medium: number;
    low: number;
    total: number;
    avg_score: number;
  }>;
  category_risk: Array<{
    category: string;
    high: number;
    medium: number;
    low: number;
    total: number;
    avg_score: number;
  }>;
  records: RiskRecord[];
}

export interface RegionalOverview {
  location: string;
  sku_count: number;
  total_units_sold: number;
  total_revenue: number;
  avg_stock_level: number;
  avg_lead_time: number;
  avg_shipping_time: number;
  avg_shipping_cost: number;
  avg_defect_rate: number;
  critical_stock_count: number;
  carriers: Record<string, number>;
  transport_modes: Record<string, number>;
}

export interface RegionalResponse {
  regional_overview: RegionalOverview[];
  sku_details: Array<{
    sku: string;
    product_type: string;
    location: string;
    sold: number;
    revenue: number;
    stock: number;
    lead_time: number;
    shipping_cost: number;
    carrier: string;
    route: string;
  }>;
}

export interface SKUProduct {
  sku: string;
  product_type: string;
  price: number;
  availability: number;
  number_of_products_sold: number;
  revenue_generated: number;
  customer_demographics: string;
  stock_levels: number;
  lead_times: number;
  order_quantities: number;
  shipping_times: number;
  shipping_carriers: string;
  shipping_costs: number;
  supplier_name: string;
  location: string;
  production_volumes: number;
  manufacturing_lead_time: number;
  manufacturing_costs: number;
  inspection_results: string;
  defect_rates: number;
  transportation_modes: string;
  routes: string;
  costs: number;
  profit_margin_pct: number;
}

export interface ProductsResponse {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: SKUProduct[];
}

export interface AboutResponse {
  title: string;
  author: string;
  problem_statement: string;
  objectives: string[];
  dataset: {
    name: string;
    total_records: number;
    total_columns: number;
    features: string[];
    target_variable: string;
  };
  ml_model: {
    algorithm: string;
    why_chosen: string;
    metrics: MLMetrics;
  };
  architecture: {
    frontend: string;
    backend: string;
    data_ml: string;
    communication: string;
  };
}
