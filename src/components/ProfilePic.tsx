import "../Styles/ProfilePic.css"
 
import { auth, storage } from "../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
 
import { useEffect, useState } from "react";
 
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { url } from "inspector";
 
 

interface Props{
    editProfile:Boolean;
    id:String;
}

export default function ProfilePic(props:Props ) {
     
  
    const [showUpdateProfile, setUpdateProfile] =  useState(false)
    const [imageUrl,setImageUrl] = useState(String);
    const [ImageFound, SetImageFound] = useState(true);
    const {handleSubmit} = useForm()
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [profilePicName, setProfilePicName]  = useState<String | null>(null);
    const setImage = (e: any)=>{
        {e && setProfilePic(e.target.files[0])}
        setProfilePicName(e.target.files[0].name);
    }


   

    const uploadProfile = ()=> {
        setUpdateProfile(true);
    }

    const setNewProfile = async () => {
    
       const imagref = ref(storage, "UserProfile/"+props.id);
    if(profilePic){
        await  uploadBytes(imagref,profilePic).then(
            ()=>{

                console.log("image uploaded");
            }
        ).catch( (er) => {
            console.log("error in profile upload"+er)
        })
    }   setUpdateProfile(false)
    }

    const getUrl =async ()=> {
         if(props.id.length < 2){
            return;
         }
        const starsRef = ref(storage, 'UserProfile/'+props.id);
        getDownloadURL(starsRef)
            .then((url) => {
                    setImageUrl(url)
                    SetImageFound(true)
                    console.log("image  url fetched" )
            })
            .catch( (er) => {
                
                console.log("error in fetching profile img"+er)
            })
    }
    useEffect(()=>{
        getUrl();
    },[props.id] )

    
    return(
    
        <div className=""> 
                     
                     <img className="ProfilePic" src= { imageUrl ? imageUrl :  require('../Images/profile.jpg')} alt="user"  />
                     
                     {props.editProfile &&
                            <div className="editProfile">
                            { !showUpdateProfile && 
                                <div><button className="uploadProfile" onClick={uploadProfile}>Edit profile</button></div>
                            
                            }
                            {showUpdateProfile &&
                                <form onSubmit={handleSubmit(setNewProfile)}>
                                        <label htmlFor="inputTag">
                                         <div  className="uploadProfile fileName">Upload profile</div>
                                          <input type="file" id="inputTag" onChange={setImage} style={{display:"none"}} accept="image/png, image/jpg, image/gif, image/jpeg" />
                                         <span id="imageName">{profilePicName && profilePicName}</span>
                                         <button>Upload</button>
                                        </label>
                                        
                                     
                                     
                                </form>
                                
                            }

                        
                            </div>
                        }

                </div> 
        
    )

}

 

 