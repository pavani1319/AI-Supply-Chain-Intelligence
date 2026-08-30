"""
Data Processing Pipeline for AI Supply Chain Intelligence
Handles dataset ingestion, cleaning, summary statistics, and feature transformations
using the Kaggle supply_chain_dataset1.csv file.
"""

import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

DATA_PATHS = [
    os.path.join(os.path.dirname(__file__), "..", "data", "supply_chain_dataset1.csv"),
    os.path.join(os.path.dirname(__file__), "..", "supply_chain_dataset1.csv"),
    os.path.join(os.getcwd(), "data", "supply_chain_dataset1.csv"),
    os.path.join(os.getcwd(), "supply_chain_dataset1.csv"),
]

def find_dataset_path() -> str:
    for path in DATA_PATHS:
        normalized = os.path.abspath(path)
        if os.path.exists(normalized) and os.path.getsize(normalized) > 50:
            return normalized
    raise FileNotFoundError("supply_chain_dataset1.csv was not found in data/ or root directory.")

class SupplyChainDataProcessor:
    def __init__(self):
        self.csv_path = find_dataset_path()
        self.df_raw: pd.DataFrame = pd.DataFrame()
        self.df_clean: pd.DataFrame = pd.DataFrame()
        self.load_and_clean_data()

    def load_and_clean_data(self) -> pd.DataFrame:
        self.df_raw = pd.read_csv(self.csv_path)
        df = self.df_raw.copy()

        # Clean column names (strip whitespace)
        df.columns = [c.strip() for c in df.columns]

        # Check if using actual columns of supply_chain_dataset1.csv
        if 'SKU_ID' in df.columns:
            df['SKU'] = df['SKU_ID']
            df['Location'] = df['Region']
            df['Warehouse'] = df['Warehouse_ID']
            df['Supplier name'] = df['Supplier_ID']
            df['Number of products sold'] = df['Units_Sold']
            df['Stock levels'] = df['Inventory_Level']
            df['Lead times'] = df['Supplier_Lead_Time_Days']
            df['Order quantities'] = df['Order_Quantity']
            df['Price'] = df['Unit_Price']
            df['Cost'] = df['Unit_Cost']
            df['Costs'] = (df['Units_Sold'] * df['Unit_Cost']).round(2)
            df['Revenue generated'] = (df['Units_Sold'] * df['Unit_Price']).round(2)

            def assign_category(sku):
                try:
                    num = int(str(sku).replace('SKU_', ''))
                    if num <= 15: return 'Electronics & Hardware'
                    elif num <= 30: return 'Industrial Components'
                    else: return 'Consumer Goods'
                except:
                    return 'General Products'

            df['Product type'] = df['SKU_ID'].apply(assign_category)
            df['Shipping times'] = np.maximum(1, (df['Supplier_Lead_Time_Days'] * 0.3).astype(int))
            df['Manufacturing lead time'] = np.maximum(1, (df['Supplier_Lead_Time_Days'] * 0.7).astype(int))
            df['Shipping costs'] = (df['Unit_Cost'] * 0.05).round(2)
            df['Shipping carriers'] = df['Warehouse_ID'].map({'WH_1': 'Carrier A', 'WH_2': 'Carrier B', 'WH_3': 'Carrier C', 'WH_4': 'Carrier A', 'WH_5': 'Carrier B'})
            df['Transportation modes'] = df['Region'].map({'West': 'Air', 'North': 'Road', 'South': 'Rail', 'East': 'Sea'})
            df['Routes'] = df['Warehouse_ID'].map({'WH_1': 'Route A', 'WH_2': 'Route B', 'WH_3': 'Route C', 'WH_4': 'Route A', 'WH_5': 'Route B'})
            df['Inspection results'] = np.where(df['Stockout_Flag'] == 1, 'Fail', 'Pass')
            df['Defect rates'] = np.where(df['Stockout_Flag'] == 1, 3.5, 0.8)
            df['Availability'] = np.maximum(0, df['Inventory_Level'])
            df['Production volumes'] = df['Units_Sold'] + df['Order_Quantity']
            df['Manufacturing costs'] = (df['Unit_Cost'] * 0.8).round(2)
            df['Customer demographics'] = 'B2B Commercial'

        # Ensure numeric columns are properly typed
        numeric_cols = [
            'Price', 'Availability', 'Number of products sold', 'Revenue generated',
            'Stock levels', 'Lead times', 'Order quantities', 'Shipping times',
            'Shipping costs', 'Production volumes', 'Manufacturing lead time',
            'Manufacturing costs', 'Defect rates', 'Costs', 'Units_Sold', 'Inventory_Level',
            'Supplier_Lead_Time_Days', 'Reorder_Point', 'Unit_Cost', 'Unit_Price', 'Demand_Forecast'
        ]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        # Drop exact duplicates if any
        df = df.drop_duplicates().reset_index(drop=True)

        # Feature Engineering:
        df['Total lead time'] = df['Lead times'] + df['Manufacturing lead time'] + df['Shipping times']
        df['Gross profit'] = df['Revenue generated'] - df['Costs']
        df['Profit margin %'] = np.where(df['Revenue generated'] > 0, ((df['Revenue generated'] - df['Costs']) / df['Revenue generated']) * 100, 0)
        df['Profit margin %'] = df['Profit margin %'].clip(-100, 100)
        df['Inventory turnover ratio'] = (df['Number of products sold'] / np.maximum(df['Stock levels'], 1)).round(2)

        reorder_threshold = df['Reorder_Point'] if 'Reorder_Point' in df.columns else 20
        df['Is low stock'] = (df['Stock levels'] <= reorder_threshold) | (df.get('Stockout_Flag', 0) == 1)
        df['Is critical stock'] = (df['Stock levels'] <= (reorder_threshold * 0.5)) | (df.get('Stockout_Flag', 0) == 1)

        self.df_clean = df
        return self.df_clean

    def get_dataset_metadata(self) -> Dict[str, Any]:
        df = self.df_clean
        return {
            "total_records": int(len(df)),
            "total_columns": int(len(df.columns)),
            "columns": list(df.columns),
            "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
            "missing_values": {col: int(self.df_raw[col].isnull().sum()) if col in self.df_raw.columns else 0 for col in df.columns},
            "product_types": sorted(df['Product type'].unique().tolist()) if 'Product type' in df.columns else [],
            "locations": sorted(df['Location'].unique().tolist()) if 'Location' in df.columns else [],
            "carriers": sorted(df['Shipping carriers'].unique().tolist()) if 'Shipping carriers' in df.columns else [],
            "suppliers": sorted(df['Supplier name'].unique().tolist()) if 'Supplier name' in df.columns else [],
            "transportation_modes": sorted(df['Transportation modes'].unique().tolist()) if 'Transportation modes' in df.columns else [],
            "routes": sorted(df['Routes'].unique().tolist()) if 'Routes' in df.columns else [],
            "sku_count": int(df['SKU'].nunique()) if 'SKU' in df.columns else 0,
        }

    def get_executive_summary(self) -> Dict[str, Any]:
        df = self.df_clean
        
        total_units_sold = int(df['Number of products sold'].sum()) if 'Number of products sold' in df.columns else 0
        total_revenue = float(df['Revenue generated'].sum()) if 'Revenue generated' in df.columns else 0.0
        avg_stock_level = float(df['Stock levels'].mean()) if 'Stock levels' in df.columns else 0.0
        total_inventory_items = int(df['Stock levels'].sum()) if 'Stock levels' in df.columns else 0
        avg_lead_time = float(df['Lead times'].mean()) if 'Lead times' in df.columns else 0.0
        avg_shipping_time = float(df['Shipping times'].mean()) if 'Shipping times' in df.columns else 0.0
        avg_manufacturing_lead_time = float(df['Manufacturing lead time'].mean()) if 'Manufacturing lead time' in df.columns else 0.0
        avg_defect_rate = float(df['Defect rates'].mean()) if 'Defect rates' in df.columns else 0.0
        total_costs = float(df['Costs'].sum()) if 'Costs' in df.columns else 0.0
        
        critical_stock_count = int(df['Is critical stock'].sum()) if 'Is critical stock' in df.columns else 0
        low_stock_count = int(df['Is low stock'].sum()) if 'Is low stock' in df.columns else 0
        
        # Product type performance
        product_performance = []
        if 'Product type' in df.columns:
            grouped = df.groupby('Product type').agg({
                'Number of products sold': ['sum', 'mean'],
                'Revenue generated': 'sum',
                'Stock levels': 'mean',
                'Costs': 'sum',
                'Defect rates': 'mean',
                'SKU': 'count'
            }).reset_index()
            for _, row in grouped.iterrows():
                product_performance.append({
                    "product_type": str(row['Product type'].values[0] if hasattr(row['Product type'], 'values') else row['Product type']),
                    "total_sold": int(row[('Number of products sold', 'sum')]),
                    "avg_sold": round(float(row[('Number of products sold', 'mean')]), 1),
                    "total_revenue": round(float(row[('Revenue generated', 'sum')]), 2),
                    "avg_stock": round(float(row[('Stock levels', 'mean')]), 1),
                    "total_costs": round(float(row[('Costs', 'sum')]), 2),
                    "avg_defect_rate": round(float(row[('Defect rates', 'mean')]), 2),
                    "sku_count": int(row[('SKU', 'count')])
                })

        # Location performance
        location_performance = []
        if 'Location' in df.columns:
            grouped_loc = df.groupby('Location').agg({
                'Number of products sold': 'sum',
                'Revenue generated': 'sum',
                'Stock levels': 'mean',
                'Lead times': 'mean',
                'Shipping costs': 'mean',
                'SKU': 'count'
            }).reset_index()
            for _, row in grouped_loc.iterrows():
                location_performance.append({
                    "location": str(row['Location']),
                    "total_sold": int(row['Number of products sold']),
                    "total_revenue": round(float(row['Revenue generated']), 2),
                    "avg_stock": round(float(row['Stock levels']), 1),
                    "avg_lead_time": round(float(row['Lead times']), 1),
                    "avg_shipping_cost": round(float(row['Shipping costs']), 2),
                    "sku_count": int(row['SKU'])
                })

        # Transportation mode comparison
        transport_summary = []
        if 'Transportation modes' in df.columns:
            grouped_tr = df.groupby('Transportation modes').agg({
                'Shipping costs': 'mean',
                'Shipping times': 'mean',
                'Costs': 'sum',
                'SKU': 'count'
            }).reset_index()
            for _, row in grouped_tr.iterrows():
                transport_summary.append({
                    "mode": str(row['Transportation modes']),
                    "avg_shipping_cost": round(float(row['Shipping costs']), 2),
                    "avg_shipping_time": round(float(row['Shipping times']), 1),
                    "total_cost": round(float(row['Costs']), 2),
                    "shipment_count": int(row['SKU'])
                })

        return {
            "kpis": {
                "total_units_sold": total_units_sold,
                "total_revenue": round(total_revenue, 2),
                "total_inventory_items": total_inventory_items,
                "avg_stock_level": round(avg_stock_level, 1),
                "critical_stock_count": critical_stock_count,
                "low_stock_count": low_stock_count,
                "avg_lead_time_days": round(avg_lead_time, 1),
                "avg_shipping_time_days": round(avg_shipping_time, 1),
                "avg_manufacturing_lead_time_days": round(avg_manufacturing_lead_time, 1),
                "avg_defect_rate_pct": round(avg_defect_rate, 2),
                "total_operational_costs": round(total_costs, 2),
                "gross_profit": round(total_revenue - total_costs, 2),
            },
            "product_performance": product_performance,
            "location_performance": location_performance,
            "transport_summary": transport_summary,
        }

    def get_inventory_intelligence(self, product_type: Optional[str] = None, location: Optional[str] = None) -> Dict[str, Any]:
        df = self.df_clean.copy()
        if product_type and product_type != "All":
            df = df[df['Product type'] == product_type]
        if location and location != "All":
            df = df[df['Location'] == location]

        # Calculate safety stock formula: Safety Stock = (Max Daily Demand * Max Lead Time) - (Avg Daily Demand * Avg Lead Time)
        # In this dataset, we compute standard deviation of demand * sqrt(Lead times) * 1.65 (for 95% service level)
        avg_demand = df['Number of products sold'].mean() if not df.empty else 0
        std_demand = df['Number of products sold'].std() if len(df) > 1 else 0

        inventory_items = []
        for _, row in df.iterrows():
            lead_time = float(row.get('Lead times', 1))
            stock = float(row.get('Stock levels', 0))
            order_qty = float(row.get('Order quantities', 0))
            demand = float(row.get('Number of products sold', 0))
            price = float(row.get('Price', 0))
            availability = float(row.get('Availability', 0))

            # Safety stock estimate based on lead time and demand variability
            # Reorder Point (ROP) = (Demand per lead time period) + Safety Stock
            # Simplified proxy for SKU batch:
            daily_demand_proxy = demand / 30.0 # assume monthly batch
            safety_stock = round(max(5.0, 1.65 * (std_demand / 10.0 if std_demand > 0 else 5) * np.sqrt(max(1.0, lead_time))), 1)
            reorder_point = round((daily_demand_proxy * lead_time) + safety_stock, 1)

            status = "Sufficient"
            if stock <= 10:
                status = "Critical Shortage"
            elif stock <= reorder_point or stock <= 25:
                status = "Reorder Needed"
            elif stock > (reorder_point * 3) and stock > 75:
                status = "Overstocked"

            inventory_items.append({
                "sku": str(row['SKU']),
                "product_type": str(row.get('Product type', '')),
                "location": str(row.get('Location', '')),
                "supplier": str(row.get('Supplier name', '')),
                "stock_level": int(stock),
                "availability": int(availability),
                "order_quantity": int(order_qty),
                "lead_time_days": int(lead_time),
                "manufacturing_lead_time_days": int(row.get('Manufacturing lead time', 0)),
                "number_sold": int(demand),
                "price": round(price, 2),
                "inventory_value": round(stock * price, 2),
                "safety_stock": safety_stock,
                "reorder_point": reorder_point,
                "stock_status": status,
                "turnover_ratio": float(row.get('Inventory turnover ratio', 0)),
            })

        # Summary statistics
        total_items = len(inventory_items)
        critical_count = sum(1 for item in inventory_items if item["stock_status"] == "Critical Shortage")
        reorder_count = sum(1 for item in inventory_items if item["stock_status"] == "Reorder Needed")
        sufficient_count = sum(1 for item in inventory_items if item["stock_status"] == "Sufficient")
        overstock_count = sum(1 for item in inventory_items if item["stock_status"] == "Overstocked")
        total_inventory_value = sum(item["inventory_value"] for item in inventory_items)

        # Inventory by Category Breakdown
        by_category = {}
        for item in inventory_items:
            cat = item["product_type"]
            if cat not in by_category:
                by_category[cat] = {"category": cat, "total_stock": 0, "total_value": 0.0, "critical_items": 0, "reorder_items": 0, "count": 0}
            by_category[cat]["total_stock"] += item["stock_level"]
            by_category[cat]["total_value"] += item["inventory_value"]
            by_category[cat]["count"] += 1
            if item["stock_status"] in ["Critical Shortage"]:
                by_category[cat]["critical_items"] += 1
            if item["stock_status"] in ["Reorder Needed"]:
                by_category[cat]["reorder_items"] += 1

        return {
            "summary": {
                "total_skus": total_items,
                "critical_shortage": critical_count,
                "reorder_needed": reorder_count,
                "sufficient_stock": sufficient_count,
                "overstocked": overstock_count,
                "total_inventory_value": round(total_inventory_value, 2),
                "avg_stock_per_sku": round(sum(i['stock_level'] for i in inventory_items) / max(total_items, 1), 1)
            },
            "by_category": list(by_category.values()),
            "items": inventory_items
        }

    def get_regional_analysis(self, location: Optional[str] = None) -> Dict[str, Any]:
        df = self.df_clean.copy()
        
        # Aggregation by location
        regional_stats = []
        locations = df['Location'].unique().tolist() if 'Location' in df.columns else []
        
        for loc in sorted(locations):
            loc_df = df[df['Location'] == loc]
            total_sold = int(loc_df['Number of products sold'].sum())
            total_revenue = float(loc_df['Revenue generated'].sum())
            avg_stock = float(loc_df['Stock levels'].mean())
            avg_lead_time = float(loc_df['Lead times'].mean())
            avg_shipping_time = float(loc_df['Shipping times'].mean())
            avg_shipping_cost = float(loc_df['Shipping costs'].mean())
            avg_defect_rate = float(loc_df['Defect rates'].mean())
            critical_stocks = int(loc_df['Is critical stock'].sum())
            sku_count = int(len(loc_df))

            # Carrier breakdown in region
            carriers = loc_df['Shipping carriers'].value_counts().to_dict()
            # Transport modes
            modes = loc_df['Transportation modes'].value_counts().to_dict()

            regional_stats.append({
                "location": str(loc),
                "sku_count": sku_count,
                "total_units_sold": total_sold,
                "total_revenue": round(total_revenue, 2),
                "avg_stock_level": round(avg_stock, 1),
                "avg_lead_time": round(avg_lead_time, 1),
                "avg_shipping_time": round(avg_shipping_time, 1),
                "avg_shipping_cost": round(avg_shipping_cost, 2),
                "avg_defect_rate": round(avg_defect_rate, 2),
                "critical_stock_count": critical_stock_count,
                "carriers": carriers,
                "transport_modes": modes,
            })

        # Filtered SKUs for detailed table
        if location and location != "All":
            filtered_df = df[df['Location'] == location]
        else:
            filtered_df = df

        sku_details = []
        for _, row in filtered_df.iterrows():
            sku_details.append({
                "sku": str(row['SKU']),
                "product_type": str(row.get('Product type', '')),
                "location": str(row.get('Location', '')),
                "sold": int(row.get('Number of products sold', 0)),
                "revenue": round(float(row.get('Revenue generated', 0)), 2),
                "stock": int(row.get('Stock levels', 0)),
                "lead_time": int(row.get('Lead times', 0)),
                "shipping_cost": round(float(row.get('Shipping costs', 0)), 2),
                "carrier": str(row.get('Shipping carriers', '')),
                "route": str(row.get('Routes', ''))
            })

        return {
            "regional_overview": regional_stats,
            "sku_details": sku_details
        }

    def get_all_skus(self) -> List[Dict[str, Any]]:
        df = self.df_clean
        results = []
        for _, row in df.iterrows():
            results.append({
                "sku": str(row['SKU']),
                "product_type": str(row.get('Product type', '')),
                "price": round(float(row.get('Price', 0)), 2),
                "availability": int(row.get('Availability', 0)),
                "number_of_products_sold": int(row.get('Number of products sold', 0)),
                "revenue_generated": round(float(row.get('Revenue generated', 0)), 2),
                "customer_demographics": str(row.get('Customer demographics', '')),
                "stock_levels": int(row.get('Stock levels', 0)),
                "lead_times": int(row.get('Lead times', 0)),
                "order_quantities": int(row.get('Order quantities', 0)),
                "shipping_times": int(row.get('Shipping times', 0)),
                "shipping_carriers": str(row.get('Shipping carriers', '')),
                "shipping_costs": round(float(row.get('Shipping costs', 0)), 2),
                "supplier_name": str(row.get('Supplier name', '')),
                "location": str(row.get('Location', '')),
                "production_volumes": int(row.get('Production volumes', 0)),
                "manufacturing_lead_time": int(row.get('Manufacturing lead time', 0)),
                "manufacturing_costs": round(float(row.get('Manufacturing costs', 0)), 2),
                "inspection_results": str(row.get('Inspection results', '')),
                "defect_rates": round(float(row.get('Defect rates', 0)), 2),
                "transportation_modes": str(row.get('Transportation modes', '')),
                "routes": str(row.get('Routes', '')),
                "costs": round(float(row.get('Costs', 0)), 2),
                "profit_margin_pct": round(float(row.get('Profit margin %', 0)), 2)
            })
        return results

# Singleton instance
processor = SupplyChainDataProcessor()
