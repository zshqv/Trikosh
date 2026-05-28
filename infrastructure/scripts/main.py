from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "trikosh"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "ashu")
    )

@app.get("/api/companies")
def get_companies():
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM companies ORDER BY sector, name")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return {"total": len(rows), "companies": rows}

@app.get("/api/sectors")
def get_sectors():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT sector FROM companies ORDER BY sector")
    rows = [r[0] for r in cur.fetchall()]
    cur.close()
    conn.close()
    return {"sectors": rows}

@app.get("/api/companies/{ticker}")
def get_company(ticker: str):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    
    cur.execute("SELECT * FROM companies WHERE ticker = %s", (ticker.upper(),))
    company = cur.fetchone()
    if not company:
        raise HTTPException(status_code=404, detail=f"Company not found: {ticker}")
    
    cur.execute("SELECT * FROM income_statements WHERE ticker = %s ORDER BY period_end DESC", (ticker.upper(),))
    income = cur.fetchall()
    
    cur.execute("SELECT * FROM balance_sheets WHERE ticker = %s ORDER BY period_end DESC", (ticker.upper(),))
    balance = cur.fetchall()
    
    cur.execute("SELECT * FROM cash_flow_statements WHERE ticker = %s ORDER BY period_end DESC", (ticker.upper(),))
    cashflow = cur.fetchall()
    
    cur.execute("SELECT * FROM financial_ratios WHERE ticker = %s ORDER BY period_end DESC", (ticker.upper(),))
    ratios = cur.fetchall()
    
    cur.execute("SELECT * FROM market_data WHERE ticker = %s ORDER BY as_of_date DESC LIMIT 1", (ticker.upper(),))
    market = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return {
        "company": dict(company),
        "income_statements": [dict(r) for r in income],
        "balance_sheets": [dict(r) for r in balance],
        "cash_flow_statements": [dict(r) for r in cashflow],
        "financial_ratios": [dict(r) for r in ratios],
        "market_data": dict(market) if market else None
    }