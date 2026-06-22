"""
validate_tickers.py — Verify all 200 Trikosh tickers are fetchable via yfinance.

Usage:
    python validate_tickers.py                # test all tickers in config.py
    python validate_tickers.py --ticker AAPL  # test a single ticker

Exits with code 0 if all tickers pass, 1 if any fail.
"""

import argparse
import sys
import time

import yfinance as yf

from config import COMPANIES


def validate_ticker(ticker: str) -> tuple[bool, str]:
    """Return (ok, reason). ok=True means yfinance returned non-empty data."""
    try:
        t = yf.Ticker(ticker)
        info = t.info
        if not info:
            return False, "empty info dict"
        # A valid ticker always has at least a longName or shortName
        if not info.get("longName") and not info.get("shortName") and not info.get("symbol"):
            return False, "no name or symbol in info"
        return True, info.get("longName") or info.get("shortName") or ticker
    except Exception as exc:
        return False, str(exc)


def main():
    parser = argparse.ArgumentParser(description="Validate Trikosh tickers via yfinance")
    parser.add_argument("--ticker", default=None, help="Validate a single ticker instead of all")
    parser.add_argument("--sector", default=None, help='Validate one sector only, e.g. "Financial Services"')
    args = parser.parse_args()

    if args.ticker:
        tickers_to_check = [(args.ticker.upper(), args.ticker.upper(), "")]
    elif args.sector:
        tickers_to_check = [(t, n, s) for (t, n, s) in COMPANIES if s == args.sector]
        if not tickers_to_check:
            known = sorted({s for (_, _, s) in COMPANIES})
            print(f"[ERROR] Sector '{args.sector}' not found. Known:\n  " + "\n  ".join(known))
            sys.exit(1)
    else:
        tickers_to_check = COMPANIES

    passed, failed = [], []

    print(f"Validating {len(tickers_to_check)} ticker(s)...\n")

    for ticker, name, sector in tickers_to_check:
        ok, detail = validate_ticker(ticker)
        if ok:
            passed.append(ticker)
            print(f"  OK   {ticker:<22} {detail}")
        else:
            failed.append(ticker)
            print(f"  FAIL {ticker:<22} FAILED -- {detail}")
        time.sleep(0.5)

    print(f"\n{'-'*60}")
    print(f"PASSED: {len(passed)} / {len(tickers_to_check)}")
    if failed:
        print(f"FAILED: {len(failed)} — {', '.join(failed)}")
        sys.exit(1)
    else:
        print("All tickers validated successfully.")


if __name__ == "__main__":
    main()
