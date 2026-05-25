from fastapi import APIRouter, Query, HTTPException

router = APIRouter(tags=["search"])

COMPANIES = [
    {"ticker": "JPM", "name": "JPMorgan Chase & Co.", "sector": "Financial Services"},
    {"ticker": "BAC", "name": "Bank of America Corp.", "sector": "Financial Services"},
    {"ticker": "GS", "name": "Goldman Sachs Group Inc.", "sector": "Financial Services"},
    {"ticker": "MS", "name": "Morgan Stanley", "sector": "Financial Services"},
    {"ticker": "BLK", "name": "BlackRock Inc.", "sector": "Financial Services"},
    {"ticker": "WFC", "name": "Wells Fargo & Co.", "sector": "Financial Services"},
    {"ticker": "AXP", "name": "American Express Co.", "sector": "Financial Services"},
    {"ticker": "C", "name": "Citigroup Inc.", "sector": "Financial Services"},
    {"ticker": "USB", "name": "U.S. Bancorp", "sector": "Financial Services"},
    {"ticker": "PNC", "name": "PNC Financial Services Group", "sector": "Financial Services"},
    {"ticker": "MSFT", "name": "Microsoft Corp.", "sector": "AI & Technology"},
    {"ticker": "GOOGL", "name": "Alphabet Inc.", "sector": "AI & Technology"},
    {"ticker": "NVDA", "name": "NVIDIA Corp.", "sector": "AI & Technology"},
    {"ticker": "META", "name": "Meta Platforms Inc.", "sector": "AI & Technology"},
    {"ticker": "AMZN", "name": "Amazon.com Inc.", "sector": "AI & Technology"},
    {"ticker": "AAPL", "name": "Apple Inc.", "sector": "AI & Technology"},
    {"ticker": "CRM", "name": "Salesforce Inc.", "sector": "AI & Technology"},
    {"ticker": "ADBE", "name": "Adobe Inc.", "sector": "AI & Technology"},
    {"ticker": "ORCL", "name": "Oracle Corp.", "sector": "AI & Technology"},
    {"ticker": "INTC", "name": "Intel Corp.", "sector": "AI & Technology"},
    {"ticker": "JNJ", "name": "Johnson & Johnson", "sector": "Healthcare"},
    {"ticker": "UNH", "name": "UnitedHealth Group Inc.", "sector": "Healthcare"},
    {"ticker": "PFE", "name": "Pfizer Inc.", "sector": "Healthcare"},
    {"ticker": "ABBV", "name": "AbbVie Inc.", "sector": "Healthcare"},
    {"ticker": "MRK", "name": "Merck & Co. Inc.", "sector": "Healthcare"},
    {"ticker": "TMO", "name": "Thermo Fisher Scientific Inc.", "sector": "Healthcare"},
    {"ticker": "ABT", "name": "Abbott Laboratories", "sector": "Healthcare"},
    {"ticker": "DHR", "name": "Danaher Corp.", "sector": "Healthcare"},
    {"ticker": "BMY", "name": "Bristol-Myers Squibb Co.", "sector": "Healthcare"},
    {"ticker": "AMGN", "name": "Amgen Inc.", "sector": "Healthcare"},
]

SECTORS = [
    {"name": "Financial Services", "description": "Banks, asset managers, insurance, and payments."},
    {"name": "AI & Technology", "description": "Semiconductors, enterprise software, cloud infrastructure."},
    {"name": "Healthcare", "description": "Pharmaceuticals, biotechnology, managed care, medical devices."},
]

GLOSSARY_TERMS = [
    "Revenue", "Gross Margin", "EBITDA", "Free Cash Flow", "P/E Ratio",
    "Return on Equity", "Net Interest Margin", "R&D Intensity", "CET1 Ratio", "Operating Leverage",
]


@router.get("/search")
async def search(q: str = Query(..., min_length=2)):
    q_lower = q.lower()

    matched_companies = [
        c for c in COMPANIES
        if q_lower in c["ticker"].lower() or q_lower in c["name"].lower()
    ][:5]

    matched_sectors = [
        s for s in SECTORS
        if q_lower in s["name"].lower()
    ][:5]

    matched_terms = [
        t for t in GLOSSARY_TERMS
        if q_lower in t.lower()
    ][:5]

    return {
        "companies": matched_companies,
        "sectors": matched_sectors,
        "terms": matched_terms,
    }
