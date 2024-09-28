from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"],
)

users = {}

class User(BaseModel):
    email: str
    password: str

@app.get("/")
async def home():
    return {"message": "Welcome to FastAPI"}

@app.post("/api/register")
async def register(user: User):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")
    
    users[user.email] = user.password
    return {"message": "User registered successfully"}, 201

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
