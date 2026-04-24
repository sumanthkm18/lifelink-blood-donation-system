from database import SessionLocal
from models import User
from auth import hash_password

db = SessionLocal()

# Check if admin already exists
existing = db.query(User).filter(User.email == "admin@gmail.com").first()

if existing:
    print("Admin already exists")
else:
    admin = User(
        name="Admin",
        email="admin@gmail.com",
        password_hash=hash_password("admin@123"),
        role="ADMIN",
        is_active=True
    )

    db.add(admin)
    db.commit()
    print("Admin created successfully")

db.close()