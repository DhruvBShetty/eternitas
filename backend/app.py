from fastapi import FastAPI, HTTPException, Depends,Request,Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt  
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client
import os
from gotrue.errors import AuthApiError
from datetime import date
import bcrypt
from fastapi.security import HTTPBearer
import json
from postgrest.exceptions import APIError
load_dotenv()

app = FastAPI()
security = HTTPBearer()
url= os.environ.get("SUPABASE_URL")
key= os.environ.get("SUPABASE_KEY")
supabase= create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With", "X-API-KEY"],
    allow_credentials=True
)

users = {}  
SECRET_KEY = "your_secret_key" 

class User(BaseModel):
    email: str
    password: str

class Email(BaseModel):
    email:str

class Password(BaseModel):
    password:str
    token: str = Depends(security)

@app.get("/")
async def home():
    return {"message": "Welcome to FastAPI"}

def generate_verification_token(email: str):
    expiration = datetime.utcnow() + timedelta(hours=1)  
    token = jwt.encode({"email": email, "exp": expiration}, SECRET_KEY, algorithm="HS256")
    return token


def send_verification_email(email: str, token: str):
    sender_email = "xxoliverytxx@gmail.com" 
    receiver_email = email
    subject = "Verify your email"
    verification_link = f"http://localhost:8000/api/verify_email/{token}" 

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = subject
    body = f"Click the link to verify your email: {verification_link}"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465) 
        server.login(sender_email, "wzhu kvqk nptu mcuv")  
        server.sendmail(sender_email, receiver_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

@app.post("/api/register")
async def register(user: User):

    salt=bcrypt.gensalt(rounds=8)
    password=user.password.encode('utf-8')
    hash=str(bcrypt.hashpw(password, salt))

    try:
        acc=supabase.table("Account").insert([{"created_at":date.today().strftime("%Y-%m-%d"),"email":user.email,"password":hash}]).execute()
    except APIError as e:
        raise HTTPException(status_code=400, detail=e.details)
        
    user=supabase.auth.sign_up({"email": user.email, "password": user.password})
    return {"message": "Registration successful. Please check your email to verify your account."}


@app.post("/api/login")
async def login(user:User):
    try:
        session=supabase.auth.sign_in_with_password({"email":user.email,"password":user.password})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)
    
    return session

@app.post("/api/forgotpassword")
async def forgotpassword(email:Email):
    try:
       supabase.auth.reset_password_for_email(email.email, {"redirect_to": "http://localhost:3000/Reset-password",})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)

@app.post("/api/updatepassword")
async def updatepassword(request:Request):

    access_token=request.cookies.get('access_token')
    refresh_token=request.cookies.get('refresh_token')

    session = supabase.auth.set_session(access_token, refresh_token)
    data = await request.json()
    password=data.get('password')

    try:
        upd_pass=supabase.auth.update_user({"password": password})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)
    
    try:
        salt=bcrypt.gensalt(rounds=8)
        password=password.encode('utf-8')
        hash=str(bcrypt.hashpw(password, salt))
        upd_public=supabase.table("Account").update({"password":hash}).eq("email",session.user.email).execute()
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)

    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
