import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import Followers from "./Followers";
import OthersProfile from "./OthersProfile";
import "../Styles/Friends.css"

interface Friends{
    FriendId: String;
    FriendName: String;
}
export default function Friends () {
    const [user] = useAuthState(auth);
     //for followers list ::start
     const [friends,updateFriends] = useState<Friends[] | null>(null)
     const FriendsRef = doc(db, "userDetails",user? user.uid : "unknownuser")
 
     const getFriends = async () => {
         const docSnap = await getDoc(FriendsRef);
         if(docSnap.exists()){
             const getFriendsList = docSnap.data() 
             
              updateFriends( getFriendsList.Friends )
              const temp = friends?.filter((e) => {
                return e.FriendId == user?.uid
              })
               
         }
        else{
         console.log("no data")
        }
     }
 
     useEffect( () => {
         getFriends()
     },[user])
     //followers list :: end

     //display Profile :: start

     const displayProfile = () => {

     }

     //display profile :: end

    return(
        <div>

            Followers {friends?.length}
            <hr></hr>
            <div className="friendsList">
                {friends?.map( (ob) => {
                    return(
                       
                        <div className="friend">
                           <div className="Profile1">  <OthersProfile id={ob.FriendId}/>
                        </div>
                            {ob.FriendName}
                        </div> 
                    )
                    
                })}<hr></hr>
                
            </div>
        </div>
    )
}