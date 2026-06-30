import psycopg2
from config import DB_CONFIG


def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def create_tables():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS companies (
            ticker VARCHAR(20) PRIMARY KEY,
            name VARCHAR(255),
            sector VARCHAR(100),
            industry VARCHAR(100),
            country VARCHAR(100),
            exchange VARCHAR(50),
            currency VARCHAR(10),
            description TEXT,
            website VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS market_data (
            id SERIAL PRIMARY KEY,
            ticker VARCHAR(20) REFERENCES companies(ticker),
            date DATE,
            market_cap NUMERIC,
            price NUMERIC,
            beta NUMERIC,
            volume_avg BIGINT,
            shares_outstanding BIGINT,
            UNIQUE(ticker, date)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS income_statements (
            id SERIAL PRIMARY KEY,
            ticker VARCHAR(20) REFERENCES companies(ticker),
            fiscal_year INT,
            revenue NUMERIC,
            gross_profit NUMERIC,
            operating_income NUMERIC,
            net_income NUMERIC,
            ebitda NUMERIC,
            eps NUMERIC,
            shares_outstanding BIGINT,
            UNIQUE(ticker, fiscal_year)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS balance_sheets (
            id SERIAL PRIMARY KEY,
            ticker VARCHAR(20) REFERENCES companies(ticker),
            fiscal_year INT,
            total_assets NUMERIC,
            total_liabilities NUMERIC,
            total_equity NUMERIC,
            cash_and_equivalents NUMERIC,
            total_debt NUMERIC,
            UNIQUE(ticker, fiscal_year)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS cash_flow_statements (
            id SERIAL PRIMARY KEY,
            ticker VARCHAR(20) REFERENCES companies(ticker),
            fiscal_year INT,
            operating_cash_flow NUMERIC,
            capital_expenditure NUMERIC,
            free_cash_flow NUMERIC,
            dividends_paid NUMERIC,
            UNIQUE(ticker, fiscal_year)
        );
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS financial_ratios (
            id SERIAL PRIMARY KEY,
            ticker VARCHAR(20) REFERENCES companies(ticker),
            fiscal_year INT,
            gross_margin NUMERIC,
            operating_margin NUMERIC,
            net_margin NUMERIC,
            return_on_equity NUMERIC,
            return_on_assets NUMERIC,
            current_ratio NUMERIC,
            debt_to_equity NUMERIC,
            debt_to_assets NUMERIC,
            asset_turnover NUMERIC,
            interest_coverage NUMERIC,
            price_to_earnings NUMERIC,
            price_to_book NUMERIC,
            ev_to_ebitda NUMERIC,
            free_cash_flow_yield NUMERIC,
            earnings_yield NUMERIC,
            UNIQUE(ticker, fiscal_year)
        );
    """)

    conn.commit()
    cur.close()
    conn.close()
    print("All tables created successfully.")


def upsert_company(conn, ticker, profile):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO companies (ticker, name, sector, industry, country, exchange, currency, description, website)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker) DO UPDATE SET
                name = EXCLUDED.name,
                sector = EXCLUDED.sector,
                industry = EXCLUDED.industry,
                country = EXCLUDED.country,
                exchange = EXCLUDED.exchange,
                currency = EXCLUDED.currency,
                description = EXCLUDED.description,
                website = EXCLUDED.website;
        """, (
            ticker,
            profile.get("companyName"),
            profile.get("sector"),
            profile.get("industry"),
            profile.get("country"),
            profile.get("exchange"),
            profile.get("currency"),
            profile.get("description"),
            profile.get("website")
        ))


def upsert_market_data(conn, ticker, market):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO market_data (ticker, date, market_cap, price, beta, volume_avg, shares_outstanding)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker, date) DO UPDATE SET
                market_cap = EXCLUDED.market_cap,
                price = EXCLUDED.price,
                beta = EXCLUDED.beta,
                volume_avg = EXCLUDED.volume_avg,
                shares_outstanding = EXCLUDED.shares_outstanding;
        """, (
            ticker,
            market.get("date"),
            market.get("marketCap"),
            market.get("price"),
            market.get("beta"),
            market.get("volAvg"),
            market.get("sharesOutstanding")
        ))


def upsert_income_statement(conn, ticker, fiscal_year, income):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO income_statements (ticker, fiscal_year, revenue, gross_profit, operating_income, net_income, ebitda, eps, shares_outstanding)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker, fiscal_year) DO UPDATE SET
                revenue = EXCLUDED.revenue,
                gross_profit = EXCLUDED.gross_profit,
                operating_income = EXCLUDED.operating_income,
                net_income = EXCLUDED.net_income,
                ebitda = EXCLUDED.ebitda,
                eps = EXCLUDED.eps,
                shares_outstanding = EXCLUDED.shares_outstanding;
        """, (
            ticker,
            fiscal_year,
            income.get("revenue"),
            income.get("grossProfit"),
            income.get("operatingIncome"),
            income.get("netIncome"),
            income.get("ebitda"),
            income.get("eps"),
            income.get("weightedAverageShsOut")
        ))


def upsert_balance_sheet(conn, ticker, fiscal_year, balance):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO balance_sheets (ticker, fiscal_year, total_assets, total_liabilities, total_equity, cash_and_equivalents, total_debt)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker, fiscal_year) DO UPDATE SET
                total_assets = EXCLUDED.total_assets,
                total_liabilities = EXCLUDED.total_liabilities,
                total_equity = EXCLUDED.total_equity,
                cash_and_equivalents = EXCLUDED.cash_and_equivalents,
                total_debt = EXCLUDED.total_debt;
        """, (
            ticker,
            fiscal_year,
            balance.get("totalAssets"),
            balance.get("totalLiabilities"),
            balance.get("totalEquity"),
            balance.get("cashAndCashEquivalents"),
            balance.get("totalDebt")
        ))


def upsert_cash_flow(conn, ticker, fiscal_year, cashflow):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO cash_flow_statements (ticker, fiscal_year, operating_cash_flow, capital_expenditure, free_cash_flow, dividends_paid)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker, fiscal_year) DO UPDATE SET
                operating_cash_flow = EXCLUDED.operating_cash_flow,
                capital_expenditure = EXCLUDED.capital_expenditure,
                free_cash_flow = EXCLUDED.free_cash_flow,
                dividends_paid = EXCLUDED.dividends_paid;
        """, (
            ticker,
            fiscal_year,
            cashflow.get("operatingCashFlow"),
            cashflow.get("capitalExpenditure"),
            cashflow.get("freeCashFlow"),
            cashflow.get("dividendsPaid")
        ))


