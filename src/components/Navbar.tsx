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
                 KecMedia

                </div>

                <div className="topnav-right">  
                    <div className="ProfileComponent">
                        <ProfilePic editProfile={false}/>
                        { user &&
                        <> <span className="userName">{(user?.displayName+"").split(" ")[0]}</span>
                            <span className="UserId">@{user?.displayName}</span>
                            </> } 
                        <div className="UserDetails">
                            <div className="Posts"><span>20</span><br></br><span className="name">Posts</span></div>
                            <div className="Following"><span>20</span><br></br><span className="name">Following</span></div>
                            <div className="Followers"><span>20</span><br></br><span className="name">Followers</span></div>

                        </div>
                    </div>
                    <div className="Elements">
                      <Link to ="/"><i className="fa-solid fa-house"></i>&nbsp;&nbsp;&nbsp;&nbsp;Feed</Link>  

                    {!user ? (  <Link to = "login">Login</Link>    ):
                             (   <Link to = "createPost"><i className="CreatePostIcon fa-solid fa-square-plus"></i>&nbsp;&nbsp;&nbsp;&nbsp;CreatePosts</Link> )
                    }
                    {user &&  <Link to ="profile"><i className="fa-solid fa-user"></i>&nbsp;&nbsp;&nbsp;&nbsp;Account</Link> }
                  
                    { user &&
                      
                      <div className="logOut" onClick={signUserOut}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;&nbsp;&nbsp;Logout</div>
                    }
                    </div>
                   
                     
                 </div> 
        </div>
       
    )
}

 