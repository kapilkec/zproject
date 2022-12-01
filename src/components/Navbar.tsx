 import { useEffect } from "react"
import {Link} from "react-router-dom"
import { auth } from "../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../Styles/Navbar.css";
import { signOut } from "firebase/auth";

export default function Navbar () {
     
    const  [user] = useAuthState(auth);
    const signUserOut = async () =>{
        await signOut(auth);
    }
    return(
        
        <div className="topNav"> 
                <div className="topnav-left">
                <span className="Title">InstaBOok</span>

                </div>

                <div className="topnav-right">  
                    <div className="Elements">
                    <a> <Link to ="/">Home</Link> </a>
                    {!user ? (<a> <Link to = "login">Login</Link> </a>):
                             (<a> <Link to = "createPost">CreatePosts</Link> </a>)
                    }
                    
                    { user &&
                    <a>{user?.displayName    }</a>  } 
                    </div>
                    { user &&
                    <div className="Profile">
                        <button onClick={signUserOut}>Logout</button>
                    </div>}
                </div> 
        </div>
       
    )
}