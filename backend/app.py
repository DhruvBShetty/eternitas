from fastapi import FastAPI, HTTPException, Depends,Request,Response,File,UploadFile,Cookie,Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import jwt  
from datetime import datetime, timedelta,timezone
from dotenv import load_dotenv
from supabase import create_client
import os
from gotrue.errors import AuthApiError
from datetime import date
import bcrypt
from fastapi.security import HTTPBearer
import json
from postgrest.exceptions import APIError
import boto3
from botocore.exceptions import NoCredentialsError
import uuid
import httpx
from typing import List
import hmac
import hashlib
import base64
import string
import random
import botocore
import psycopg2
from uuid import UUID

load_dotenv()

app = FastAPI()
security = HTTPBearer()
url= os.environ.get("SUPABASE_URL")
key= os.environ.get("SUPABASE_KEY")
et_key=os.environ.get("ETERNITAS_KEY")
aws_access=os.environ.get("AWS_ACCESS_KEY")
aws_secret=os.environ.get("AWS_SECRET_KEY")
aws_bucket=os.environ.get("AWS_S3_BUCKET_NAME")
aws_region=os.environ.get("AWS_REGION")
webhook=os.environ.get("SHOPIFY_WEBHOOK_KEY")


supabase= create_client(url, key)
s3_client=boto3.client(service_name='s3',region_name=aws_region,aws_access_key_id=aws_access,aws_secret_access_key=aws_secret)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.11:3000","http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)


class User(BaseModel):
    email: str
    password: str
    remember:bool

class Email(BaseModel):
    email:str

class Password(BaseModel):
    password:str
    token: str = Depends(security)


def generate_password(length=12):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.choice(characters) for _ in range(length))


def checkpassword(password:str = Body(...),uid:int = Body(...)):
    try:
        memo_info=supabase.table("Memorial_info").select("Pagepassword").eq("id",uid).execute()
    except APIError as e:
        raise HTTPException(status_code=400, detail=e.details)
    
    if(memo_info.data==[]):
        return False
    
    mypass=memo_info.data[0].get("Pagepassword",False)

    
    Pagepass:bytes=base64.b64decode(mypass)
    passwordbytes:bytes=password.encode('utf-8')

    return bcrypt.checkpw(passwordbytes,Pagepass)

def allowview(id:int,Eternitas_pages:str = Cookie(None),Eternitas_session:str=Cookie(None)):

    try:
        memo_info=supabase.table("Memorial_info").select("Privacy").eq("id",id).execute()
    except APIError as e:
        raise HTTPException(status_code=400, detail=e.details)
    
    if(memo_info.data==[]):
        return False
    
    if(memo_info.data[0]["Privacy"]==False):
        return True
    
    if Eternitas_session is not None:
        try:
            payl=jwt.decode(Eternitas_session,et_key,algorithms=["HS256"])
            theid=payl.get("id")
            if(theid==id):
                return True
        except Exception as e:
            pass
    
    if Eternitas_pages is not None:
        try:
            payload=jwt.decode(Eternitas_pages,et_key,algorithms=["HS256"])
        except Exception as e:
            return False
        
        if(payload.get('Pages',"No available Pages")=="No available Pages" or payload.get('anon_id',"No anon id")=="No anon id"):
            return False
        
        pages_list = json.loads(payload.get('Pages'))

        if id in pages_list:
            return True
        else:
            return False
    
    
@app.get("/")
async def home():
    return {"message": "Welcome to Eternitas"}


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

@app.post("/api/registeruser") 
async def registeruser(request:Request):
    raw_body=await request.body()
    print(raw_body)
    shopify_hmac_header=request.headers.get('x-shopify-hmac-sha256')
    secret=webhook.encode("utf-8")
    computed_hmac = hmac.new(secret, raw_body, hashlib.sha256).digest()
    computed_hmac_base64 = base64.b64encode(computed_hmac).decode()

    if not hmac.compare_digest(computed_hmac_base64, shopify_hmac_header):
        raise HTTPException(status_code=400, detail="Invalid HMAC")

    salt=bcrypt.gensalt(rounds=8)
    password=generate_password()
    hash=str(bcrypt.hashpw(password.encode('utf-8'), salt))

    body=json.loads(raw_body.decode('utf-8'))
    email=body["contact_email"]

    try:
        acc=supabase.table("Account").insert([{"created_at":date.today().strftime("%Y-%m-%d"),"email":email,"password":hash}]).execute()
    except APIError as e:
        print(e)
        raise HTTPException(status_code=400, detail=e.details)

    try:
        user=supabase.auth.sign_up({"email": email, "password": password,"options":{
        "email_redirect_to":"https://eternitas-story.ro/Reset-password",}})
    except APIError as e:
        print(e)
        raise HTTPException(status_code=400, detail=e.details)


