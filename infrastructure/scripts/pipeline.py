import time
from config import COMPANIES, YEARS_OF_DATA
from fetcher import fetch_income_statement, fetch_balance_sheet, fetch_cash_flow, fetch_company_profile, fetch_market_data
from calculator import compute_ratios
from loader import upsert_company, upsert_market_data, upsert_income_statement, upsert_balance_sheet, upsert_cash_flow, upsert_ratios


def run_pipeline():
    print(f"Starting Trikosh pipeline for {len(COMPANIES)} companies...\n")

    for ticker, name, sector in COMPANIES:
        print(f"Processing {name} ({ticker})...")

        try:
            profile = fetch_company_profile(ticker)
            if profile:
                upsert_company(ticker, profile)

            market = fetch_market_data(ticker)
            if market:
                upsert_market_data(ticker, market)

            income_statements = fetch_income_statement(ticker)
            balance_sheets = fetch_balance_sheet(ticker)
            cash_flows = fetch_cash_flow(ticker)

            for i in range(min(len(income_statements), len(balance_sheets), len(cash_flows))):
                income = income_statements[i]
                balance = balance_sheets[i]
                cashflow = cash_flows[i]

                fiscal_year = income.get("calendarYear") or income.get("date", "")[:4]
                fiscal_year = int(fiscal_year)

                upsert_income_statement(ticker, fiscal_year, income)
                upsert_balance_sheet(ticker, fiscal_year, balance)
                upsert_cash_flow(ticker, fiscal_year, cashflow)

                ratios = compute_ratios(income, balance, cashflow, market or {})
                upsert_ratios(ticker, fiscal_year, ratios)

            print(f"  Done: {name} ({ticker})")

        except Exception as e:
            print(f"  ERROR on {name} ({ticker}): {e}")

        time.sleep(1)

    print("\nPipeline complete. All data loaded into PostgreSQL.")


if __name__ == "__main__":
    run_pipeline()