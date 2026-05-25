"""
Runs the Trikosh pipeline for the 20 new companies ONLY.
The existing 50 companies are NOT reprocessed — their data is already in PostgreSQL.

Usage:
    python run_new_companies.py
"""

import time
from fetcher import fetch_income_statement, fetch_balance_sheet, fetch_cash_flow, fetch_company_profile, fetch_market_data
from calculator import compute_ratios
from loader import create_tables, upsert_company, upsert_market_data, upsert_income_statement, upsert_balance_sheet, upsert_cash_flow, upsert_ratios

NEW_COMPANIES = [
    # Consumer & Retail — Global
    ("NSRGY",            "Nestle",            "Consumer & Retail"),
    ("UL",               "Unilever",          "Consumer & Retail"),
    ("LVMUY",            "LVMH",              "Consumer & Retail"),
    ("PG",               "Procter & Gamble",  "Consumer & Retail"),
    ("CL",               "Colgate-Palmolive", "Consumer & Retail"),
    ("WMT",              "Walmart",           "Consumer & Retail"),
    ("MCD",              "McDonald's",        "Consumer & Retail"),
    ("QSR",              "Restaurant Brands", "Consumer & Retail"),
    # Consumer & Retail — Indian
    ("HINDUNILVR.NS",    "Hindustan Unilever","Consumer & Retail"),
    ("TATACONSUM.NS",    "Tata Consumer",     "Consumer & Retail"),
    # Digital Platforms & E-Commerce — US
    ("AMZN",             "Amazon",            "Digital Platforms & E-Commerce"),
    ("UBER",             "Uber",              "Digital Platforms & E-Commerce"),
    ("EBAY",             "eBay",              "Digital Platforms & E-Commerce"),
    ("ETSY",             "Etsy",              "Digital Platforms & E-Commerce"),
    ("BKNG",             "Booking Holdings",  "Digital Platforms & E-Commerce"),
    # Digital Platforms & E-Commerce — Global
    ("BABA",             "Alibaba",           "Digital Platforms & E-Commerce"),
    ("JD",               "JD.com",            "Digital Platforms & E-Commerce"),
    ("SE",               "Sea Limited",       "Digital Platforms & E-Commerce"),
    ("SHOP",             "Shopify",           "Digital Platforms & E-Commerce"),
    ("MELI",             "MercadoLibre",      "Digital Platforms & E-Commerce"),
]

succeeded = []
failed    = []


def run():
    print("Ensuring tables exist...")
    create_tables()

    print(f"\nRunning pipeline for {len(NEW_COMPANIES)} new companies...\n")
    print("-" * 60)

    for ticker, name, sector in NEW_COMPANIES:
        print(f"  [{ticker}] {name}...")

        try:
            profile = fetch_company_profile(ticker)
            if profile:
                # Stamp the sector from our config so it's consistent regardless
                # of what yfinance returns for 'sector'
                profile["sector"] = sector
                upsert_company(ticker, profile)

            market = fetch_market_data(ticker)
            if market:
                upsert_market_data(ticker, market)

            income_statements = fetch_income_statement(ticker)
            balance_sheets    = fetch_balance_sheet(ticker)
            cash_flows        = fetch_cash_flow(ticker)

            years_processed = 0
            for i in range(min(len(income_statements), len(balance_sheets), len(cash_flows))):
                income   = income_statements[i]
                balance  = balance_sheets[i]
                cashflow = cash_flows[i]

                fiscal_year = income.get("calendarYear") or income.get("date", "")[:4]
                fiscal_year = int(fiscal_year)

                upsert_income_statement(ticker, fiscal_year, income)
                upsert_balance_sheet(ticker, fiscal_year, balance)
                upsert_cash_flow(ticker, fiscal_year, cashflow)

                ratios = compute_ratios(income, balance, cashflow, market or {})
                upsert_ratios(ticker, fiscal_year, ratios)
                years_processed += 1

            print(f"    OK  {name} — {years_processed} year(s) loaded")
            succeeded.append(ticker)

        except Exception as e:
            print(f"    FAIL {name} ({ticker}): {e}")
            failed.append(ticker)

        time.sleep(1)

    print("\n" + "-" * 60)
    print(f"\nResults: {len(succeeded)} succeeded / {len(failed)} failed\n")

    if succeeded:
        print(f"  Succeeded: {', '.join(succeeded)}")
    if failed:
        print(f"  Failed:    {', '.join(failed)}")

    print()


if __name__ == "__main__":
    run()
