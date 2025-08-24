# backend/main.py
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from fastapi import File, UploadFile
import json
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

# NEW: MongoDB imports
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# Secret key (keep safe in env variable in real projects)
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hasher
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ---- SQLite User Database Setup ----
def init_db():
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
    """)
    conn.commit()
    conn.close()

init_db()

# ---- Models ----
class User(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

# ---- NEW: Mongo Models ----
class QueryLog(BaseModel):
    user: str
    query: str
    response: str
    location: str | None = None
    timestamp: datetime = datetime.utcnow()

# Create JWT token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---- NEW: MongoDB Connection ----
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["memory_db"]  # database
conversations = db["conversations"]  # collection

# ---- Routes ----
@app.get("/")
def root():
    return {"message": "FastAPI backend is running!"}

# ---------------- SIGNUP ----------------
@app.post("/signup")
def signup(user: User):
    conn = sqlite3.connect("users.db")
    cur = conn.cursor()
    hashed = pwd_context.hash(user.password)
    try:
        cur.execute("INSERT INTO users (username, password) VALUES (?, ?)", (user.username, hashed))
        conn.commit()
        return {"message": "User created successfully"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

# ---------------- LOGIN ----------------
@app.post("/login")
def login(data: LoginRequest):
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT password FROM users WHERE username=?", (data.username,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    stored_hash = row[0]
    if not pwd_context.verify(data.password, stored_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    # ✅ Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": data.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------- GET CURRENT USER ----------------
@app.get("/me")
def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")

    try:
        token = auth_header.split(" ")[1]  # Remove "Bearer"
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

    return {"username": username}

# ---------------- NEW: Save Query/Response ----------------
@app.post("/save_query")
async def save_query(log: QueryLog):
    doc = log.dict()
    result = await conversations.insert_one(doc)
    return {"message": "Query saved", "id": str(result.inserted_id)}

# ---------------- NEW: Get User History ----------------
@app.get("/history/{username}")
async def get_history(username: str):
    cursor = conversations.find({"user": username}).sort("timestamp", -1)
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return {"history": history}

# --- Location collection ---
location_collection = db["user_locations"]

# Upload JSON file containing user location
@app.post("/upload_location")
async def upload_location(request: Request, file: UploadFile = File(...)):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")
    token = auth_header.split(" ")[1]
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")

    contents = await file.read()
    try:
        location_data = json.loads(contents)
    except:
        raise HTTPException(status_code=400, detail="Invalid JSON file")

    # Save/replace user’s location
    location_collection.update_one(
        {"user": username},
        {"$set": {"location": location_data}},
        upsert=True
    )
    return {"message": "Location uploaded", "location": location_data}
# ---------------- CHAT ENDPOINT ----------------
@app.post("/chat")
async def chat(user_query: dict, request: Request):
    # --- Verify JWT ---
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

    # --- Get stored location ---
    user_location = await location_collection.find_one(
        {"user": username}, {"_id": 0, "location": 1}
    )
    location = user_location["location"] if user_location else {}

    # --- Dummy response (replace later with LLM) ---
    dummy_response = f"This is a placeholder answer for: {user_query['query']}"

    # --- Save chat into Mongo ---
    doc = {
        "user": username,
        "query": user_query["query"],
        "response": dummy_response,
        "location": location,
        "timestamp": datetime.utcnow()
    }
    await conversations.insert_one(doc)

    return {
        "message": "Query saved",
        "query": user_query["query"],
        "response": dummy_response,
        "location": location
    }
