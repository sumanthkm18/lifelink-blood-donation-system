from database import SessionLocal
from models import User
from auth import hash_password

db = SessionLocal()

email = "admin@gmail.com"

existing_user = db.query(User).filter(User.email == email).first()

if existing_user:
    existing_user.password_hash = hash_password("admin123")
    existing_user.role = "ADMIN"
    existing_user.is_active = True
    print("Existing admin updated")
else:
    admin = User(
        name="Admin",
        email=email,
        password_hash=hash_password("admin123"),
        role="ADMIN",
        is_active=True
    )
    db.add(admin)
    print("New admin created")

db.commit()
db.close()

print("Done")