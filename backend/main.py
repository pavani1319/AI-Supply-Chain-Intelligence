"""
FastAPI Backend Application for AI Supply Chain Intelligence
Provides REST endpoints for Dashboard Analytics, ML Demand Forecasting,
Inventory Intelligence, Risk Assessment, Regional Analysis, and SKU Explorer.
"""

import os
import sys
from typing import Optional, Dict, Any
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(__file__))

from data_processing import processor
from ml_model import DemandForecaster
from risk_analysis import SupplyChainRiskAnalyzer

app = FastAPI(
    title="AI Supply Chain Intelligence API",
    description="Backend service for Demand Forecasting, Inventory Optimization & Risk Analytics using Kaggle Supply Chain dataset.",
    version="1.0.0"
)

# Enable CORS for React frontend (supports localhost, Vercel, and Cloud Run origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML Model & Risk Analyzer singletons
forecaster = DemandForecaster(processor)
risk_analyzer = SupplyChainRiskAnalyzer(processor)

class PredictScenarioRequest(BaseModel):
    sku: Optional[str] = None
    product_type: Optional[str] = None
    location: Optional[str] = None
    price: Optional[float] = None
    stock_levels: Optional[int] = None
    lead_times: Optional[int] = None
    order_quantities: Optional[int] = None
    shipping_costs: Optional[float] = None
    production_volumes: Optional[int] = None
    manufacturing_costs: Optional[float] = None

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI Supply Chain Intelligence API",
        "dataset_loaded": not processor.df_clean.empty,
        "dataset_rows": len(processor.df_clean),
        "ml_model_trained": forecaster.is_trained,
        "model_type": "RandomForestRegressor"
    }

@app.get("/api/metadata")
def get_metadata():
    try:
        return processor.get_dataset_metadata()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/summary")
def get_executive_summary():
    try:
        return processor.get_executive_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/forecast")
def get_forecast(
    product_type: Optional[str] = Query("All", description="Filter by product category"),
    location: Optional[str] = Query("All", description="Filter by geographical location"),
    sku: Optional[str] = Query("All", description="Filter by specific SKU")
):
    try:
        return forecaster.get_forecast_overview(
            product_type=product_type,
            location=location,
            sku=sku
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/forecast/predict")
def predict_custom_scenario(req: PredictScenarioRequest):
    try:
        scenario_dict = req.dict(exclude_none=True)
        return forecaster.predict_custom_scenario(scenario_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/inventory")
def get_inventory(
    product_type: Optional[str] = Query("All"),
    location: Optional[str] = Query("All")
):
    try:
        return processor.get_inventory_intelligence(
            product_type=product_type,
            location=location
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/risks")
def get_risks(
    risk_level: Optional[str] = Query("All"),
    location: Optional[str] = Query("All"),
    product_type: Optional[str] = Query("All")
):
    try:
        return risk_analyzer.get_risk_assessment(
            risk_filter=risk_level,
            location=location,
            product_type=product_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/regions")
def get_regions(location: Optional[str] = Query("All")):
    try:
        return processor.get_regional_analysis(location=location)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products")
def get_products(
    search: Optional[str] = Query("", description="Search by SKU, product type, or location"),
    product_type: Optional[str] = Query("All"),
    location: Optional[str] = Query("All"),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100)
):
    try:
        all_skus = processor.get_all_skus()
        
        # Apply filters
        filtered = all_skus
        if product_type and product_type != "All":
            filtered = [s for s in filtered if s["product_type"] == product_type]
        if location and location != "All":
            filtered = [s for s in filtered if s["location"] == location]
        if search:
            query = search.strip().lower()
            filtered = [
                s for s in filtered
                if query in s["sku"].lower() or query in s["product_type"].lower() or query in s["location"].lower() or query in s["supplier_name"].lower()
            ]

        total_count = len(filtered)
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_items = filtered[start_idx:end_idx]

        return {
            "total": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // max(page_size, 1),
            "items": paginated_items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/about")
def get_about_info():
    meta = processor.get_dataset_metadata()
    metrics = forecaster.metrics
    return {
        "title": "AI Supply Chain Intelligence – Demand Forecasting & Inventory Risk Management",
        "author": "Final Year Engineering Project",
        "problem_statement": "Global supply chains struggle with unpredictable customer demand, unexpected stockouts, and hidden supplier bottlenecks. Traditional spreadsheets lack predictive capabilities and fail to correlate operational parameters (lead times, defect rates, manufacturing delays) with inventory risks.",
        "objectives": [
            "Implement a genuine Scikit-learn Machine Learning regression pipeline to accurately forecast product demand (Number of products sold).",
            "Develop an explainable multi-factor inventory risk scoring algorithm that identifies stockout and quality threats.",
            "Formulate dynamic Safety Stock and Reorder Point (ROP) indicators using statistical demand variability and lead time dynamics.",
            "Provide an executive command center with interactive regional, carrier, and SKU exploration."
        ],
        "dataset": {
            "name": "Kaggle Supply Chain Analysis Dataset",
            "total_records": meta["total_records"],
            "total_columns": meta["total_columns"],
            "features": meta["columns"],
            "target_variable": "Number of products sold"
        },
        "ml_model": {
            "algorithm": "Random Forest Regressor (Scikit-learn)",
            "why_chosen": "Random Forest is an ensemble of decision trees using bagging (bootstrap aggregating) and random feature selection. It effectively handles non-linear interactions between prices, lead times, and categorical attributes without overfitting, while providing native feature importance calculations for interpretability.",
            "metrics": metrics
        },
        "architecture": {
            "frontend": "React 19 + TypeScript + Vite + Tailwind CSS + Recharts",
            "backend": "Python 3.10 + FastAPI + Uvicorn",
            "data_ml": "Pandas + NumPy + Scikit-learn",
            "communication": "RESTful JSON API"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8085)
