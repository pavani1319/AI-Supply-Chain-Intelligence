# AI Supply Chain Intelligence

AI Supply Chain Intelligence is a full-stack data analytics and machine learning application designed to optimize supply chain performance. The system processes ground-truth historical supply chain data to perform **demand forecasting**, **inventory intelligence**, and **supply-chain risk analysis**.

---

## 📌 Project Purpose

In modern supply chain operations, stockouts, inaccurate demand predictions, and high lead times cause revenue loss and operational inefficiencies. This project provides supply chain managers with actionable analytics and machine learning predictions to:
- Predict sales demand for different SKUs and regions.
- Prevent stockouts by identifying critical inventory levels and Reorder Points (ROP).
- Evaluate operational risks across lead times, defects, and logistics performance.

---

## ⭐ Key Features

- **Executive Analytics Dashboard**: High-level KPIs including Total Revenue, Operational Costs, Gross Profit, Total Units Sold, and Average Stock Levels.
- **Machine Learning Demand Simulator**: Interactive demand forecasting using a Scikit-learn `RandomForestRegressor` model with real-time parameter tuning (promotions, lead time, price adjustments).
- **Inventory Intelligence & ROP Tracking**: Automated safety stock and Reorder Point (ROP) tracking with critical stock alerts.
- **Risk & Alert Center**: Explainable risk scoring based on stockout probability, lead-time variance, and supplier defect rates.
- **Regional Logistics Performance**: Granular comparative metrics across regions (East, North, South, West) and transport modes (Air, Rail, Road, Sea).
- **SKU Product Explorer**: Interactive catalog featuring search, filtering, and detailed inventory/cost metrics per SKU.
- **Offline Data Fallback**: Integrated static JSON fallback dataset allowing seamless offline demonstration.

---

## 🛠️ Technology Stack

### **Backend & Machine Learning**
- **Python**: Primary language for data processing and machine learning algorithms.
- **FastAPI**: Lightweight REST API web framework powering analytics endpoints.
- **Uvicorn**: High-performance ASGI web server.
- **Pandas & NumPy**: Data cleaning, aggregation, and mathematical computations.
- **Scikit-learn**: Machine learning pipeline (`RandomForestRegressor`) for demand forecasting.

### **Frontend & Server**
- **React 19 & TypeScript**: Component-based UI framework ensuring type-safe development.
- **Vite**: Modern frontend build tool and dev server.
- **Tailwind CSS**: Modern utility-first styling for visual layout and responsive design.
- **Recharts**: Data visualization library for rendering demand trends and inventory charts.
- **Lucide React**: Vector iconography set.
- **Node.js & Express**: Production web server managing API proxying to FastAPI.

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│               React 19 + Vite Frontend                 │
│         (Executive Dashboard, Risk Center, etc.)       │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / REST (/api/*)
                           ▼
┌────────────────────────────────────────────────────────┐
│             Node.js + Express Proxy Server             │
│            (Handles Static Assets & Routing)           │
└──────────────────────────┬─────────────────────────────┘
                           │ Proxy (Port 8085)
                           ▼
┌────────────────────────────────────────────────────────┐
│                 Python FastAPI Backend                 │
│         (data_processing.py & risk_analysis.py)        │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌──────────────────────┐
│     Scikit-learn ML Engine   │ │ Ground-Truth Dataset │
│   (RandomForestRegressor)    │ │(supply_chain_...csv) │
└──────────────────────────────┘ └──────────────────────┘
```

1. **Frontend**: The React client displays dashboards, metrics, and predictive simulators.
2. **Server / Proxy**: The Express server hosts static assets and proxies API requests starting with `/api/` to port `8085`.
3. **Backend API**: FastAPI processes requests, computes analytics using Pandas, and runs inference with Scikit-learn.
4. **Data Source**: Reads historical supply chain records directly from `data/supply_chain_dataset1.csv`.

---

## 🤖 Machine Learning Methodology

The demand forecasting engine utilizes a **Random Forest Regressor** trained on historical supply chain metrics:
- **Target Variable**: `Units_Sold`
- **Features Used**: `Inventory_Level`, `Supplier_Lead_Time_Days`, `Reorder_Point`, `Order_Quantity`, `Unit_Cost`, `Unit_Price`, `Promotion_Flag`, `Stockout_Flag`, `Region`, `Warehouse_ID`, `Supplier_ID`.
- **Model Pipeline**: Feature extraction, standard scaling, categorical encoding, and ensemble decision tree regression.

---

## 📊 Dataset Information

- **Source File**: `data/supply_chain_dataset1.csv`
- **Total Records**: **91,250 rows**
- **File Size**: Approximately **6.55 MB**
- **Key Attributes**: Date, SKU_ID, Warehouse_ID, Supplier_ID, Region, Units_Sold, Inventory_Level, Supplier_Lead_Time_Days, Reorder_Point, Order_Quantity, Unit_Cost, Unit_Price, Promotion_Flag, Stockout_Flag.

---

## 🖥️ Project Modules

1. **Executive Dashboard**: Macro-level overview of revenue, operational costs, profit margins, and sales volume.
2. **Demand Forecasting**: Interactive machine learning prediction tool with scenario simulation controls.
3. **Inventory Intelligence**: Stock level monitoring, safety stock buffers, and Reorder Point (ROP) thresholds.
4. **Risk Alert Center**: Risk categorization based on stockout vulnerability and supplier delays.
5. **Regional Analysis**: Performance evaluation across geographic zones and shipping modes.
6. **SKU Explorer**: Searchable and filterable master product table.
7. **About Project**: System documentation detailing dataset parameters and machine learning structure.

---

## 🔌 API Endpoints

The FastAPI backend exposes the following REST endpoints on port `8085` (proxied via Express at `/api/*`):

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service status, dataset row count, and ML model training confirmation |
| `/api/summary` | `GET` | Aggregated executive KPIs, product summaries, and location metrics |
| `/api/metadata` | `GET` | Lists distinct SKUs, Regions, Warehouses, and Suppliers |
| `/api/forecast` | `POST` | Runs Scikit-learn Random Forest inference for user-specified input parameters |
| `/api/inventory` | `GET` | Inventory breakdown, stockout risks, and ROP safety status |
| `/api/risks` | `GET` | High-risk alerts categorized by stockout and lead-time severity |
| `/api/regions` | `GET` | Regional sales, shipping cost, and lead-time analytics |
| `/api/products` | `GET` | Complete product catalog list with per-SKU data |
| `/api/about` | `GET` | System specifications and model feature summaries |

---

## 🚀 Local Setup & Installation

### Prerequisites
- **Node.js**: v18+ installed
- **Python**: 3.10+ installed

### Step 1: Install Python Dependencies
Open PowerShell/Terminal in the project directory:
```bash
py -m pip install fastapi uvicorn pydantic pandas numpy scikit-learn
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Run in Development Mode
Launch both the Express proxy server and FastAPI backend concurrently:
```bash
npm run dev
```
Access the application at: **`http://localhost:3000`**

### Step 4: Build & Run in Production
To generate production static bundles and run the production server:
```bash
npm run build
npm run start
```

---

## 🔮 Future Improvements

- **Real-Time Streaming**: Integrate WebSockets for live inventory tracking and real-time alerts.
- **Deep Learning Forecasting**: Implement time-series LSTM / Prophet models for multi-month demand seasonality.
- **Supplier Portals**: Add automated reorder triggers and direct supplier communication channels.
- **Multi-Tenant Authentication**: Role-based access control (RBAC) for regional supply chain managers.
