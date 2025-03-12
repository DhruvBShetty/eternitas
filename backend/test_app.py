from fastapi.testclient import TestClient
from pydantic import BaseModel
from postgrest.exceptions import APIError
import json
from fastapi import HTTPException
import supabase
import os
from supabase import create_client
import jwt
import uuid

from .app import app

url= os.environ.get("SUPABASE_URL")
key= os.environ.get("SUPABASE_KEY")
et_key=os.environ.get("ETERNITAS_KEY")

client = TestClient(app)
supabase= create_client(url, key)

url= os.environ.get("SUPABASE_URL")
key= os.environ.get("SUPABASE_KEY")

def test_read_app():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Eternitas"}


# def test_priv():
#     try:
#         memo_info=supabase.table("Memorial_info").select("id,First_name,Middle_name,Last_name,Date_of_birth,Date_of_death,Relationship,Description,Profile_pic,Privacy").eq("id",2).execute()
    
#     except APIError as e:
#         raise HTTPException(status_code=400, detail=e.details)
    
#     data=memo_info.data
    
#     assert data[0]["Privacy"]==True



def test_verify_cookie():
    guest_id=uuid.uuid4()
    payload={"anon_id":str(guest_id),"Pages":"[2,26]"}
    token=jwt.encode(payload,et_key,algorithm="HS256")

    client.cookies.set(name="Eternitas_pages",value=token)
    
    response = client.post("/api/verifycookie",json={"uid":2})
    
    # print(response.cookies["Eternitas_pages"])
    assert response.json().get("message")=="Token is valid"
    assert response.status_code==200


def test_set_cookie():
    
    uid:int=2
        
    guest_id=uuid.uuid4()
    payload={"anon_id":str(guest_id),"Pages":"[26]"}
    token=jwt.encode(payload,et_key,algorithm="HS256")
    client.cookies.set(name="Eternitas_pages",value=token)

    response = client.post("/api/setpcookie", json={"uid":uid})
    token=response.cookies["Eternitas_pages"]

    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e))
    
    pages_list = json.loads(payload.get('Pages'))

    print(pages_list)

    if uid in pages_list:
        assert True
    else:
        assert False

def test_set_cookie_withpass():
    
    uid:int=2
    uid2:int=3
        
    guest_id=uuid.uuid4()
    payload={"anon_id":str(guest_id),"Pages":"[26]"}
    token=jwt.encode(payload,et_key,algorithm="HS256")
    client.cookies.set(name="Eternitas_pages",value=token)

    response = client.post("/api/setpcookie", json={"uid":uid,"password":"password"})

    token=response.cookies["Eternitas_pages"]
    try:
        payload=jwt.decode(token,et_key,algorithms=["HS256"])
    except Exception as e:
        raise HTTPException(status_code=401,detail=str(e))
    
    pages_list = json.loads(payload.get('Pages'))

    if uid in pages_list:
        assert True
    else:
        assert False
    
    response2 = client.post("/api/setpcookie",json={"uid":uid2,"password":"pass"})

    assert response2.status_code==401


def test_public_profdata():

    uid:int=2
        
    guest_id=uuid.uuid4()
    payload={"id":uid}
    token=jwt.encode(payload,et_key,algorithm="HS256")
    
    client.cookies.set(name="Eternitas_session",value=token)

    response=client.post("/api/profiledata/2")

    print(response.json())




    

    

   

    


