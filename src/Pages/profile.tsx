import { useEffect, useState } from "react"
import Friends from "../components/Friends";
import  Followss from "../components/Followss";
import ProfilePic from "../components/ProfilePic"
import "../Styles/profile.css"
import MyPost from "./myPost"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { Context2 } from "../App";
import { useContext } from "react"

export default function Profile(){
    const[currentElement,changeCurrent] = useState(0);
    const [user] = useAuthState(auth);
    const userInfoFromContext = useContext(Context2);
     
    return(
        <div className="Profile">
          
            <div className="UserNam">@{user?.displayName}</div>
            <div className="UserId"></div>

           
            <div className="topBar">
                  
                    <div className="profilePic">
                        <ProfilePic editProfile={true}  id = {user?.uid+""}/>
                    </div>
                    <div className="profileDetails">
                                <div className="Posts"><span>&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo ? userInfoFromContext.Userinfo.posts+"": 0}</span><br></br><span className="name">Posts</span></div>
                                <div className="Following"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo? userInfoFromContext.Userinfo.following+"":0}</span><br></br><span className="name">Following</span></div>
                                <div className="Followers"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo? userInfoFromContext.Userinfo.followers+"":0}</span><br></br><span className="name">Followers</span></div>
    
                    </div>
                 
            </div>
            
            <div className="components">
                <div onClick={()=>{changeCurrent(0)}}>Posts</div>
                <div onClick={()=>{changeCurrent(1)}}>Followers</div>
                <div onClick={()=>{changeCurrent(2)}}>Following</div>
            </div>
            <div className="posts"> 
                 { currentElement == 0 &&
                    <MyPost/>
                 }
                 { currentElement == 1 &&
                    <Friends/>
                 }
                 { currentElement == 2 &&
                    <Followss/>
                 }

             </div>
        </div>
    )
}