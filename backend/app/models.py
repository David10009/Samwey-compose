from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(200), nullable=True)
    fabric_type = Column(String(20), nullable=True)
    spotlight_count = Column(Integer, default=0)
    chandelier_count = Column(Integer, default=0)
    pipe_count = Column(Integer, default=0)
    corner_count = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Work(Base):
    __tablename__ = "works"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    subtitle = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    layout = Column(String(20), default="square")  # wide, tall, square, photo
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    images = relationship("WorkImage", back_populates="work", cascade="all, delete-orphan", order_by="WorkImage.sort_order")


class WorkImage(Base):
    __tablename__ = "work_images"

    id = Column(Integer, primary_key=True, index=True)
    work_id = Column(Integer, ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    sort_order = Column(Integer, default=0)

    work = relationship("Work", back_populates="images")