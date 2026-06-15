import sys
sys.path.insert(0, '.')
from app.database import SessionLocal
from app.models import Work, WorkImage

db = SessionLocal()
works = db.query(Work).order_by(Work.sort_order).all()
print(f"Total works: {len(works)}")
for w in works:
    print(f"  ID={w.id}, title='{w.title}', layout='{w.layout}', images={len(w.images)}")
    for img in w.images:
        print(f"    Image: id={img.id}, filename='{img.filename}'")
db.close()