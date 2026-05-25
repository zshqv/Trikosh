from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["kits"])

RESEARCH_KITS = [
    {
        "id": "bank-analysis-starter",
        "title": "Bank Analysis Starter Kit",
        "description": "A structured framework for analysing commercial and investment banks.",
        "sector": "Financial Services",
        "tickers": ["JPM", "BAC", "GS", "WFC"],
        "metrics": ["ROE", "Net Interest Margin", "CET1 Ratio", "Efficiency Ratio", "Loan-to-Deposit Ratio"],
    },
    {
        "id": "pharma-pipeline-kit",
        "title": "Pharma Pipeline Analysis Kit",
        "description": "A framework for evaluating pharmaceutical companies with emphasis on pipeline valuation.",
        "sector": "Healthcare",
        "tickers": ["JNJ", "ABBV", "MRK", "PFE"],
        "metrics": ["Gross Margin", "R&D Intensity", "Revenue Growth", "Net Margin", "Pipeline Count"],
    },
    {
        "id": "saas-cloud-kit",
        "title": "SaaS & Cloud Fundamentals Kit",
        "description": "A comprehensive framework for analysing software-as-a-service and cloud infrastructure companies.",
        "sector": "AI & Technology",
        "tickers": ["MSFT", "CRM", "ADBE", "ORCL"],
        "metrics": ["FCF Margin", "Revenue Growth", "Gross Margin", "R&D Intensity", "Operating Margin"],
    },
]


@router.get("/kits")
async def list_kits():
    return RESEARCH_KITS


@router.get("/kits/{kit_id}")
async def get_kit(kit_id: str):
    kit = next((k for k in RESEARCH_KITS if k["id"] == kit_id), None)
    if not kit:
        raise HTTPException(status_code=404, detail=f"Research kit '{kit_id}' not found")
    return kit
