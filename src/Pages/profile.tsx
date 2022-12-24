import { useEffect, useState } from "react"
import Friends from "../components/Friends";
import  Followss from "../components/Followss";
import ProfilePic from "../components/ProfilePic"
import "../Styles/profile.css"
import MyPost from "./myPost"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

export default function Profile(){
    const[currentElement,changeCurrent] = useState(0);
    const [user] = useAuthState(auth);
     
    return(
        <div className="Profile">
            <div className="profilePic">
                <ProfilePic editProfile={true}  id = {user?.uid+""}/>

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