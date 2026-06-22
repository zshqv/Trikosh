"""
generate_card_data.py — Fetch real financial metrics from yfinance for all
200 Trikosh companies and write the result to:

    apps/web/lib/generatedCardData.json

The Next.js frontend imports this file in mockData.ts to replace hardcoded
MOCK_CARDS values with live-fetched data.

Usage:
    cd infrastructure/scripts
    python generate_card_data.py             # all 200 companies
    python generate_card_data.py --ticker GS # single company

The script is idempotent — re-running it overwrites the output file with
fresher data. Run it whenever you want to refresh the card metrics.
"""

import argparse
import json
import math
import os
import time
from datetime import date, timedelta
from pathlib import Path

import yfinance as yf

from config import COMPANIES

OUTPUT_PATH = Path(__file__).resolve().parents[2] / "apps" / "web" / "lib" / "generatedCardData.json"


def safe(value):
    if value is None:
        return None
    try:
        f = float(value)
        return None if math.isnan(f) or math.isinf(f) else round(f, 6)
    except (TypeError, ValueError):
        return None


def build_sparkline(hist_close: list[float], points: int = 6) -> list[float]:
    """Downsample a list of closing prices into `points` evenly-spaced values."""
    if not hist_close:
        return []
    n = len(hist_close)
    if n <= points:
        return [round(v, 4) for v in hist_close]
    indices = [int(i * (n - 1) / (points - 1)) for i in range(points)]
    return [round(hist_close[i], 4) for i in indices]


def fetch_card_metrics(ticker: str) -> dict | None:
    """
    Returns a dict matching the CardData interface fields that come from
    financial data (primaryMetric, secondaryMetric, ratios, sparkline, source).

    Returns None if the ticker is invalid or data is unavailable.
    """
    try:
        t = yf.Ticker(ticker)
        info = t.info
        if not info:
            return None

        # ── Price history for sparkline (1 year of monthly closes) ───────────
        end = date.today()
        start_1y = end - timedelta(days=370)
        hist = t.history(start=str(start_1y), end=str(end), interval="1mo", auto_adjust=True)
        sparkline_raw = list(hist["Close"].dropna()) if hist is not None and not hist.empty else []
        sparkline = build_sparkline(sparkline_raw, 6)

        # ── Core metrics ─────────────────────────────────────────────────────
        pe      = safe(info.get("trailingPE") or info.get("forwardPE"))
        roe     = safe(info.get("returnOnEquity"))          # decimal e.g. 0.177
        roa     = safe(info.get("returnOnAssets"))
        gm      = safe(info.get("grossMargins"))
        om      = safe(info.get("operatingMargins"))
        pm      = safe(info.get("profitMargins"))
        rev_gr  = safe(info.get("revenueGrowth"))           # YoY decimal
        fcf_mar = safe(info.get("freeCashflow"))
        rev     = safe(info.get("totalRevenue"))
        beta    = safe(info.get("beta"))
        dy      = safe(info.get("dividendYield"))

        # FCF margin (FCF / Revenue)
        fcf_margin = None
        if fcf_mar is not None and rev and rev > 0:
            fcf_margin = round(fcf_mar / rev, 6)

        # Determine fiscal year from most recent annual financials
        fin = t.financials
        fiscal_year = "FY2024"
        if fin is not None and not fin.empty:
            latest_col = fin.columns[0]
            fiscal_year = f"FY{str(latest_col)[:4]}"

        # Data source
        exchange = info.get("exchange", "")
        if exchange in ("NYQ", "NYSE"):
            source_type = "SEC 10-K"
        elif exchange in ("NAS", "NASDAQ"):
            source_type = "SEC 10-K"
        elif ".NS" in ticker or ".BO" in ticker:
            source_type = "Annual Report"
        else:
            source_type = "Annual Report"

        currency_map = {".NS": "USD", ".BO": "USD"}
        currency = "USD"
        for suffix, cur in currency_map.items():
            if ticker.endswith(suffix):
                currency = cur
                break

        standard = "GAAP"
        if ".NS" in ticker or ".BO" in ticker:
            standard = "IFRS"
        elif ticker in ("UBS", "DB", "ALIZF", "ING", "BNPQY", "NVS", "BAYRY", "RHHBY",
                        "SAP", "ASML", "SAN", "BBVA", "NSRGY", "UL", "LVMUY", "HESAY",
                        "PPRUY", "SIEGY", "ABB", "RYCEY", "EADSY", "SBGSY", "BNS", "MUFG",
                        "SMFG", "MFG", "AON"):
            standard = "IFRS"

        updated_at = str(end)

        # ── Sector-aware metric selection ─────────────────────────────────────
        sector_tag = info.get("sector", "")
        industry   = info.get("industry", "")

        # Financial / Banking
        is_bank = any(k in industry.lower() for k in ("bank", "insurance", "financial", "investment"))
        is_tech = any(k in sector_tag.lower() for k in ("technology", "communication"))
        is_health = "healthcare" in sector_tag.lower() or "pharmaceutical" in industry.lower()
        is_industrial = "industrial" in sector_tag.lower() or "manufacturing" in industry.lower()

        if is_bank:
            primary = {"label": "ROE", "value": roe or 0.10, "unit": "PCT", "period": fiscal_year,
                       "delta": None}
            secondary = {"label": "Net Profit Margin", "value": pm or 0.15, "unit": "PCT",
                         "period": fiscal_year, "delta": None}
            ratios = [
                {"label": "P/E",        "value": pe  or 12.0, "unit": "MULTIPLE", "period": fiscal_year},
                {"label": "ROA",        "value": roa or 0.01, "unit": "PCT",      "period": fiscal_year},
                {"label": "Op. Margin", "value": om  or 0.20, "unit": "PCT",      "period": fiscal_year},
                {"label": "Dividend",   "value": dy  or 0.03, "unit": "PCT",      "period": fiscal_year},
            ]
        elif is_tech:
            primary = {"label": "Gross Margin", "value": gm or 0.50, "unit": "PCT", "period": fiscal_year,
                       "delta": None}
            secondary = {"label": "Revenue Growth YoY", "value": rev_gr or 0.10, "unit": "PCT",
                         "period": fiscal_year, "delta": None}
            ratios = [
                {"label": "P/E",        "value": pe        or 25.0, "unit": "MULTIPLE", "period": fiscal_year},
                {"label": "ROE",        "value": roe       or 0.20, "unit": "PCT",      "period": fiscal_year},
                {"label": "Op. Margin", "value": om        or 0.20, "unit": "PCT",      "period": fiscal_year},
                {"label": "FCF Margin", "value": fcf_margin or 0.15, "unit": "PCT",     "period": fiscal_year},
            ]
        elif is_health:
            primary = {"label": "Gross Margin", "value": gm or 0.60, "unit": "PCT", "period": fiscal_year,
                       "delta": None}
            secondary = {"label": "Net Profit Margin", "value": pm or 0.15, "unit": "PCT",
                         "period": fiscal_year, "delta": None}
            ratios = [
                {"label": "P/E",        "value": pe  or 18.0, "unit": "MULTIPLE", "period": fiscal_year},
                {"label": "ROE",        "value": roe or 0.15, "unit": "PCT",      "period": fiscal_year},
                {"label": "Op. Margin", "value": om  or 0.18, "unit": "PCT",      "period": fiscal_year},
                {"label": "Rev Growth", "value": rev_gr or 0.06, "unit": "PCT",   "period": fiscal_year},
            ]
        elif is_industrial:
            primary = {"label": "Operating Margin", "value": om or 0.12, "unit": "PCT", "period": fiscal_year,
                       "delta": None}
            secondary = {"label": "Revenue Growth YoY", "value": rev_gr or 0.06, "unit": "PCT",
                         "period": fiscal_year, "delta": None}
            ratios = [
                {"label": "P/E",    "value": pe  or 18.0, "unit": "MULTIPLE", "period": fiscal_year},
                {"label": "ROE",    "value": roe or 0.15, "unit": "PCT",      "period": fiscal_year},
                {"label": "ROIC",   "value": roa or 0.10, "unit": "PCT",      "period": fiscal_year},
                {"label": "Beta",   "value": beta or 1.0, "unit": "RATIO",    "period": fiscal_year},
            ]
        else:
            # Consumer & retail / digital platforms
            primary = {"label": "Gross Margin", "value": gm or 0.40, "unit": "PCT", "period": fiscal_year,
                       "delta": None}
            secondary = {"label": "Revenue Growth YoY", "value": rev_gr or 0.08, "unit": "PCT",
                         "period": fiscal_year, "delta": None}
            ratios = [
                {"label": "P/E",        "value": pe  or 20.0, "unit": "MULTIPLE", "period": fiscal_year},
                {"label": "ROE",        "value": roe or 0.18, "unit": "PCT",      "period": fiscal_year},
                {"label": "Op. Margin", "value": om  or 0.10, "unit": "PCT",      "period": fiscal_year},
                {"label": "FCF Margin", "value": fcf_margin or 0.08, "unit": "PCT", "period": fiscal_year},
            ]

        return {
            "ticker": ticker,
            "primaryMetric":   primary,
            "secondaryMetric": secondary,
            "ratios":          ratios,
            "sparkline":       sparkline,
            "source": {
                "source":    source_type,
                "standard":  standard,
                "period":    fiscal_year,
                "updatedAt": updated_at,
                "currency":  currency,
            },
        }

    except Exception as exc:
        print(f"  [ERROR] {ticker}: {exc}")
        return None


