import { createContext, useEffect, useState } from "react"
import Friends from "../components/Friends";
import  Followss from "../components/Followss";
import ProfilePic from "../components/ProfilePic"
import "../Styles/profile.css"
import MyPost from "./myPost"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db } from "../config/firebase";
import { Context2 } from "../App";
import { useContext } from "react"
import { getDocs, collection, doc, getDoc } from "firebase/firestore"


interface Followers{
    FollowerId: String;
    FollowerName: String;
}
export const ContextProfile = createContext<Followers[] | null>(null);
export const updateFollowersInProfile = createContext<Function | null>(null);

export default function Profile(){
    const[currentElement,changeCurrent] = useState(0);
    const [user] = useAuthState(auth);
    const userInfoFromContext = useContext(Context2);
    const postRef = collection(db, "posts")

     //for followers list ::start
     const [followers,updateFollowers] = useState<Followers[] | null>(null)
     const FollowRef = doc(db, "userDetails",user? user.uid : "unknownuser")
 
     const getFollowers = async () => {
        console.log("get followers calles");
         const docSnap = await getDoc(FollowRef);
         if(docSnap.exists()){
             const getFollowersList = docSnap.data() 
             
              updateFollowers( getFollowersList.Followers )
              const temp = followers?.filter((e) => {
                return e.FollowerId == user?.uid
              })
              const data = await getDocs(postRef);
         
       
              const postcount =  data.docs.filter( (doc) => {
              return doc.data().userId == user?.uid
              })
  
               const ob = {
                  followers:getFollowersList?.Friends? getFollowersList.Friends.length : 0,
                  following:getFollowersList?.Followers? getFollowersList.Followers.length : 0,
                  posts:postcount? postcount.length:0,
               }
               userInfoFromContext?.updateUserInfo(ob)
               console.log(ob);
              
         }
        else{
         console.log("no data")
        }
     }
 
     
 
     useEffect( () => {
         getFollowers()
        
     },[user])
 
     //followers list :: end

 
    //for highlight in border components
    const setActiveLists = ["posts-click","followers-click","following-click"]
    const changeActive = (i:string) => {
        console.log("j")
        let temp = document.getElementById(i)
        temp?.classList.add("borderBottom")
        
        setActiveLists.map( (e) => {
            if(e == i)return;
            let tt = document.getElementById(e);
            tt?.classList.remove("borderBottom")
        })
    }
     
    return(

        <div className="Profile">
           <ContextProfile.Provider value = { followers }>
            <updateFollowersInProfile.Provider  value={getFollowers}>

           
            <div className="topBar">
                  
                    <div className="profilePic">
                        <ProfilePic editProfile={true}  id = {user?.uid+""}/>
                        <span className="UserName">{(user?.displayName+"").split(" ")[0]}</span>
                        <span className="UserId">@{user?.displayName}</span>

                    </div>
                    <div className="profileDetails">
                                <div className="Posts"><span>&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo ? userInfoFromContext.Userinfo.posts+"": 0}</span><br></br><span className="name">Posts</span></div>
                                <div className="Following"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo? userInfoFromContext.Userinfo.following+"":0}</span><br></br><span className="name">Following</span></div>
                                <div className="Followers"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{userInfoFromContext && userInfoFromContext.Userinfo? userInfoFromContext.Userinfo.followers+"":0}</span><br></br><span className="name">Followers</span></div>
    
                    </div>
                 
            </div>
            <div className="BottomBar">
                <div className="components">
                    <div id="posts-click" className="borderBottom" onClick={()=>{changeCurrent(0);changeActive("posts-click")}}>Posts</div>
                    <div  id="followers-click" onClick={()=>{changeCurrent(1);changeActive("followers-click")}}>Followers</div>
                    <div  id="following-click" onClick={()=>{changeCurrent(2);changeActive("following-click")}}>Following</div>
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
             </updateFollowersInProfile.Provider>
             </ContextProfile.Provider>
        </div>
    )
}