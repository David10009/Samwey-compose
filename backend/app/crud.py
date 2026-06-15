from sqlalchemy.orm import Session
from . import models, schemas


# --- Contacts ---

def create_contact(db: Session, contact: schemas.ContactCreate):
    db_contact = models.Contact(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Contact).offset(skip).limit(limit).all()


def get_contact(db: Session, contact_id: int):
    return db.query(models.Contact).filter(models.Contact.id == contact_id).first()


# --- Works ---

def create_work(db: Session, work: schemas.WorkCreate):
    db_work = models.Work(**work.model_dump())
    db.add(db_work)
    db.commit()
    db.refresh(db_work)
    return db_work


def get_works(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Work).order_by(models.Work.sort_order).offset(skip).limit(limit).all()


def get_work(db: Session, work_id: int):
    return db.query(models.Work).filter(models.Work.id == work_id).first()


def update_work(db: Session, work_id: int, work_data: schemas.WorkCreate):
    db_work = get_work(db, work_id)
    if db_work:
        for key, value in work_data.model_dump().items():
            setattr(db_work, key, value)
        db.commit()
        db.refresh(db_work)
    return db_work


def delete_work(db: Session, work_id: int):
    db_work = get_work(db, work_id)
    if db_work:
        db.delete(db_work)
        db.commit()
        return True
    return False


def add_work_image(db: Session, work_id: int, filename: str, sort_order: int = 0):
    db_image = models.WorkImage(work_id=work_id, filename=filename, sort_order=sort_order)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def delete_work_image(db: Session, image_id: int):
    db_image = db.query(models.WorkImage).filter(models.WorkImage.id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
        return True
    return False