import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import Followers from "./Followers";
import OthersProfile from "./OthersProfile";

interface Followers{
    FollowerId: String;
    FollowerName: String;
}
export default function Followss () {
    const [user] = useAuthState(auth);
     //for followers list ::start
     const [followers,updateFollowers] = useState<Followers[] | null>(null)
     const FollowRef = doc(db, "userDetails",user? user.uid : "unknownuser")
 
     const getFollowers = async () => {
         const docSnap = await getDoc(FollowRef);
         if(docSnap.exists()){
             const getFollowersList = docSnap.data() 
             
              updateFollowers( getFollowersList.Followers )
              const temp = followers?.filter((e) => {
                return e.FollowerId == user?.uid
              })
            //   console.log(getFollowersList.Followers)
         }
        else{
         console.log("no data")
        }
     }
 
     useEffect( () => {
         getFollowers()
     },[user])
     //followers list :: end
    return(
        <div>
            Following {followers?.length}
            <hr></hr>
            <div className="followingList">
                {followers?.map( (ob) => {
                    return(

                        <div>
                            <OthersProfile id={ob.FollowerId}/>
                            {ob.FollowerName}
                            <hr></hr>
                        </div>
                    )
                     
                })}
                
            </div>
        </div>
    )
}