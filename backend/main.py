import os
import logging
import bcrypt
from datetime import datetime, timedelta
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel

# 1. Configuration & Environment
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY", "chantel_super_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# 2. Audit Logging Setup
# We log to both app.log (requirement) and the console (standard practice)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("ChantelChecklist")

app = FastAPI(title="Chantel's Checklist API")

# 3. CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# In-memory store (Reset on server restart)
users_db = {}

class UserAuth(BaseModel):
    username: str
    password: str

# 4. Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifies the JWT token and returns the username."""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token missing identity")
        return username
    except jwt.ExpiredSignatureError:
        logger.warning("Expired session attempt blocked.")
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except JWTError:
        logger.error("Security: Invalid token signature detected.")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

# 5. API Endpoints
@app.get("/")
async def health_check():
    return {"status": "active", "system": "Chantel's Checklist API"}

@app.post("/register")
async def register(user: UserAuth):
    if user.username in users_db:
        logger.warning(f"Registration conflict: User '{user.username}' already exists.")
        raise HTTPException(status_code=400, detail="Username is already taken.")
    
    users_db[user.username] = hash_password(user.password)
    logger.info(f"AUDIT: New user registered successfully: {user.username}")
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: UserAuth):
    hashed_pass = users_db.get(user.username)
    
    if not hashed_pass or not check_password(user.password, hashed_pass):
        logger.warning(f"AUDIT: Failed login attempt for user: {user.username}")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = create_access_token(data={"sub": user.username})
    logger.info(f"AUDIT: User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/protected")
async def protected_route(username: str = Depends(get_current_user)):
    logger.info(f"AUDIT: Protected access granted for: {username}")
    return {
        "message": f"Hello {username}, you are authenticated!",
        "username": username,
        "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }