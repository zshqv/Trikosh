from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List
from db.session import get_db

router = APIRouter(tags=["companies"])

MOCK_COMPANIES = [
    {"ticker": "JPM", "exchange": "NYSE", "name": "JPMorgan Chase & Co.", "sector": "Financial Services", "industry": "Diversified Banks", "analytical_lens": "The benchmark for large-cap banking — sets the standard against which all US commercial banks are measured."},
    {"ticker": "BAC", "exchange": "NYSE", "name": "Bank of America Corp.", "sector": "Financial Services", "industry": "Diversified Banks", "analytical_lens": "The most rate-sensitive of the mega-banks, making it the clearest lens for understanding net interest margin dynamics across rate cycles."},
    {"ticker": "GS", "exchange": "NYSE", "name": "Goldman Sachs Group Inc.", "sector": "Financial Services", "industry": "Investment Banking & Brokerage", "analytical_lens": "The purest investment bank in the US — analysing GS reveals how capital markets revenues fluctuate with deal activity and market volatility."},
    {"ticker": "MSFT", "exchange": "NASDAQ", "name": "Microsoft Corp.", "sector": "AI & Technology", "industry": "Systems Software", "analytical_lens": "The clearest case study in enterprise cloud transition — Azure's growth trajectory shows how legacy software revenue transforms into recurring cloud revenue."},
    {"ticker": "NVDA", "exchange": "NASDAQ", "name": "NVIDIA Corp.", "sector": "AI & Technology", "industry": "Semiconductors", "analytical_lens": "The infrastructure layer of the AI boom — understanding NVDA is understanding AI capex cycles and the economics of GPU platform monopoly."},
    {"ticker": "AAPL", "exchange": "NASDAQ", "name": "Apple Inc.", "sector": "AI & Technology", "industry": "Technology Hardware & Storage", "analytical_lens": "The premium hardware ecosystem play — Services revenue growth is the story; hardware is the installed base that makes Services economics possible."},
    {"ticker": "JNJ", "exchange": "NYSE", "name": "Johnson & Johnson", "sector": "Healthcare", "industry": "Pharmaceuticals", "analytical_lens": "The diversified healthcare conglomerate benchmark — post-Kenvue spin-off, JNJ is a pure pharma and MedTech story."},
    {"ticker": "UNH", "exchange": "NYSE", "name": "UnitedHealth Group Inc.", "sector": "Healthcare", "industry": "Managed Health Care", "analytical_lens": "The largest US health insurer by revenue, a proxy for understanding managed care economics."},
    {"ticker": "ABBV", "exchange": "NYSE", "name": "AbbVie Inc.", "sector": "Healthcare", "industry": "Pharmaceuticals", "analytical_lens": "The Humira cliff and what comes next — ABBV is the definitive study of patent cliff risk and pipeline-led revenue replacement."},
]


@router.get("/companies")
async def list_companies(
    sector: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    result = MOCK_COMPANIES
    if sector:
        result = [c for c in result if c["sector"] == sector]
    return result[offset: offset + limit]


@router.get("/companies/{ticker}")
async def get_company(ticker: str):
    company = next((c for c in MOCK_COMPANIES if c["ticker"] == ticker.upper()), None)
    if not company:
        raise HTTPException(status_code=404, detail=f"Company '{ticker}' not found")
    return company


@router.get("/companies/{ticker}/peers")
async def get_company_peers(ticker: str):
    company = next((c for c in MOCK_COMPANIES if c["ticker"] == ticker.upper()), None)
    if not company:
        raise HTTPException(status_code=404, detail=f"Company '{ticker}' not found")
    peers = [c for c in MOCK_COMPANIES if c["sector"] == company["sector"] and c["ticker"] != ticker.upper()]
    return peers[:4]
