import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { Context } from "../Pages/Main";
import { useContext } from "react"

interface Props{
    FollowId: String;
    userName:String;
    globalFollowersChange: Function;
}

interface Followers{
    FollowerId: String;
    FollowerName: String;
}

export default function Followers(props:Props){
    
    const [user] = useAuthState(auth);
    const [followers,updateFollowers] = useState<Followers[] | null>(null)
    const [ Following, changeFollow] = useState(false);
    const FollowRef = doc(db, "userDetails",user? user.uid : "unknownuser")
    const FriendsRef = doc(db, "userDetails", props.FollowId+"")
      
    const t = useContext(Context)
    useEffect( () => {
        updateFollowers(t)
        console.log(t)
    },[])
    
    useEffect( () => {
        updateFollowers(t)
    },[t])

    const updateFollower = async ()=> {
        const obj = {
            FollowerId: props.FollowId,
            FollowerName: props.userName
        }
        console.log("``````")
        console.log(followers)
        const newFollowers = followers ? [...followers, obj]  : [obj]
        updateFollowers(newFollowers )
        props.globalFollowersChange(newFollowers)
        await updateDoc(FollowRef, {
            "Followers":newFollowers 
             
        }).then( () => {
            console.log("followers added")
            
        }).catch( (err) => {
            console.log("error in adding followers"+err)
        })
    }

    const addFollowers = async ()=> {
        addFriend()
        changeFollow(true)
        const postRef = doc(db,"userDetails",user? user.uid: "unknown")
        const docSnap = await getDoc(postRef);
        if(docSnap.exists()){
            updateFollower();
        }
        else{
            
            const temp = [
                 {FollowerId: props.FollowId,
                FollowerName: props.userName} 
            ]
            await setDoc(doc(db, "userDetails", user? user.uid: "unknown"), {
                "Followers":temp
              }).then( ()=> {
                console.log("new updation")
                props.globalFollowersChange(temp)
              }).catch( (err) => {
                console.log("errir un new updation"+err)
              })
              
        }
    }
    //friends add :: start; any
    const updateFriends =async (lst : any) => {
        
        const obj =  {
            FriendId: user?.uid,
            FriendName: user?.displayName?.split(" ")[0]
        } 
        console.log("``````")
        console.log(lst) 
        
         
        await updateDoc(FriendsRef, {
            "Friends": lst? [...lst,obj] : [obj]
             
        }).then( () => {
            console.log("friends added")
            
        }).catch( (err) => {
            console.log("error in adding friends"+err)
        })
    }
    const addFriend =async () => {
        const postRef = doc(db,"userDetails",props.FollowId+"")
        const docSnap = await getDoc(postRef);
        if(docSnap.exists()){
            
             updateFriends(docSnap.data().Friends)
        }
        else{
            
            const temp = [
                 {FriendId: user?.uid,
                FriendName: user?.displayName?.split(" ")[0]} 
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
        
        console.log(t)
         
    }
    useEffect( ( ) => {
        checkFollowing()
         
    },[followers])
   

    const unfollow =async () => {
        
        const res = followers?.filter( (ob) => {
           return  ob.FollowerId !== props.FollowId
        })
        console.log(res)
        updateFollowers(res as any)
        changeFollow(false)
        props.globalFollowersChange(res)
        await updateDoc(FollowRef, {
            "Followers":res
             
        }).then( () => {
            console.log("followers added")
        }).catch( (err) => {
            console.log("error in adding followers"+err)
        })



        
    }
    return(
        <div>
             {!Following  ?
                 <button onClick={addFollowers}>Follow </button>: <button onClick={unfollow}>unFollow </button>
             } 

        </div>
       
       
    )
}

 
