from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# 1. pip install fastapi uvicorn
# 2. uvicorn app:app --reload
app = FastAPI()

<<<<<<< Updated upstream
app = Flask(__name__)

# CORS configuration for all routes and methods
CORS(app, resources={r"/*": {"origins": "http://localhost:3000", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"]}})
=======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"],
)
>>>>>>> Stashed changes

users = {}

class User(BaseModel):
    email: str
    password: str

<<<<<<< Updated upstream
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
=======
@app.get("/")
async def home():
    return {"message": "Welcome to the FastAPI, Ovidiu"}
>>>>>>> Stashed changes

@app.post("/api/register")
async def register(user: User):
    if user.email in users:
        raise HTTPException(status_code=400, detail="User already exists")

<<<<<<< Updated upstream
    users[email] = password
    return jsonify(message="User registered successfully"), 201
=======
    users[user.email] = user.password
    return {"message": "User registered successfully"}, 201
>>>>>>> Stashed changes

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
