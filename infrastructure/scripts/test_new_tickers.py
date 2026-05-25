"""
Quick resolution check for the 20 new tickers before adding them to the pipeline.
Run: python test_new_tickers.py
"""

import yfinance as yf

NEW_TICKERS = [
    # Consumer & Retail
    ("NSRGY",           "Nestlé"),
    ("UL",              "Unilever"),
    ("HINDUNILVR.NS",   "Hindustan Unilever"),
    ("TATACONSUM.NS",   "Tata Consumer Products"),
    ("MCD",             "McDonald's"),
    ("QSR",             "Restaurant Brands International"),
    ("CL",              "Colgate-Palmolive"),
    ("WMT",             "Walmart"),
    ("LVMUY",           "LVMH"),
    ("PG",              "Procter & Gamble"),
    # Digital Platforms & E-Commerce
    ("AMZN",            "Amazon"),
    ("BABA",            "Alibaba"),
    ("SE",              "Sea Limited"),
    ("SHOP",            "Shopify"),
    ("MELI",            "MercadoLibre"),
    ("UBER",            "Uber"),
    ("JD",              "JD.com"),
    ("EBAY",            "eBay"),
    ("ETSY",            "Etsy"),
    ("BKNG",            "Booking Holdings"),
]

passed = []
failed = []

print("\n" + "-" * 70)
print(f"  {'TICKER':<18}  {'EXPECTED':<30}  RESOLVED")
print("-" * 70)

for ticker, expected in NEW_TICKERS:
    try:
        info = yf.Ticker(ticker).info
        name = (
            info.get("longName")
            or info.get("shortName")
            or info.get("name")
        )
        if name:
            print(f"  {ticker:<18}  {expected:<30}  OK   {name}")
            passed.append(ticker)
        else:
            print(f"  {ticker:<18}  {expected:<30}  FAIL (no name returned)")
            failed.append(ticker)
    except Exception as e:
        print(f"  {ticker:<18}  {expected:<30}  FAIL ERROR: {e}")
        failed.append(ticker)

print("-" * 70)
print(f"\n  Passed: {len(passed)}/20   Failed: {len(failed)}/20")

if failed:
    print(f"\n  FAILED tickers: {', '.join(failed)}")
    print("\n  WARNING: Do NOT run the pipeline until all 20 resolve.")
else:
    print("\n  All 20 tickers resolved -- safe to run pipeline.")

print()
