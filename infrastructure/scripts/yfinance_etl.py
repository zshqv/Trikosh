"""
yfinance_etl.py — Alternative ETL pipeline using yfinance (Yahoo Finance).

Fetches real financial data for all 200 Trikosh companies and upserts into
PostgreSQL. Runs independently of the FMP pipeline (pipeline.py).

Usage:
    python yfinance_etl.py                  # all 200 companies
    python yfinance_etl.py --ticker NVDA    # single company
    python yfinance_etl.py --dry-run        # validate tickers only, no DB writes
"""

import argparse
import logging
import time
import sys
from typing import Optional

import yfinance as yf
import psycopg2
from config import DB_CONFIG, COMPANIES

logger = logging.getLogger(__name__)


RATE_LIMIT_SECONDS = 0.5  # yfinance is more forgiving than FMP, but be polite


def validate_ticker(ticker: str) -> bool:
    """Return True if yfinance can resolve the ticker to a valid security."""
    try:
        info = yf.Ticker(ticker).info
        return bool(info.get("symbol") or info.get("shortName"))
    except Exception:
        return False


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def upsert_company(conn, ticker: str, info: dict) -> Optional[int]:
    """Insert or update the companies row, return company_id."""
    sector_map = {
        "Financial Services":                    "Financial Services",
        "AI & Technology":                       "AI & Technology",
        "Healthcare":                            "Healthcare",
        "Consumer & Retail":                     "Consumer & Retail",
        "Consumer Internet & Digital Platforms": "Consumer Internet & Digital Platforms",
        "Industrials":                           "Industrials",
    }
    # Resolve sector from config COMPANIES list
    config_sector = next((s for t, _, s in COMPANIES if t == ticker), None)
    if not config_sector:
        logger.warning("%s not found in COMPANIES config — skipping", ticker)
        return None

    sql = """
        INSERT INTO companies (
            ticker, company_name, short_name, sector, industry,
            primary_exchange, reporting_currency, country_of_incorporation,
            data_start_year, data_end_year
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (ticker) DO UPDATE SET
            company_name           = EXCLUDED.company_name,
            short_name             = EXCLUDED.short_name,
            sector                 = EXCLUDED.sector,
            industry               = EXCLUDED.industry,
            primary_exchange       = EXCLUDED.primary_exchange,
            reporting_currency     = EXCLUDED.reporting_currency,
            country_of_incorporation = EXCLUDED.country_of_incorporation,
            data_end_year          = EXCLUDED.data_end_year,
            updated_at             = NOW()
        RETURNING company_id
    """
    with conn.cursor() as cur:
        cur.execute(sql, (
            ticker,
            info.get("longName", info.get("shortName", ticker)),
            info.get("shortName", ticker),
            config_sector,
            info.get("industry", ""),
            info.get("exchange", ""),
            info.get("financialCurrency", "USD"),
            info.get("country", ""),
            2019,
            2024,
        ))
        row = cur.fetchone()
        conn.commit()
        return row[0] if row else None


def upsert_financials(conn, company_id: int, ticker: str, financials: yf.Ticker, currency: str) -> None:
    """Upsert income statement, balance sheet, and cash flow data."""
    try:
        income = financials.financials          # annual income statement
        balance = financials.balance_sheet      # annual balance sheet
        cashflow = financials.cashflow          # annual cash flow

        if income is None or income.empty:
            logger.warning("%s: no income statement data", ticker)
            return

        for col in income.columns[:5]:  # up to 5 fiscal years
            fiscal_year = col.year if hasattr(col, "year") else int(str(col)[:4])

            def g(df, *keys):
                """Safe getter: try multiple key variants, return None if missing."""
                if df is None or df.empty:
                    return None
                for k in keys:
                    if k in df.index:
                        v = df.at[k, col]
                        if v is not None and str(v) not in ("nan", "None"):
                            try:
                                f = float(v)
                                return round(f / 1_000_000, 3)  # → Millions
                            except (ValueError, TypeError):
                                pass
                return None

            # Income statement
            sql_income = """
                INSERT INTO income_statements (
                    company_id, fiscal_year, fiscal_year_end_date, period_type,
                    currency, unit, revenue_total, gross_profit, operating_income,
                    net_income, ebitda, eps_diluted, data_source
                ) VALUES (%s,%s,%s,'Annual',%s,'Millions',%s,%s,%s,%s,%s,%s,'yfinance')
                ON CONFLICT (company_id, fiscal_year, period_type) DO UPDATE SET
                    revenue_total    = EXCLUDED.revenue_total,
                    gross_profit     = EXCLUDED.gross_profit,
                    operating_income = EXCLUDED.operating_income,
                    net_income       = EXCLUDED.net_income,
                    ebitda           = EXCLUDED.ebitda,
                    eps_diluted      = EXCLUDED.eps_diluted,
                    updated_at       = NOW()
            """
            with conn.cursor() as cur:
                cur.execute(sql_income, (
                    company_id, fiscal_year, col, currency,
                    g(income, "Total Revenue"),
                    g(income, "Gross Profit"),
                    g(income, "Operating Income", "EBIT"),
                    g(income, "Net Income"),
                    g(income, "EBITDA"),
                    g(income, "Diluted EPS"),
                ))

            # Balance sheet
            if balance is not None and not balance.empty and col in balance.columns:
                sql_bs = """
                    INSERT INTO balance_sheets (
                        company_id, fiscal_year, fiscal_year_end_date, period_type,
                        currency, unit, total_assets, total_liabilities,
                        total_shareholders_equity, cash_and_equivalents, data_source
                    ) VALUES (%s,%s,%s,'Annual',%s,'Millions',%s,%s,%s,%s,'yfinance')
                    ON CONFLICT (company_id, fiscal_year, period_type) DO UPDATE SET
                        total_assets             = EXCLUDED.total_assets,
                        total_liabilities        = EXCLUDED.total_liabilities,
                        total_shareholders_equity= EXCLUDED.total_shareholders_equity,
                        cash_and_equivalents     = EXCLUDED.cash_and_equivalents,
                        updated_at               = NOW()
                """
                with conn.cursor() as cur:
                    cur.execute(sql_bs, (
                        company_id, fiscal_year, col, currency,
                        g(balance, "Total Assets"),
                        g(balance, "Total Liabilities Net Minority Interest", "Total Liabilities"),
                        g(balance, "Stockholders Equity", "Total Equity Gross Minority Interest"),
                        g(balance, "Cash And Cash Equivalents", "Cash Cash Equivalents And Short Term Investments"),
                    ))

            # Cash flow
            if cashflow is not None and not cashflow.empty and col in cashflow.columns:
                sql_cf = """
                    INSERT INTO cash_flow_statements (
                        company_id, fiscal_year, fiscal_year_end_date, period_type,
                        currency, unit, cash_from_operations, capital_expenditures,
                        free_cash_flow, data_source
                    ) VALUES (%s,%s,%s,'Annual',%s,'Millions',%s,%s,%s,%s,'yfinance')
                    ON CONFLICT (company_id, fiscal_year, period_type) DO UPDATE SET
                        cash_from_operations = EXCLUDED.cash_from_operations,
                        capital_expenditures = EXCLUDED.capital_expenditures,
                        free_cash_flow       = EXCLUDED.free_cash_flow,
                        updated_at           = NOW()
                """
                with conn.cursor() as cur:
                    cur.execute(sql_cf, (
                        company_id, fiscal_year, col, currency,
                        g(cashflow, "Operating Cash Flow", "Cash Flows From Used In Operating Activities Direct Method"),
                        g(cashflow, "Capital Expenditure"),
                        g(cashflow, "Free Cash Flow"),
                    ))

        conn.commit()

    except Exception as e:
        conn.rollback()
        logger.error("%s financials: %s", ticker, e)