@app.post("/api/login")
async def login(user:User,request:Response):
    try:
        user_d=supabase.auth.sign_in_with_password({"email":user.email,"password":user.password})
    except Exception as e:
        print(e)
        raise HTTPException(status_code=e.status, detail=e.message)
    
    try:
        myuser = supabase.table("Account").select("id").eq("email",user.email).execute()
    except APIError as e:
        print(e)
        raise HTTPException(status_code=400, detail=e.details)
    
    
    remember_for=5

    if(user.remember):
        remember_for=20160
 
    payload={"email":user.email,"id":myuser.data[0].get("id"),"exp": datetime.now(timezone.utc) + timedelta(minutes=remember_for)}
    token=jwt.encode(payload,et_key,algorithm="HS256")
    request.set_cookie(key="Eternitas_session",value=token,httponly=True,samesite="Strict",expires=datetime.now(timezone.utc) + timedelta(minutes=remember_for))
    

@app.post("/api/forgotpassword")
async def forgotpassword(email:Email):
    try:
       supabase.auth.reset_password_for_email(email.email, {"redirect_to": "http://localhost:3000/Reset-password",})
    except Exception as e:
        raise HTTPException(status_code=e.status, detail=e.message)
    
@app.post("/api/getsession")
async def getsession(request:Request,response:Response):
    token=request.cookies.get("Eternitas_session")
    
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
        return {"isAuthenticated":True}
    except Exception:
        response.delete_cookie("Eternitas_session")
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
          
@app.post("/api/logout")
async def logout(request:Response):
    request.delete_cookie("Eternitas_session")
    
              
@app.get("/api/editprofile")
async def editprofile(request:Request,response:Response):
        token=request.cookies.get("Eternitas_session")
        try:
            payload=jwt.decode(token,et_key,algorithms=["HS256"])
        except Exception as e:
            response.delete_cookie("Eternitas_session")
            raise HTTPException(status_code=401,detail=str(e))
            
        try:
            memo_info=supabase.table("Memorial_info").select("*").eq("id",payload.get("id")).execute()
            return memo_info
            
        except APIError as e:
            print(e)
            raise HTTPException(status_code=400, detail=e.details)
        
        except httpx.ConnectError:
            raise HTTPException(status_code=500, detail="No internet connection")

        
@app.post("/api/uploadpic")
def uploadpic(request:Request,file: UploadFile = File(...)):
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e))
    
    timestamp = int(datetime.now(timezone.utc).timestamp() * 1000)

    try:
        pfpstring=str(payload.get("id"))+f"/profilepic?t={timestamp}"
        memo_info=supabase.table("Memorial_info").update({"Profile_pic":pfpstring}).eq("id",payload.get("id")).execute()
    except APIError as e:
        print(e)
        raise HTTPException(status_code=503, detail=e.details)

    new_fname=str(payload.get("id"))+"/"+"profilepic"
    try:
        s3_client.upload_fileobj(file.file,aws_bucket,new_fname, ExtraArgs={
                "ACL": "public-read",
                "ContentType": file.content_type,  # Use content type provided by the client
            })
    except NoCredentialsError:
        print("?")
        return JSONResponse(content={"error": "AWS credentials not found"}, status_code=500)
    except Exception as e:
        print(e)
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/api/uploadmedia")
async def uploadmedia(request:Request,files: List[UploadFile] = File(...)):
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e))    

    for file in files:
        file_name = str(payload.get("id"))+"/media/"+file.filename
        try:
            s3_client.upload_fileobj(file.file,aws_bucket,file_name, ExtraArgs={
                    "ACL": "public-read",
                    "ContentType": file.content_type,  # Use content type provided by the client
                })
        except NoCredentialsError:
            print("?")
            return JSONResponse(content={"error": "AWS credentials not found"}, status_code=500)
        except Exception as e:
            print(e)
            return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/getmedia")
async def getmedia(request:Request):
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e)) 

    folder_prefix=str(payload.get("id"))+'/media/'

    response = s3_client.list_objects_v2(Bucket=aws_bucket, Prefix=folder_prefix)

    # Check if there are any objects in the folder
    if 'Contents' in response:
        # Extract the file names (keys)
        file_names = [obj['Key'] for obj in response['Contents']]
        return file_names
    else:   
        return []        

