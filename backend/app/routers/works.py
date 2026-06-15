import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/works", tags=["works"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")


def ensure_work_dir(work_id: int) -> str:
    work_dir = os.path.join(UPLOAD_DIR, f"work_{work_id}")
    os.makedirs(work_dir, exist_ok=True)
    return work_dir


def get_image_url(work_id: int, filename: str) -> str:
    return f"/uploads/work_{work_id}/{filename}"


@router.get("/", response_model=list[schemas.WorkResponse])
def read_works(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    works = crud.get_works(db, skip=skip, limit=limit)
    result = []
    for w in works:
        w_dict = {
            "id": w.id,
            "title": w.title,
            "subtitle": w.subtitle,
            "description": w.description,
            "layout": w.layout,
            "sort_order": w.sort_order,
            "created_at": w.created_at,
            "images": [
                {
                    "id": img.id,
                    "filename": img.filename,
                    "url": get_image_url(w.id, img.filename),
                    "sort_order": img.sort_order,
                }
                for img in w.images
            ],
        }
        result.append(w_dict)
    return result


@router.get("/{work_id}", response_model=schemas.WorkResponse)
def read_work(work_id: int, db: Session = Depends(get_db)):
    w = crud.get_work(db, work_id)
    if not w:
        raise HTTPException(status_code=404, detail="Work not found")
    return {
        "id": w.id,
        "title": w.title,
        "subtitle": w.subtitle,
        "description": w.description,
        "layout": w.layout,
        "sort_order": w.sort_order,
        "created_at": w.created_at,
        "images": [
            {
                "id": img.id,
                "filename": img.filename,
                "url": get_image_url(w.id, img.filename),
                "sort_order": img.sort_order,
            }
            for img in w.images
        ],
    }


@router.post("/", response_model=schemas.WorkResponse)
def create_work(work: schemas.WorkCreate, db: Session = Depends(get_db)):
    return crud.create_work(db=db, work=work)


@router.put("/{work_id}", response_model=schemas.WorkResponse)
def update_work(work_id: int, work: schemas.WorkCreate, db: Session = Depends(get_db)):
    db_work = crud.update_work(db, work_id, work)
    if not db_work:
        raise HTTPException(status_code=404, detail="Work not found")
    return {
        "id": db_work.id,
        "title": db_work.title,
        "subtitle": db_work.subtitle,
        "description": db_work.description,
        "layout": db_work.layout,
        "sort_order": db_work.sort_order,
        "created_at": db_work.created_at,
        "images": [
            {
                "id": img.id,
                "filename": img.filename,
                "url": get_image_url(db_work.id, img.filename),
                "sort_order": img.sort_order,
            }
            for img in db_work.images
        ],
    }


@router.delete("/{work_id}")
def delete_work(work_id: int, db: Session = Depends(get_db)):
    # Remove uploads directory
    work_dir = os.path.join(UPLOAD_DIR, f"work_{work_id}")
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    if crud.delete_work(db, work_id):
        return {"message": "Work deleted"}
    raise HTTPException(status_code=404, detail="Work not found")


@router.post("/{work_id}/images")
async def upload_image(work_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    w = crud.get_work(db, work_id)
    if not w:
        raise HTTPException(status_code=404, detail="Work not found")

    work_dir = ensure_work_dir(work_id)
    filepath = os.path.join(work_dir, file.filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    sort_order = len(w.images)
    db_image = crud.add_work_image(db, work_id, file.filename, sort_order)
    return {
        "id": db_image.id,
        "filename": db_image.filename,
        "url": get_image_url(work_id, db_image.filename),
        "sort_order": db_image.sort_order,
    }


@router.delete("/images/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db)):
    from ..models import WorkImage
    img = db.query(WorkImage).filter(WorkImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")

    filepath = os.path.join(UPLOAD_DIR, f"work_{img.work_id}", img.filename)
    if os.path.exists(filepath):
        os.remove(filepath)

    if crud.delete_work_image(db, image_id):
        return {"message": "Image deleted"}
    raise HTTPException(status_code=404, detail="Image not found")