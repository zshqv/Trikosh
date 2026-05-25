from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List

router = APIRouter(tags=["financials"])

MOCK_FINANCIALS = {
    "JPM": [
        {"period": "FY2024", "metric": "revenue", "value": 162.4e9, "unit": "USD", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "net_income", "value": 49.6e9, "unit": "USD", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "roe", "value": 0.177, "unit": "PCT", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "nim", "value": 0.027, "unit": "PCT", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "cet1", "value": 0.153, "unit": "PCT", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
    ],
    "MSFT": [
        {"period": "FY2024", "metric": "revenue", "value": 245.1e9, "unit": "USD", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "net_income", "value": 88.1e9, "unit": "USD", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "gross_margin", "value": 0.699, "unit": "PCT", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
        {"period": "FY2024", "metric": "fcf_margin", "value": 0.341, "unit": "PCT", "source": "SEC 10-K", "standard": "GAAP", "currency": "USD"},
    ],
}


@router.get("/companies/{ticker}/financials")
async def get_financials(
    ticker: str,
    metrics: Optional[List[str]] = Query(None),
    period_start: Optional[str] = None,
    period_end: Optional[str] = None,
):
    data = MOCK_FINANCIALS.get(ticker.upper())
    if data is None:
        raise HTTPException(status_code=404, detail=f"No financials found for '{ticker}'")
    if metrics:
        data = [d for d in data if d["metric"] in metrics]
    return data
