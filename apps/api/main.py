import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import companies, sectors, financials, ratios, search, kits

app = FastAPI(
    title="Trikosh API",
    version="1.0.0",
    description="Open financial research infrastructure API for the Trikosh platform.",
)

origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    os.getenv("PRODUCTION_DOMAIN", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(companies.router, prefix="/api/v1")
app.include_router(sectors.router, prefix="/api/v1")
app.include_router(financials.router, prefix="/api/v1")
app.include_router(ratios.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(kits.router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
