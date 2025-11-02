import axios from "axios";
import { createContext, useContext, useState } from "react";

const CloudinaryContext = createContext();

export const useCloudinary = ()=>useContext(CloudinaryContext);

export default function CloudinaryContextProvider({children}){

    const [cloudinaryUrl,setCloudinaryUrl] = useState("");
    const cloudinaryUploadUrl = process.env.REACT_APP_CLOUNDINARY_URL;

    function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "cloudinary_preset");
        console.log("formdata",([...formData.entries()]));

        async function cloudinaryUpload() {
            try {
            const response = await fetch(cloudinaryUploadUrl, {
                method: "POST",
                body: formData
            });
            console.log(response,"response");
            if(response){
            //    setCloudinaryUrl(response.url);
            }
            const data = await response.json();

            console.log(data);

            if(data){
               setCloudinaryUrl(data.url);
            }
            return data;
        }
        catch(error){
            console.log(error);
        }
        }
        return cloudinaryUpload();
        
    }

   return <CloudinaryContext.Provider value={{uploadFile,cloudinaryUrl,setCloudinaryUrl}}>
        {children}
    </CloudinaryContext.Provider>

}