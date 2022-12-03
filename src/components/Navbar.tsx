//  import { useEffect } from "react"
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
                <span className="Title">KEC-MEDIA</span>

                </div>

                <div className="topnav-right">  
                    <div className="Elements">
                      <Link to ="/">Home</Link>  
                    {!user ? (  <Link to = "login">Login</Link>  ):
                             (  <Link to = "createPost">CreatePosts</Link>  )
                    }
                    
                    { user &&
                     <span className="userName">{user?.displayName    }</span>  } 
                    </div>
                    { user &&
                      
                        <div className="logOut" onClick={signUserOut}>Logout</div>
                     }
                </div> 
        </div>
       
    )
}