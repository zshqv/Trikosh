from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["sectors"])

SECTOR_SNAPSHOTS = [
    {
        "sector": "Financial Services",
        "avg_gross_margin": 0.62,
        "avg_roe": 0.131,
        "avg_revenue_growth": 0.072,
        "company_count": 10,
        "analytical_framework": "Financial services companies are best understood through three lenses: asset quality, capital adequacy, and profitability.",
        "key_value_drivers": ["Net interest margin expansion", "Loan growth", "Fee income", "Cost efficiency"],
        "sector_risks": ["Credit cycle deterioration", "NIM compression", "Regulatory capital increases"],
    },
    {
        "sector": "AI & Technology",
        "avg_gross_margin": 0.624,
        "avg_roe": 0.312,
        "avg_revenue_growth": 0.183,
        "company_count": 10,
        "analytical_framework": "Technology companies require separating durable platform advantages from cyclical demand.",
        "key_value_drivers": ["Cloud adoption", "AI infrastructure revenue", "Software subscription transition", "Operating leverage"],
        "sector_risks": ["Antitrust scrutiny", "AI commoditisation", "Cloud spend optimisation", "Geopolitical risk"],
    },
    {
        "sector": "Healthcare",
        "avg_gross_margin": 0.641,
        "avg_roe": 0.224,
        "avg_revenue_growth": 0.064,
        "company_count": 10,
        "analytical_framework": "Healthcare analysis bifurcates by sub-sector. For pharma, the pipeline is the business.",
        "key_value_drivers": ["Drug pipeline approvals", "Biologics pricing power", "Life sciences tool demand", "Managed care enrollment growth"],
        "sector_risks": ["Drug pricing reform", "Patent cliff exposure", "Clinical trial failure", "Biosimilar competition"],
    },
]


@router.get("/sectors")
async def list_sectors():
    return SECTOR_SNAPSHOTS


@router.get("/sectors/{sector}")
async def get_sector(sector: str):
    snapshot = next((s for s in SECTOR_SNAPSHOTS if s["sector"].lower() == sector.lower()), None)
    if not snapshot:
        raise HTTPException(status_code=404, detail=f"Sector '{sector}' not found")
    return snapshot
