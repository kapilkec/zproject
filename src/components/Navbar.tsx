//  import { useEffect } from "react"
import {Link} from "react-router-dom"
import { auth, storage } from "../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../Styles/Navbar.css";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { boolean } from "yup";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import ProfilePic from "./ProfilePic";

export default function Navbar () {
     
    const  [user] = useAuthState(auth);
    


    const signUserOut = async () =>{
        await signOut(auth);
    }

     
    
     
    return(
        
        <div className="topNav"> 
                <div className="topnav-left">
                <span className="Title">KEC-MEDIA</span>

                </div>

                <div className="topnav-right">  
                    <ProfilePic editProfile={false}/>
                    { user &&
                    <> <span className="userName">{(user?.displayName+"").split(" ")[0]}</span>
                        {/* <img src={imageUrl}   /> */}
                      </> } 
                    <div className="Elements">
                      <Link to ="/">Home</Link>  

                    {!user ? (  <Link to = "login">Login</Link>    ):
                             (   <Link to = "createPost">CreatePosts</Link> )
                    }
                    {user &&  <Link to ="profile">Myprofile</Link> }
                  
                    </div>
                    { user &&
                      
                        <div className="logOut" onClick={signUserOut}>Logout</div>
                     }
                     
                 </div> 
        </div>
       
    )
}

 