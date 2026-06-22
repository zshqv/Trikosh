import yfinance as yf


def clean(value):
    if value is None:
        return None
    try:
        import math
        f = float(value)
        if math.isnan(f):
            return None
        return f
    except (TypeError, ValueError):
        return None


def fetch_company_profile(ticker):
    try:
        t = yf.Ticker(ticker)
        info = t.info
        return info
    except Exception as e:
        print(f"  [ERROR] Profile fetch failed for {ticker}: {e}")
        return {}


def fetch_market_data(ticker):
    try:
        t = yf.Ticker(ticker)
        info = t.info

        raw_date = info.get("exDividendDate")
        if raw_date:
            from datetime import datetime
            formatted_date = datetime.utcfromtimestamp(raw_date).strftime('%Y-%m-%d')
        else:
            formatted_date = None

        return {
            "date": formatted_date,
            "marketCap": clean(info.get("marketCap")),
            "price": clean(info.get("currentPrice")),
            "beta": clean(info.get("beta")),
            "volAvg": clean(info.get("averageVolume")),
            "sharesOutstanding": clean(info.get("sharesOutstanding"))
        }
    except Exception as e:
        print(f"  [ERROR] Market data fetch failed for {ticker}: {e}")
        return {}


def fetch_income_statement(ticker):
    try:
        t = yf.Ticker(ticker)
        fin = t.financials
        if fin is None or fin.empty:
            return []

        results = []
        for col in fin.columns:
            row = fin[col]
            results.append({
                "date": str(col)[:10],
                "calendarYear": str(col)[:4],
                "revenue": clean(row.get("Total Revenue")),
                "grossProfit": clean(row.get("Gross Profit")),
                "operatingIncome": clean(row.get("Operating Income")),
                "netIncome": clean(row.get("Net Income")),
                "ebitda": clean(row.get("EBITDA")),
                "interestExpense": clean(row.get("Interest Expense Non Operating")),
                "eps": clean(row.get("Diluted EPS")),
                "weightedAverageShsOut": clean(row.get("Diluted Average Shares")),
            })
        return results
    except Exception as e:
        print(f"  [ERROR] Income statement fetch failed for {ticker}: {e}")
        return []


def fetch_balance_sheet(ticker):
    try:
        t = yf.Ticker(ticker)
        bs = t.balance_sheet
        if bs is None or bs.empty:
            return []

        results = []
        for col in bs.columns:
            row = bs[col]
            results.append({
                "date": str(col)[:10],
                "calendarYear": str(col)[:4],
                "totalAssets": clean(row.get("Total Assets")),
                "totalLiabilities": clean(row.get("Total Liabilities Net Minority Interest")),
                "totalStockholdersEquity": clean(row.get("Stockholders Equity")),
                "totalCurrentAssets": clean(row.get("Current Assets")),
                "totalCurrentLiabilities": clean(row.get("Current Liabilities")),
                "inventory": clean(row.get("Inventory")),
                "totalDebt": clean(row.get("Total Debt")),
                "cashAndCashEquivalents": clean(row.get("Cash And Cash Equivalents")),
            })
        return results
    except Exception as e:
        print(f"  [ERROR] Balance sheet fetch failed for {ticker}: {e}")
        return []


def fetch_cash_flow(ticker):
    try:
        t = yf.Ticker(ticker)
        cf = t.cashflow
        if cf is None or cf.empty:
            return []

        results = []
        for col in cf.columns:
            row = cf[col]
            results.append({
                "date": str(col)[:10],
                "calendarYear": str(col)[:4],
                "operatingCashFlow": clean(row.get("Operating Cash Flow")),
                "capitalExpenditure": clean(row.get("Capital Expenditure")),
                "freeCashFlow": clean(row.get("Free Cash Flow")),
                "dividendsPaid": clean(row.get("Common Stock Dividend Paid")),
            })
        return results
    except Exception as e:
        print(f"  [ERROR] Cash flow fetch failed for {ticker}: {e}")
        return []


def fetch_price_history(ticker: str, years: int = 5) -> list[dict]:
    """
    Fetch daily OHLCV price history for the last `years` years from today.

    Always computed relative to today's date — calling this function on any
    future date returns the correct rolling window without any code changes.
    The result is intentionally NOT cached or stored as a static snapshot.

    Returns a list of dicts with keys: date, open, high, low, close, volume.
    Returns an empty list if the ticker is invalid or data is unavailable.
    """
    from datetime import date, timedelta

    try:
        end = date.today()
        start = end - timedelta(days=years * 365 + 2)  # +2 for leap year safety
        t = yf.Ticker(ticker)
        hist = t.history(start=str(start), end=str(end), interval="1d", auto_adjust=True)
        if hist is None or hist.empty:
            return []
        results = []
        for ts, row in hist.iterrows():
            results.append({
                "date":   str(ts)[:10],
                "open":   clean(row.get("Open")),
                "high":   clean(row.get("High")),
                "low":    clean(row.get("Low")),
                "close":  clean(row.get("Close")),
                "volume": int(row.get("Volume") or 0),
            })
        return results
    except Exception as e:
        print(f"  [ERROR] Price history fetch failed for {ticker}: {e}")
        return []