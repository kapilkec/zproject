//  import { useEffect } from "react"
import {Link, NavLink} from "react-router-dom"
import { auth, storage } from "../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../Styles/Navbar.css";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { boolean } from "yup";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import ProfilePic from "./ProfilePic";
import { render } from "@testing-library/react";

export default function Navbar () {
     
    const  [user] = useAuthState(auth);
    

    const [userid, setuserId]  = useState<String | null>()
    const signUserOut = async () =>{
        await signOut(auth);
    }

    useEffect( ()=>{
        console.log("ar"+user?.uid);
        setuserId(user?.uid)
    },[user]);
    
     
    return(
        
        <div className="topNav"> 
                <div className="topnav-left">
                 KecMedia

                </div>

                <div className="topnav-right">  
                    <div className="ProfileComponent">
                        <ProfilePic editProfile={false} id = {userid+""}/>
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
                      <NavLink to ="/" ><i className="fa-solid fa-house"></i>&nbsp;&nbsp;&nbsp;&nbsp;Feed</NavLink>  

                    {!user ? (  <NavLink to = "login">Login</NavLink>    ):
                             (   <NavLink to = "createPost"><i className="CreatePostIcon fa-solid fa-square-plus"></i>&nbsp;&nbsp;&nbsp;&nbsp;CreatePosts</NavLink> )
                    }
                    {user &&  <NavLink to ="profile"   className={({ isActive }) => (isActive ? 'active' : 'inactive')} ><i className="fa-solid fa-user "></i>&nbsp;&nbsp;&nbsp;&nbsp;Account</NavLink> }
                  
                    { user &&
                      
                      <div className="logOut" onClick={signUserOut}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;&nbsp;&nbsp;Logout</div>
                    }
                    </div>
                   
                     
                 </div> 
        </div>
       
    )
}

 