import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Context } from "../Pages/Main";
import { Context2 } from "../App"
import {ContextProfile,updateFollowersInProfile} from "../Pages/profile"

import { useContext } from "react"
import "../Styles/Followers.css"

interface Props{
    FollowId: String;
    userName:String;
    globalFollowersChange: Function;
    
}

interface Followers{
    FollowerId: String;
    FollowerName: String;
}

export default function Followers(props:any){
    

   
    const [user] = useAuthState(auth);
    const [followers,updateFollowers] = useState<Followers[] | null>(null)
    const [ Following, changeFollow] = useState(false);
    const FollowRef = doc(db, "userDetails",user? user.uid : "unknownuser")
    const FriendsRef = doc(db, "userDetails", props.FollowId+"")
    //context for profile details
    const userDetailFromContext = useContext(Context2)

    const mainContext = useContext(Context)
    const ProfileContext = useContext(ContextProfile)
    const profilePageFollowersCall = useContext(updateFollowersInProfile);
  
    
    useEffect( () => {
        if(mainContext != null)
             updateFollowers(mainContext)
        else if (ProfileContext != null){
        updateFollowers(ProfileContext)
        }
    },[mainContext,ProfileContext])

    const updateFollower = async (docSnap:any)=> {
        const obj = {
            FollowerId: props.FollowId,
            FollowerName: props.userName
        }
        //check follower already exist;
        const finalFollowers = followers?.filter( (ob:any) => {
            return ob.FollowerId !=  obj.FollowerId
        })
       
        const newFollowers = finalFollowers ? [...finalFollowers, obj]  : [obj]

        const flw = userDetailFromContext?.Userinfo?.followers? userDetailFromContext.Userinfo.followers : 0 ;
        const post = userDetailFromContext?.Userinfo?.posts? userDetailFromContext.Userinfo.posts : 0;
        const ob = {
            following:newFollowers.length,
            followers:flw,
            posts:post,
        }
        userDetailFromContext?.updateUserInfo(ob)

        updateFollowers(newFollowers )
      
        await updateDoc(FollowRef, {
            "Followers":newFollowers ,
             

             
        }).then( () => {
            console.log("followers added")
            console.log(newFollowers)
            addFriend()
            props.globalFollowersChange && props.globalFollowersChange(newFollowers)
           profilePageFollowersCall && profilePageFollowersCall();
            
        }).catch( (err) => {
            console.log("error in adding followers"+err)
        })
    }

    const addFollowers = async ()=> {
        if(!user){
            alert("login to continue");
            return;
        }
        let flg = 0;
        followers?.map((ob) => {
            if(ob.FollowerId == props.FollowerId){
                
                flg = 1;return;
            }
        })
        if(flg == 1) return;
       
        changeFollow(true)
        const postRef = doc(db,"userDetails",user? user.uid: "unknown")
        const docSnap = await getDoc(postRef);
        if(docSnap.exists()){
            updateFollower(docSnap);
        }
        else{
            
            const temp = [
                 {FollowerId: props.FollowId,
                FollowerName: props.userName} 
            ]
            await setDoc(doc(db, "userDetails", user? user.uid: "unknown"), {
                "Followers":temp,
               
                 
              }).then( ()=> {
                addFriend()
                console.log("new updation in followers")
                profilePageFollowersCall && profilePageFollowersCall();

                props.globalFollowersChange && props.globalFollowersChange(temp)
              }).catch( (err) => {
                console.log("errir un new updation"+err)
              })
              
        }
    }
    //friends add :: start; any
    const updateFriends = async (lst : any) => {
        
        const obj =  {
            FriendId: user?.uid,
            FriendName: user?.displayName,
        } 
        
        //checking whether the friend already exist
        
        const  finalLst = lst?.filter( (ob:any) => {
            return ob.FriendId !== obj.FriendId
        })
         
        await updateDoc(FriendsRef, {
            "Friends": finalLst? [...finalLst,obj] : [obj]
             
        }).then( () => {
            console.log("friends added")
            profilePageFollowersCall && profilePageFollowersCall();
           
        }).catch( (err) => {
            console.log("error in adding friends"+err)
        })
    }
    const addFriend =async () => {
        console.log("add Friend called");
        const postRef = doc(db,"userDetails",props.FollowId+"")
        const docSnap = await getDoc(postRef);

        if(docSnap.exists()){
             
              updateFriends(docSnap.data().Friends)
        }
        else{
            
            const temp = [
                 {FriendId: user?.uid,
                FriendName: user?.displayName} 
            ]
            await setDoc(doc(db, "userDetails", props.FollowId+""), {
                "Friends":temp
              }).then( ()=> {
                console.log("new updation in friends")
                
              
              }).catch( (err) => {
                console.log("errir un new updation in friends"+err)
              })
              
        }
    }
    //friends add :: end


    //check following :: start
    const checkFollowing = () => {
            let t = false;
        if(followers?.find( (e) => e.FollowerId ===  props.FollowId)){
            t = true
           
        }
        changeFollow(t)
 
         
    }
    useEffect( ( ) => {
        checkFollowing()
         
    },[followers])
   

    const unfollow =async () => {
       
        const res = followers?.filter( (ob) => {
           return  ob.FollowerId !== props.FollowId
        })
        const postRef = doc(db,"userDetails",props.FollowId+"")
        const docSnap = await getDoc(postRef);
        if(docSnap.exists() && docSnap.data().Friends && docSnap.data().Friends.length > 0){
           const t =  docSnap.data().Friends.filter( (o:any) => {
                return o.FriendId !== user?.uid
           })

           await updateDoc(FriendsRef, {
            "Friends":t
             
        }).then( () => {
            console.log("friends removed")
            profilePageFollowersCall && profilePageFollowersCall();
           
        }).catch( (err) => {
            console.log("error in removing friends"+err)
        })

      }

        updateFollowers(res as Followers[])
        if(props.updateFollowList ){

            props.updateFollowList(res);
        }
        const flw = userDetailFromContext?.Userinfo.followers;
        const post = userDetailFromContext?.Userinfo.posts;
        const ob = {
            following: res && res.length,
            followers: flw,
            posts: post,
        }
        userDetailFromContext?.updateUserInfo(ob)
       
        changeFollow(false)
       
        await updateDoc(FollowRef, {
            "Followers":res
             
        }).then( () => {
            console.log("un followed")
            console.log(res);
            props.globalFollowersChange && props.globalFollowersChange(res)
            profilePageFollowersCall && profilePageFollowersCall();

        }).catch( (err) => {
            console.log("error in  unfollowers"+err)
        })



        
    }
    return(
        <div>
             {!Following  ?
                 <button className="FollowButton" onClick={addFollowers}>Follow </button>: <button className="FollowButton" onClick={unfollow}>unfollow </button>
             } 

        </div>
       
       
    )
}

 
