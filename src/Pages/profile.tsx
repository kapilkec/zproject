import { useState } from "react"
import ProfilePic from "../components/ProfilePic"
import "../Styles/profile.css"
import MyPost from "./myPost"

export default function Profile(){
    const[currentElement,changeCurrent] = useState(0);
    
    
    return(
        <div className="Profile">
            <div className="profilePic">
                <ProfilePic editProfile={true} />

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
                 {/* { currentElement == 1 &&
                    <MyPost/>
                 }
                 { currentElement == 2 &&
                    <MyPost/>
                 } */}

             </div>
        </div>
    )
}