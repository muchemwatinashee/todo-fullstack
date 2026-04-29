import os
import logging
import bcrypt
from datetime import datetime, timedelta

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

users_db = {}


class UserAuth(BaseModel):
    username: str
    password: str


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        hashed.encode("utf-8")
    )


def create_token(username: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": username, "exp": expire},
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        logger.warning("Invalid token attempt")
        raise HTTPException(status_code=401, detail="Invalid token")


@app.post("/register")
async def register(user: UserAuth):
    if user.username in users_db:
        logger.warning(f"Registration failed: {user.username} already exists")
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.username] = hash_password(user.password)
    logger.info(f"User registered: {user.username}")
    return {"message": "Account created successfully"}


@app.post("/login")
async def login(user: UserAuth):
    db_pass = users_db.get(user.username)
    if not db_pass or not check_password(user.password, db_pass):
        logger.warning(f"Login failed for: {user.username}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user.username)
    logger.info(f"User logged in: {user.username}")
    return {"access_token": token, "token_type": "bearer"}


@app.get("/protected")
async def protected_route(token_data: str = Depends(verify_token)):
    # use token_data instead of username
    logger.info(f"Protected route accessed by: {token_data}")
    return {
        "message": f"Hello {token_data}, you are authenticated!",
        "username": token_data
    }