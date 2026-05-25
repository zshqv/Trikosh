from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FinancialBase(BaseModel):
    period: str
    metric: str
    value: float
    unit: str
    source: str
    standard: str
    currency: str


class FinancialOut(FinancialBase):
    id: str
    company_id: str
    updated_at: datetime

    model_config = {"from_attributes": True}