def upsert_ratios(conn, ticker, fiscal_year, ratios):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO financial_ratios (
                ticker, fiscal_year,
                gross_margin, operating_margin, net_margin,
                return_on_equity, return_on_assets,
                current_ratio, debt_to_equity, debt_to_assets,
                asset_turnover, interest_coverage,
                price_to_earnings, price_to_book, ev_to_ebitda,
                free_cash_flow_yield, earnings_yield
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (ticker, fiscal_year) DO UPDATE SET
                gross_margin = EXCLUDED.gross_margin,
                operating_margin = EXCLUDED.operating_margin,
                net_margin = EXCLUDED.net_margin,
                return_on_equity = EXCLUDED.return_on_equity,
                return_on_assets = EXCLUDED.return_on_assets,
                current_ratio = EXCLUDED.current_ratio,
                debt_to_equity = EXCLUDED.debt_to_equity,
                debt_to_assets = EXCLUDED.debt_to_assets,
                asset_turnover = EXCLUDED.asset_turnover,
                interest_coverage = EXCLUDED.interest_coverage,
                price_to_earnings = EXCLUDED.price_to_earnings,
                price_to_book = EXCLUDED.price_to_book,
                ev_to_ebitda = EXCLUDED.ev_to_ebitda,
                free_cash_flow_yield = EXCLUDED.free_cash_flow_yield,
                earnings_yield = EXCLUDED.earnings_yield;
        """, (
            ticker,
            fiscal_year,
            ratios.get("gross_margin"),
            ratios.get("operating_margin"),
            ratios.get("net_margin"),
            ratios.get("return_on_equity"),
            ratios.get("return_on_assets"),
            ratios.get("current_ratio"),
            ratios.get("debt_to_equity"),
            ratios.get("debt_to_assets"),
            ratios.get("asset_turnover"),
            ratios.get("interest_coverage"),
            ratios.get("price_to_earnings"),
            ratios.get("price_to_book"),
            ratios.get("ev_to_ebitda"),
            ratios.get("free_cash_flow_yield"),
            ratios.get("earnings_yield")
        ))


if __name__ == "__main__":
    create_tables()
    print("loader.py is working. Tables are ready.")
