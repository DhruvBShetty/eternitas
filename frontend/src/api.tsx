import axios, { AxiosError } from "axios";
import { error } from "console";

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`${data.detail}`);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};

// export const registerUser = async (email: string, password: string) => {
//     try {
//         const response = await fetch('http://localhost:8000/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),
//         });

//         if (!response.ok) {
//             throw new Error(`Failed to register. Status: ${response.status}`);
//         }

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         if (error instanceof Error) {
//             if (error.message === 'Failed to fetch') {
//                 throw new Error('Network error. Please check your connection.');
//             }
//             throw new Error(error.message);
//         } else {
//             throw new Error('An unknown error occurred');
//         }
//     }
// };

export const registerUser = async (email: string, password: string) => {
    try {
        // Sending the POST request using axios
        const response = await axios.post('http://localhost:8000/api/register', {
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
    await axios.post("http://localhost:8000/api/forgotpassword",{"email":email});
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
        const response =await axios.post("http://localhost:8000/api/updatepassword",{"password":password},{withCredentials:true})
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
