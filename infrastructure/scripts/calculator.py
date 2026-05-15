def safe_divide(numerator, denominator):
    try:
        if denominator is None or denominator == 0:
            return None
        if numerator is None:
            return None
        return round(numerator / denominator, 4)
    except (TypeError, ZeroDivisionError):
        return None


def compute_ratios(income, balance, cashflow, market):

    revenue             = income.get("revenue")
    gross_profit        = income.get("grossProfit")
    operating_income    = income.get("operatingIncome")
    net_income          = income.get("netIncome")
    ebitda              = income.get("ebitda")
    interest_expense    = income.get("interestExpense")
    eps                 = income.get("eps")

    total_assets        = balance.get("totalAssets")
    total_equity        = balance.get("totalStockholdersEquity")
    total_liabilities   = balance.get("totalLiabilities")
    current_assets      = balance.get("totalCurrentAssets")
    current_liabilities = balance.get("totalCurrentLiabilities")
    inventory           = balance.get("inventory") or 0
    total_debt          = balance.get("totalDebt")
    book_value_per_share = safe_divide(total_equity, income.get("weightedAverageShsOut"))

    operating_cf        = cashflow.get("operatingCashFlow")
    capex               = cashflow.get("capitalExpenditure")
    free_cashflow       = cashflow.get("freeCashFlow")

    price               = market.get("price")
    market_cap          = market.get("marketCap")

    gross_margin        = safe_divide(gross_profit, revenue)
    operating_margin    = safe_divide(operating_income, revenue)
    net_margin          = safe_divide(net_income, revenue)
    return_on_equity    = safe_divide(net_income, total_equity)
    return_on_assets    = safe_divide(net_income, total_assets)
    debt_to_equity      = safe_divide(total_liabilities, total_equity)
    debt_to_assets      = safe_divide(total_debt, total_assets)
    current_ratio       = safe_divide(current_assets, current_liabilities)
    asset_turnover      = safe_divide(revenue, total_assets)
    interest_coverage   = safe_divide(operating_income, interest_expense)
    price_to_earnings   = safe_divide(price, eps)
    price_to_book       = safe_divide(price, book_value_per_share)
    ev_to_ebitda        = safe_divide(market_cap, ebitda)
    free_cash_flow_yield = safe_divide(free_cashflow, market_cap)
    earnings_yield      = safe_divide(eps, price)

    return {
        "gross_margin":         gross_margin,
        "operating_margin":     operating_margin,
        "net_margin":           net_margin,
        "return_on_equity":     return_on_equity,
        "return_on_assets":     return_on_assets,
        "debt_to_equity":       debt_to_equity,
        "debt_to_assets":       debt_to_assets,
        "current_ratio":        current_ratio,
        "asset_turnover":       asset_turnover,
        "interest_coverage":    interest_coverage,
        "price_to_earnings":    price_to_earnings,
        "price_to_book":        price_to_book,
        "ev_to_ebitda":         ev_to_ebitda,
        "free_cash_flow_yield": free_cash_flow_yield,
        "earnings_yield":       earnings_yield,
    }