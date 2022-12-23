 
import "../Styles/Post.css"
import {  auth, db } from "../config/firebase"
import {   collection, getDocs, query,doc, where, deleteDoc, setDoc, addDoc, updateDoc, getDoc } from "firebase/firestore"
 import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"
import  { storage } from "../config/firebase"
import { ref,   listAll, getDownloadURL} from "firebase/storage"
import {Comment } from "./Comment"
import { DeletePost } from "./DeltePost"
import Followers from "./Followers"


 
interface Like{
    userId: String;
    
}

export default function DisplayPost(props: any) {
    
    const [user] = useAuthState(auth);
    const {title, description,username,id,userId ,getImageId, updateHomePage,likes}= props;
    
    
    const reff = doc(db, "posts", id)
    const [imageUrl,setImageUrl] = useState(String);

    const [likesCount, updateLikes ]= useState<Like[] | null>(null);

    const getLikes = async ()=> {
        const docSnap = await getDoc(reff);
        
        const getlikesList = docSnap.data() 
        const likeList = (getlikesList && getlikesList.likes)
          updateLikes(likeList)
        
    }

    const hasUserLiked = likesCount?.find((like)=>(
        like.userId === user?.uid
    ))
    // console.log("has user likes"+hasUserLiked)

    useEffect( ()=> {
        getLikes()
         
    },[])
    
     

    const addLike = async ()=>{
         


        try{
        //    const newDoc =  await addDoc(likedRef,{
        //         userId: user?.uid,
        //         postId:id ,
        //     })


        //testing
       
        const newLike =likesCount ? [...likesCount,{userId:user?.uid }] : [ {userId:user?.uid} ]
        await updateDoc(reff, {
            "likes":  newLike
             
        })
        
          .then(function() {
            console.log("like updated");
          });



              

            if(user){
            updateLikes( newLike as Like[])}
            }
        catch(err){
            console.log("error in adding likes"+err);
        }
    }

     const removeLike =async ( ) => {
            try{
                
                const newLike =likesCount &&  likesCount.filter( (ob) => {
                    return ob.userId != user?.uid
                })
               
                await updateDoc(reff, {
                    "likes":  newLike
                     
                })

                 if(user){
                    if(likesCount)
                          updateLikes( newLike as Like[] )
            }


            }
            catch(err){
                console.log("error in removing likes"+err);
            }
     }

     const getUrl =async ()=> {
        // console.log("getImageId");
        const refer = "postImages/"+getImageId+"/";
         
        const getImageref = ref(storage, refer)
           await listAll(getImageref).then(
            (response) => {
                // console.log(response);
                response.items.forEach(async (item) => {
                     
                    
                   await  getDownloadURL(item).then((url) => {
                            
                             setImageUrl(url);
                             updateHomePage();
                             
                    })
                })
            }
        )
    }
    useEffect(()=>{
        getUrl();
    },[] )
    
    console.log();

    return(
        <div   className="Post">

            <div className="UserName">
                @{username}
                {userId !== user?.uid &&  
                    <Followers FollowId={ userId } userName={ username }  globalFollowersChange = {props. globalFollowersChange }/>
                }
                
                
            </div>
            <div className="title">{ title} </div>
            <img src={imageUrl}   style={{width:"400px"}} />

            <div className="description"> { description}</div>

            <div className="likeButton"><button onClick={hasUserLiked?  removeLike:addLike}>{hasUserLiked? <>&#128078;</> : <>&#128077;</>} </button></div>
            {likesCount  != null && 
            <div className="likes">likes:{ likesCount.length}</div>
            }
            
            <Comment postId={id} />
            {userId == user?.uid && <DeletePost  PostId={id} updateHomePage = {updateHomePage} getImageId = {getImageId} />}
            
             <hr/>
        </div>
    )
}