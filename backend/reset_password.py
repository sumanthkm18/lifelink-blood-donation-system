from database import SessionLocal
from models import User
from auth import hash_password

db = SessionLocal()

email = "admin@gmail.com"

user = db.query(User).filter(User.email == email).first()

if user:
    user.password_hash = hash_password("admin123")
    user.role = "ADMIN"
    user.is_active = True
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