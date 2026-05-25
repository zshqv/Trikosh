from typing import Optional


def _safe_div(numerator: float, denominator: float) -> Optional[float]:
    if denominator == 0:
        return None
    return numerator / denominator


def gross_margin(revenue: float, cogs: float) -> Optional[float]:
    if revenue is None or cogs is None:
        return None
    return _safe_div(revenue - cogs, revenue)


def operating_margin(ebit: float, revenue: float) -> Optional[float]:
    if ebit is None or revenue is None:
        return None
    return _safe_div(ebit, revenue)


def net_margin(net_income: float, revenue: float) -> Optional[float]:
    if net_income is None or revenue is None:
        return None
    return _safe_div(net_income, revenue)


def roe(net_income: float, avg_equity: float) -> Optional[float]:
    if net_income is None or avg_equity is None:
        return None
    return _safe_div(net_income, avg_equity)


def roic(nopat: float, invested_capital: float) -> Optional[float]:
    if nopat is None or invested_capital is None:
        return None
    return _safe_div(nopat, invested_capital)


def current_ratio(current_assets: float, current_liabilities: float) -> Optional[float]:
    if current_assets is None or current_liabilities is None:
        return None
    return _safe_div(current_assets, current_liabilities)


def debt_to_equity(total_debt: float, total_equity: float) -> Optional[float]:
    if total_debt is None or total_equity is None:
        return None
    return _safe_div(total_debt, total_equity)


def fcf_margin(fcf: float, revenue: float) -> Optional[float]:
    if fcf is None or revenue is None:
        return None
    return _safe_div(fcf, revenue)


def asset_turnover(revenue: float, avg_assets: float) -> Optional[float]:
    if revenue is None or avg_assets is None:
        return None
    return _safe_div(revenue, avg_assets)


def revenue_cagr(start: float, end: float, years: int) -> Optional[float]:
    if start is None or end is None or years is None or years == 0 or start <= 0:
        return None
    return (end / start) ** (1 / years) - 1


def pe_ratio(price: float, eps: float) -> Optional[float]:
    if price is None or eps is None or eps == 0:
        return None
    return _safe_div(price, eps)


def ev_ebitda(ev: float, ebitda: float) -> Optional[float]:
    if ev is None or ebitda is None:
        return None
    return _safe_div(ev, ebitda)


def yoy_delta(current: float, previous: float) -> Optional[float]:
    if current is None or previous is None or previous == 0:
        return None
    return (current - previous) / abs(previous)
