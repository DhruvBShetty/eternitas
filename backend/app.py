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
et_key=os.environ.get("ETERNITAS_KEY")
PORT=os.environ.get("PORT")
supabase= create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)
 
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
async def login(user:User,request:Response):
    try:
        user_d=supabase.auth.sign_in_with_password({"email":user.email,"password":user.password})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)
    
    try:
        myuser = supabase.table("Account").select("id").eq("email",user.email).execute()
    except APIError:
        raise HTTPException(status_code=400, detail=e.details)
    
    payload={"email":user.email,"id":myuser.data[0].get("id"),"exp": datetime.now() + timedelta(hours=1)}
    token=jwt.encode(payload,et_key,algorithm="HS256")
    request.set_cookie(key="Eternitas_session",value=token,httponly=True,samesite="Strict")
    

@app.post("/api/forgotpassword")
async def forgotpassword(email:Email):
    try:
       supabase.auth.reset_password_for_email(email.email, {"redirect_to": "http://localhost:3000/Reset-password",})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)
    
@app.post("/api/getsession")
async def getsession(request:Request):
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
        return {"isAuthenticated":True}
    except Exception:
        return {"isAuthenticated":False}

@app.post("/api/updatepassword")
async def updatepassword(request:Request):

    access_token=request.cookies.get("access_token_Eternitas")
    refresh_token=request.cookies.get("refresh_token_Eternitas")

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

@app.post("/api/createprofile")
async def createprofile(request:Request):
          token=request.cookies.get("Eternitas_session")
          try:
            payload=jwt.decode(token,et_key,algorithms=["HS256"])
          except Exception as e:
            raise HTTPException(status_code=401,detail=str(e))
            
          data = await request.json()
          
          try:
            supabase.table("Memorial_info").upsert({"id":payload.get("id"),"First_name":data.get("firstName"),
            "Middle_name":data.get("middleName"),"Last_name":data.get("lastName"),"Date_of_birth":data.get("dob"),
            "Date_of_death":data.get("deathDate"),"Relationship":data.get("relationship"),"Description":data.get("description")}).execute()
          except APIError as e:
            raise HTTPException(status_code=400, detail=e.details)
              
@app.get("/api/editprofile")
async def getprofile(request:Request):
        token=request.cookies.get("Eternitas_session")
        try:
            payload=jwt.decode(token,et_key,algorithms=["HS256"])
        except Exception as e:
            raise HTTPException(status_code=401,detail=str(e))
            
        try:
            memo_info=supabase.table("Memorial_info").select("*").eq("id",payload.get("id")).execute()
        except APIError as e:
            raise HTTPException(status_code=400, detail=e.details)
        
        return memo_info

          
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=PORT)
