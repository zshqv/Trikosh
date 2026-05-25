from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["ratios"])

MOCK_RATIOS = {
    "JPM": [
        {"label": "Gross Margin", "value": None, "unit": "PCT", "period": "FY2024"},
        {"label": "Operating Margin", "value": 0.352, "unit": "PCT", "period": "FY2024"},
        {"label": "Net Margin", "value": 0.305, "unit": "PCT", "period": "FY2024"},
        {"label": "ROE", "value": 0.177, "unit": "PCT", "period": "FY2024"},
        {"label": "ROIC", "value": 0.141, "unit": "PCT", "period": "FY2024"},
        {"label": "FCF Margin", "value": 0.182, "unit": "PCT", "period": "FY2024"},
        {"label": "Current Ratio", "value": None, "unit": "RATIO", "period": "FY2024"},
        {"label": "Debt/Equity", "value": 1.28, "unit": "RATIO", "period": "FY2024"},
        {"label": "P/E", "value": 12.8, "unit": "MULTIPLE", "period": "FY2024"},
        {"label": "EV/EBITDA", "value": 9.4, "unit": "MULTIPLE", "period": "FY2024"},
        {"label": "Revenue CAGR", "value": 0.062, "unit": "PCT", "period": "FY2019–FY2024"},
        {"label": "CET1 Ratio", "value": 0.153, "unit": "PCT", "period": "FY2024"},
    ],
    "MSFT": [
        {"label": "Gross Margin", "value": 0.699, "unit": "PCT", "period": "FY2024"},
        {"label": "Operating Margin", "value": 0.446, "unit": "PCT", "period": "FY2024"},
        {"label": "Net Margin", "value": 0.359, "unit": "PCT", "period": "FY2024"},
        {"label": "ROE", "value": 0.352, "unit": "PCT", "period": "FY2024"},
        {"label": "ROIC", "value": 0.286, "unit": "PCT", "period": "FY2024"},
        {"label": "FCF Margin", "value": 0.341, "unit": "PCT", "period": "FY2024"},
        {"label": "Current Ratio", "value": 1.27, "unit": "RATIO", "period": "FY2024"},
        {"label": "Debt/Equity", "value": 0.36, "unit": "RATIO", "period": "FY2024"},
        {"label": "P/E", "value": 34.2, "unit": "MULTIPLE", "period": "FY2024"},
        {"label": "EV/EBITDA", "value": 27.8, "unit": "MULTIPLE", "period": "FY2024"},
        {"label": "Revenue CAGR", "value": 0.148, "unit": "PCT", "period": "FY2019–FY2024"},
        {"label": "R&D Intensity", "value": 0.125, "unit": "PCT", "period": "FY2024"},
    ],
}


@router.get("/ratios/{ticker}")
async def get_ratios(ticker: str):
    ratios = MOCK_RATIOS.get(ticker.upper())
    if ratios is None:
        raise HTTPException(status_code=404, detail=f"No ratios found for '{ticker}'")
    return ratios