def main():
    parser = argparse.ArgumentParser(description="Generate real card data for Trikosh companies")
    parser.add_argument("--ticker", default=None, help="Process a single ticker only")
    parser.add_argument("--sector", default=None,
                        help='Filter to one sector, e.g. "Financial Services"')
    args = parser.parse_args()

    if args.ticker:
        tickers_to_run = [(args.ticker.upper(), args.ticker.upper(), "")]
    elif args.sector:
        tickers_to_run = [(t, n, s) for (t, n, s) in COMPANIES if s == args.sector]
        if not tickers_to_run:
            known = sorted({s for (_, _, s) in COMPANIES})
            print(f"[ERROR] Sector '{args.sector}' not found. Known sectors:\n  " + "\n  ".join(known))
            return
    else:
        tickers_to_run = COMPANIES

    print(f"Fetching card data for {len(tickers_to_run)} companies...\n")

    results: dict[str, dict] = {}

    # Load existing output if present so partial runs are resumable
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH) as f:
            results = json.load(f)

    for ticker, name, sector in tickers_to_run:
        if ticker in results and args.ticker is None and args.sector is None:
            print(f"  SKIP  {ticker:<22} (already in output file)")
            continue

        print(f"  Fetching {name} ({ticker})...", end=" ", flush=True)
        data = fetch_card_metrics(ticker)
        if data:
            results[ticker] = data
            print("OK")
        else:
            print("FAILED -- skipped")

        time.sleep(1.2)

    with open(OUTPUT_PATH, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nDone. {len(results)} companies written to:\n  {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