@app.post("/api/profiledata/{id}")
def profiledata(id:int,view:bool=Depends(allowview)):
    if view:
        try:
            memo_info=supabase.table("Memorial_info").select("id,First_name,Middle_name,Last_name,Date_of_birth,Date_of_death,Relationship,Description,Profile_pic,Privacy").eq("id",id).execute()
            return memo_info
        except APIError as e:
            raise HTTPException(status_code=400, detail=e.details)
    
    return {"data":[]}
    

@app.post("/api/profilemedia/{id}")
def profilemedia(id:int,view:bool=Depends(allowview)):
    if view:
        folder_prefix=str(id)+'/media/'

        response = s3_client.list_objects_v2(Bucket=aws_bucket, Prefix=folder_prefix)

        # Check if there are any objects in the folder
        if 'Contents' in response:
            # Extract the file names (keys)
            file_names = [obj['Key'] for obj in response['Contents']]
            return file_names
        else:   
            return []   
    return [] 

@app.delete("/api/deletemedia/{fname}",status_code=204)
async def deletemedia(request:Request,fname:str):
    print(fname)
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401,detail=str(e))  
    
    file_name = str(payload.get("id"))+"/media/"+fname
    
    try:
        s3_client.delete_object(Bucket=aws_bucket,Key=file_name)
    except botocore.exceptions.ClientError as error:
    # Put your error handling logic here
        raise error

    except botocore.exceptions.ParamValidationError as error:
        raise ValueError('The parameters you provided are incorrect: {}'.format(error))

@app.patch("/api/profile/visibility")
async def update_profile_visibility(request:Request):
    token=request.cookies.get("Eternitas_session")
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401,detail=str(e))
    
    data = await request.json()
    try:
        Privacy=data.get("Privacy")
        pword=data.get("Pagepassword")
        if(Privacy==True and len(pword)>0):
            salt=bcrypt.gensalt()
            hash=bcrypt.hashpw(pword.encode('utf-8'),salt)
            hashp = base64.b64encode(hash).decode('utf-8')
            myuser = supabase.table("Memorial_info").update({"Privacy":Privacy,"Pagepassword":hashp}).eq("id",payload.get("id")).execute()
        else:
            myuser = supabase.table("Memorial_info").update({"Privacy":Privacy}).eq("id",payload.get("id")).execute()

    except APIError as e:
        raise HTTPException(status_code=400, detail=e.details)
    

@app.get("/api/publicuserdata")
def fetch_public_user(response: Response):
    try:
        userdata = supabase.table("Memorial_info").select("id,First_name,Middle_name,Last_name,Profile_pic,Privacy").execute()
        return userdata.data
    
    except APIError as e:
        raise HTTPException(status_code=400, detail=e.details)
    
    except httpx.ConnectError:
        raise HTTPException(status_code=500, detail="No internet connection")

@app.post("/api/verifycookie")
async def verifyp(request:Request):
    
    orig=request.cookies.get("Eternitas_session")
    data = await request.json()

    try:
        origpayload=jwt.decode(orig,et_key,algorithms=["HS256"])
        if(origpayload.get("id")==data.get("uid")):
            return {"message": "Token is valid"}
        
    except Exception as e:
        pass
    
    token=request.cookies.get("Eternitas_pages")
    
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e)) 
    
    username_id=data.get("uid")

    pages_list = json.loads(payload.get('Pages'))

    gid=payload.get('anon_id')

    if username_id in pages_list:
        return {"message": "Token is valid","id":gid}
    else:
        raise HTTPException(status_code=401) 


@app.post("/api/setpcookie")
async def setpcookie(request:Request,response:Response,verified:bool=Depends(checkpassword)):

    if verified:
        token=request.cookies.get("Eternitas_pages")
        data = await request.json()
        usernameid=data.get("uid")

        if(token is None):
            guest_id=uuid.uuid4()
            payload={"anon_id":str(guest_id),"Pages":f"[{usernameid}]"}
        else:
            try:
                payload=jwt.decode(token,et_key,algorithms=["HS256"])
            except Exception as e:
                raise HTTPException(status_code=401,detail=str(e))
            
            anon_id=payload.get('anon_id')
            pages_list = json.loads(payload.get('Pages'))
            pages_list.append(usernameid)

            payload={"anon_id":anon_id,"Pages":f"{pages_list}"}

        
        new_token=jwt.encode(payload,et_key,algorithm="HS256")
        response.set_cookie(key="Eternitas_pages",value=new_token,httponly=True,samesite="Strict",expires=datetime.now(timezone.utc) + timedelta(days=3650))
        return {"message":"Private page access granted"}
    
    else:
        raise HTTPException(status_code=401)
        


        

          





    




     


    









    
        
    




       
     
