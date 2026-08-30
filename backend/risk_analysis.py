"""
Explainable Inventory & Supply Chain Risk Analysis Engine
Calculates deterministic risk scores (0-100) based on verified dataset columns:
- Stock Levels & Stockout Threat
- Lead Times & Manufacturing Delays
- Defect Rates & Quality Inspection Results
- Shipping Times & Carrier Costs
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional

def calculate_sku_risk(row: pd.Series) -> Dict[str, Any]:
    score = 0.0
    risk_factors = []

    stock = float(row.get('Stock levels', 50))
    lead_time = float(row.get('Lead times', 10))
    mfg_lead_time = float(row.get('Manufacturing lead time', 15))
    shipping_time = float(row.get('Shipping times', 3))
    defect_rate = float(row.get('Defect rates', 0.0))
    inspection = str(row.get('Inspection results', 'Pass'))
    demand = float(row.get('Number of products sold', 100))
    shipping_cost = float(row.get('Shipping costs', 5.0))

    # 1. Stockout & Inventory Depletion Threat (Max 35 points)
    if stock <= 10:
        score += 35.0
        risk_factors.append(f"Critical Stockout Threat: Only {int(stock)} units remaining in inventory.")
    elif stock <= 25:
        score += 22.0
        risk_factors.append(f"Low Inventory: Stock is at {int(stock)} units, below safe threshold.")
    elif stock <= 45:
        score += 10.0
        risk_factors.append(f"Moderate Buffer: Stock at {int(stock)} units.")

    # 2. Lead Time & Delivery Vulnerability (Max 25 points)
    total_fulfillment_time = lead_time + mfg_lead_time + shipping_time
    if total_fulfillment_time > 45:
        score += 25.0
        risk_factors.append(f"Severe Fulfillment Lag: Combined lead & mfg time is {int(total_fulfillment_time)} days.")
    elif total_fulfillment_time > 30:
        score += 15.0
        risk_factors.append(f"Extended Lead Time: Replenishment turnaround is {int(total_fulfillment_time)} days.")
    elif lead_time > 20:
        score += 10.0
        risk_factors.append(f"Elevated Supplier Lead Time: Supplier takes {int(lead_time)} days.")

    # 3. Quality & Defect Vulnerability (Max 25 points)
    if inspection.lower() == 'fail':
        score += 15.0
        risk_factors.append("Failed Quality Inspection: Recent batch did not pass QA criteria.")
    elif inspection.lower() == 'pending':
        score += 5.0
        risk_factors.append("Pending Quality Inspection: Batch QA status is unverified.")

    if defect_rate >= 3.5:
        score += 10.0
        risk_factors.append(f"High Defect Rate: Production defect rate is {defect_rate:.2f}%.")
    elif defect_rate >= 2.0:
        score += 5.0
        risk_factors.append(f"Elevated Defect Rate: Defect rate is {defect_rate:.2f}%.")

    # 4. Logistics & Shipping Pressure (Max 15 points)
    if shipping_time >= 7:
        score += 10.0
        risk_factors.append(f"Long Transit Duration: Shipping requires {int(shipping_time)} days.")
    if shipping_cost >= 7.5:
        score += 5.0
        risk_factors.append(f"High Freight Expense: Shipping cost per unit is ${shipping_cost:.2f}.")

    # Cap score at 100
    final_score = min(100.0, round(score, 1))

    # Classification
    if final_score >= 60:
        risk_level = "High Risk"
        badge_color = "red"
    elif final_score >= 35:
        risk_level = "Medium Risk"
        badge_color = "amber"
    else:
        risk_level = "Low Risk"
        badge_color = "emerald"

    primary_reason = risk_factors[0] if risk_factors else "Operational parameters within normal tolerances."

    return {
        "sku": str(row['SKU']),
        "product_type": str(row.get('Product type', '')),
        "location": str(row.get('Location', '')),
        "supplier": str(row.get('Supplier name', '')),
        "carrier": str(row.get('Shipping carriers', '')),
        "risk_score": final_score,
        "risk_level": risk_level,
        "badge_color": badge_color,
        "primary_reason": primary_reason,
        "risk_factors": risk_factors,
        "stock_level": int(stock),
        "lead_time": int(lead_time),
        "shipping_time": int(shipping_time),
        "defect_rate": round(defect_rate, 2),
        "inspection_result": inspection,
        "demand_sold": int(demand)
    }

class SupplyChainRiskAnalyzer:
    def __init__(self, data_processor):
        self.processor = data_processor

    def get_risk_assessment(
        self,
        risk_filter: Optional[str] = None,
        location: Optional[str] = None,
        product_type: Optional[str] = None
    ) -> Dict[str, Any]:
        df = self.processor.df_clean.copy()

        if location and location != "All":
            df = df[df['Location'] == location]
        if product_type and product_type != "All":
            df = df[df['Product type'] == product_type]

        all_assessments = [calculate_sku_risk(row) for _, row in df.iterrows()]

        # Filter by risk level if requested
        if risk_filter and risk_filter != "All":
            filtered_assessments = [a for a in all_assessments if a["risk_level"] == risk_filter]
        else:
            filtered_assessments = all_assessments

        # Sort highest risk score first
        filtered_assessments.sort(key=lambda x: x["risk_score"], reverse=True)

        total_analyzed = len(all_assessments)
        high_risk_count = sum(1 for a in all_assessments if a["risk_level"] == "High Risk")
        med_risk_count = sum(1 for a in all_assessments if a["risk_level"] == "Medium Risk")
        low_risk_count = sum(1 for a in all_assessments if a["risk_level"] == "Low Risk")
        avg_risk_score = round(sum(a["risk_score"] for a in all_assessments) / max(total_analyzed, 1), 1)

        # Risk distribution by Location
        location_risk = {}
        for a in all_assessments:
            loc = a["location"]
            if loc not in location_risk:
                location_risk[loc] = {"location": loc, "high": 0, "medium": 0, "low": 0, "total": 0, "avg_score": 0.0}
            location_risk[loc]["total"] += 1
            location_risk[loc]["avg_score"] += a["risk_score"]
            if a["risk_level"] == "High Risk":
                location_risk[loc]["high"] += 1
            elif a["risk_level"] == "Medium Risk":
                location_risk[loc]["medium"] += 1
            else:
                location_risk[loc]["low"] += 1

        for loc in location_risk:
            cnt = location_risk[loc]["total"]
            location_risk[loc]["avg_score"] = round(location_risk[loc]["avg_score"] / max(cnt, 1), 1)

        # Risk distribution by Product Category
        category_risk = {}
        for a in all_assessments:
            cat = a["product_type"]
            if cat not in category_risk:
                category_risk[cat] = {"category": cat, "high": 0, "medium": 0, "low": 0, "total": 0, "avg_score": 0.0}
            category_risk[cat]["total"] += 1
            category_risk[cat]["avg_score"] += a["risk_score"]
            if a["risk_level"] == "High Risk":
                category_risk[cat]["high"] += 1
            elif a["risk_level"] == "Medium Risk":
                category_risk[cat]["medium"] += 1
            else:
                category_risk[cat]["low"] += 1

        for cat in category_risk:
            cnt = category_risk[cat]["total"]
            category_risk[cat]["avg_score"] = round(category_risk[cat]["avg_score"] / max(cnt, 1), 1)

        return {
            "summary": {
                "total_analyzed": total_analyzed,
                "high_risk_count": high_risk_count,
                "medium_risk_count": med_risk_count,
                "low_risk_count": low_risk_count,
                "avg_risk_score": avg_risk_score,
                "high_risk_pct": round((high_risk_count / max(total_analyzed, 1)) * 100, 1),
                "evaluation_methodology": "Explainable Rule-Based Deterministic Risk Matrix (Weighted factors: Stockout 35%, Fulfillment 25%, QA 25%, Logistics 15%)"
            },
            "location_risk": list(location_risk.values()),
            "category_risk": list(category_risk.values()),
            "records": filtered_assessments
        }
