from pydantic import BaseModel
from typing import Optional


class CompanyBase(BaseModel):
    ticker: str
    exchange: str
    name: str
    sector: str
    industry: str
    analytical_lens: str


class CompanyOut(CompanyBase):
    id: str

    model_config = {"from_attributes": True}


class CompanyListParams(BaseModel):
    sector: Optional[str] = None
    limit: int = 20
    offset: int = 0
