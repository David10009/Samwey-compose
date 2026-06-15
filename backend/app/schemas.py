from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ContactCreate(BaseModel):
    name: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=20)
    address: Optional[str] = Field(None, max_length=200)
    fabric_type: Optional[str] = Field(None, max_length=20)
    spotlight_count: int = Field(default=0, ge=0)
    chandelier_count: int = Field(default=0, ge=0)
    pipe_count: int = Field(default=0, ge=0)
    corner_count: int = Field(default=0, ge=0)
    description: Optional[str] = None


class ContactResponse(ContactCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkImageResponse(BaseModel):
    id: int
    filename: str
    url: str
    sort_order: int

    class Config:
        from_attributes = True


class WorkCreate(BaseModel):
    title: str = Field(..., max_length=100)
    subtitle: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    layout: str = Field(default="square", max_length=20)
    sort_order: int = Field(default=0, ge=0)


class WorkResponse(BaseModel):
    id: int
    title: str
    subtitle: Optional[str]
    description: Optional[str]
    layout: str
    sort_order: int
    created_at: datetime
    images: List[WorkImageResponse] = []

    class Config:
        from_attributes = True