import argparse
import time
from config import COMPANIES, YEARS_OF_DATA
from fetcher import fetch_income_statement, fetch_balance_sheet, fetch_cash_flow, fetch_company_profile, fetch_market_data
from calculator import compute_ratios
from loader import upsert_company, upsert_market_data, upsert_income_statement, upsert_balance_sheet, upsert_cash_flow, upsert_ratios


def run_pipeline(ticker_filter: str | None = None):
    """
    Run the Trikosh ETL pipeline.

    Args:
        ticker_filter: If provided, only process the company with this ticker.
                       Must match a ticker in COMPANIES (case-sensitive).
                       Example: run_pipeline("DB") fetches Deutsche Bank only.
    """
    companies_to_run = COMPANIES

    if ticker_filter:
        ticker_filter = ticker_filter.upper()
        companies_to_run = [
            (t, n, s) for (t, n, s) in COMPANIES if t == ticker_filter
        ]
        if not companies_to_run:
            known = [t for (t, _, _) in COMPANIES]
            raise ValueError(
                f"Ticker '{ticker_filter}' not found in COMPANIES. "
                f"Known tickers: {known}"
            )

    print(f"Starting Trikosh pipeline for {len(companies_to_run)} "
          f"{'company' if len(companies_to_run) == 1 else 'companies'}...\n")

    for ticker, name, sector in companies_to_run:
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
    parser = argparse.ArgumentParser(
        description="Trikosh financial data pipeline — fetch and load company data into PostgreSQL."
    )
    parser.add_argument(
        "--ticker",
        type=str,
        default=None,
        metavar="TICKER",
        help=(
            "Run the pipeline for a single company only. "
            "Example: --ticker DB  (fetches Deutsche Bank AG only). "
            "Must be a ticker present in config.COMPANIES. "
            "Omit to run all companies."
        ),
    )
    args = parser.parse_args()
    run_pipeline(ticker_filter=args.ticker)