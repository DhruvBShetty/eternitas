import axios, { AxiosError } from "axios";
import { error } from "console";
import { env } from "process";
import Swal from "sweetalert2";
import { forEachChild } from "typescript";

export interface profiledata {
    profileType:string|null,
    firstName:string,
    middleName:string,
    lastName:string,
    dob:string, // Date of Birth
    deathDate:string, // Date of Death
    relationship:string,
    description:string
}

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_SERVER_ENV}/api/login`,
            { email, password }, // Request body
            {
                withCredentials: true, // Include cookies in the request
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // Extract error message from the response
            throw new Error(`${error.response.data.detail}`);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

export const registerUser = async (email: string, password: string) => {
    try {
        // Sending the POST request using axios
        const response = await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/register`, {
            email,
            password,
        });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                throw new Error(`${error.response.data.detail}` || "An error occurred");
            } else if (error.message) {
                throw new Error(error.message);
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    }
};

export const resetpassword = async (email:string)=>{
try{
    await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/forgotpassword`,{"email":email});
}
catch (error) {
    if (error instanceof Error) {
        throw new Error(error.message);
    } else {
        throw new Error("An unknown error occurred");
    }

}
};

export const updatepassword = async (password:String)=>{
    try{
        const response =await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/updatepassword`,{"password":password},{withCredentials:true})
        const data=response.data
        console.log(data);
        return data;
    }
    catch(error:unknown){
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                throw new Error(`${error.response.data.detail}` || "An error occurred");
            } else if (error.message) {
                throw new Error(error.message);
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    }
};

export const profilesubmit = async (data:profiledata)=>{
       try{
        const response = await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/createprofile`,data,{withCredentials:true});
       }
       catch(error:unknown){
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                throw new Error(`${error.response.data.detail}` || "An error occurred");
            } else if (error.message) {
                throw new Error(error.message);
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    }

}

export const getprofiledata = async()=>{
    try{
        const response = await axios.get(`${process.env.REACT_APP_SERVER_ENV}/api/editprofile`,{withCredentials:true}).then(res=>{return res.data})
        return response
    }
    catch(error:any){
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
              Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: `${error.response.data.detail}`
                            });
            } else if (error?.message) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                  });
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    }
}

export const profileupload = async(picture:File)=>{
     try {
           const formData=new FormData()
           formData.append("file",picture)
           await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/uploadpic`,formData,{
            headers:{"Content-Type": "multipart/form-data",},withCredentials:true})
     }
     catch(error:unknown){
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
                throw new Error(`${error.response.data.detail}` || "An error occurred");
            } else if (error.message) {
                throw new Error(error.message);
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    }
     }

export const mediaupload = async(media:File[])=>{

    try {
        const formData=new FormData()

      media.forEach((file)=>{
        formData.append('files', file); 
      })
        
        await axios.post(`${process.env.REACT_APP_SERVER_ENV}/api/uploadmedia`,formData,{
         headers:{"Content-Type": "multipart/form-data",},withCredentials:true})
  }
  catch(error:unknown){
     if (axios.isAxiosError(error)) {
         if (error.response && error.response.data) {
             throw new Error(`${error.response.data.detail}` || "An error occurred");
         } else if (error.message) {
             throw new Error(error.message);
         }
     } else {
         // For any non-Axios errors
         throw new Error("An unknown error occurred");
     }
 }


}

export const getmedia = async()=>{

try{
    const response =  await axios.get(`${process.env.REACT_APP_SERVER_ENV}/api/getmedia`,{withCredentials:true}).then(res=>{return res.data})
    return response
}catch(error:any){
    if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: `${error.response.data.detail}`
                        });
        } else if (error?.message) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `${error.message}`
              });
        }
    } else {
        // For any non-Axios errors
        throw new Error("An unknown error occurred");
    }


}
}


export const getpublicmedia = async(id:number)=>{

    try{
        const response =  await axios.get(`${process.env.REACT_APP_SERVER_ENV}/api/profilemedia/${id}`).then(res=>{return res.data})
        return response
    }catch(error:any){
        if (axios.isAxiosError(error)) {
            if (error.response && error.response.data) {
              Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: `${error.response.data.detail}`
                            });
            } else if (error?.message) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${error.message}`
                  });
            }
        } else {
            // For any non-Axios errors
            throw new Error("An unknown error occurred");
        }
    
    
    }
    }

export const getpublicprofiledata = async(id:number)=>{
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_ENV}/api/profiledata/${id}`).then(res=>{return res.data})
            return response
        }
        catch(error:any){
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                  Swal.fire({
                                  icon: "error",
                                  title: "Oops...",
                                  text: `${error.response.data.detail}`
                                });
                } else if (error?.message) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `${error.message}`
                      });
                }
            } else {
                // For any non-Axios errors
                throw new Error("An unknown error occurred");
            }
        }
    }
    