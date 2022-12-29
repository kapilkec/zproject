import { auth, storage } from "../config/firebase"
import { useEffect, useState } from "react"; 
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import "../Styles/OthersProfile.css"
 
 
interface Props{
     id:String;
}

export default function OthersProfile(props:Props ) {
    const [imageUrl,setImageUrl] = useState(String);
    const [ImageFound, SetImageFound] = useState(true);

    const getUrl =async ()=> {
        if(props.id.length < 2){
           return;
        }
       const starsRef = ref(storage, 'UserProfile/'+props.id);
       getDownloadURL(starsRef)
           .then((url) => {
                   setImageUrl(url)
                   SetImageFound(true)
            
           })
           .catch( (er) => {
               
               console.log("error in fetching profile img"+er)
           })
   }
   useEffect(()=>{
       getUrl();
   },[props.id] )

   return(
                         
        <img className="OthersProfilePic" src= { imageUrl ? imageUrl :  require('../Images/profile.jpg')} alt="user"  /> 
     

   )

}
     