def upsert_market_data(conn, company_id: int, ticker: str, info: dict, currency: str) -> None:
    """Upsert most recent market data snapshot."""
    import datetime
    sql = """
        INSERT INTO market_data (
            company_id, fiscal_year, data_date, currency, unit,
            share_price_close, market_cap, beta, data_source
        ) VALUES (%s,%s,%s,%s,'Millions',%s,%s,%s,'yfinance')
        ON CONFLICT (company_id, fiscal_year) DO UPDATE SET
            share_price_close = EXCLUDED.share_price_close,
            market_cap        = EXCLUDED.market_cap,
            beta              = EXCLUDED.beta,
            updated_at        = NOW()
    """
    try:
        price = info.get("currentPrice") or info.get("regularMarketPrice")
        mktcap_raw = info.get("marketCap")
        mktcap = round(mktcap_raw / 1_000_000, 3) if mktcap_raw else None
        beta = info.get("beta")
        today = datetime.date.today()
        with conn.cursor() as cur:
            cur.execute(sql, (company_id, today.year, today, currency, price, mktcap, beta))
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error("%s market data: %s", ticker, e)


def process_company(conn, ticker: str, dry_run: bool) -> bool:
    """Fetch and store data for a single company. Returns True on success."""
    try:
        yf_ticker = yf.Ticker(ticker)
        info = yf_ticker.info

        if not info or not (info.get("symbol") or info.get("shortName")):
            logger.warning("%s: yfinance returned no data — invalid or delisted ticker", ticker)
            return False

        if dry_run:
            logger.info("[DRY-RUN] %s: %s — validated OK", ticker, info.get("longName", "unknown"))
            return True

        currency = info.get("financialCurrency") or ""
        if not currency:
            logger.warning("%s: financialCurrency not found in yfinance info — defaulting to USD", ticker)
            currency = "USD"

        company_id = upsert_company(conn, ticker, info)
        if company_id is None:
            return False

        upsert_financials(conn, company_id, ticker, yf_ticker, currency)
        upsert_market_data(conn, company_id, ticker, info, currency)
        return True

    except Exception as e:
        logger.error("%s: %s", ticker, e)
        return False


def main():
    parser = argparse.ArgumentParser(description="Trikosh yfinance ETL pipeline")
    parser.add_argument("--ticker", help="Process a single ticker only")
    parser.add_argument("--dry-run", action="store_true", help="Validate tickers without writing to DB")
    args = parser.parse_args()

    companies = COMPANIES
    if args.ticker:
        t = args.ticker.upper()
        companies = [(tick, name, sec) for tick, name, sec in COMPANIES if tick == t]
        if not companies:
            logger.error("Ticker '%s' not found in COMPANIES config.", t)
            sys.exit(1)

    logger.info(
        "yfinance ETL — %d %s",
        len(companies),
        "company" if len(companies) == 1 else "companies",
    )
    logger.info("Mode: %s", "DRY RUN (no DB writes)" if args.dry_run else "LIVE (writes to PostgreSQL)")

    conn = None if args.dry_run else get_connection()

    ok = fail = skip = 0
    for ticker, name, _ in companies:
        logger.info("→ %s (%s)", name, ticker)
        success = process_company(conn, ticker, args.dry_run)
        if success:
            ok += 1
        else:
            fail += 1
        time.sleep(RATE_LIMIT_SECONDS)

    if conn:
        conn.close()

    logger.info("Done — %d succeeded, %d failed, %d skipped", ok, fail, skip)


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )
    main()
