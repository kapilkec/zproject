 import { Post} from "../Pages/Main"
import "../Styles/Post.css"
import {  auth, db } from "../config/firebase"
import { addDoc, collection, getDocs, query,doc, where, deleteDoc } from "firebase/firestore"
 import { useAuthState } from "react-firebase-hooks/auth"
import { useEffect, useState } from "react"

interface Props {
    post : Post;
}
interface Like{
    userId: String;
    likeId: String;
}

export default function DisplayPost(props: any) {
    
    const [user] = useAuthState(auth);
    const {title, description,username,id}= props;
    const likedRef = collection(db, "likes")
    const likesDoc = query(likedRef,where("postId","==",id))

    const [likesCount, updateLikes ]= useState<Like[] | null>(null);

    const getLikes = async ()=> {
        const data = await getDocs(likesDoc)
          updateLikes(data.docs.map( (doc) => ( {userId:doc.data().userId , likeId: doc.id})))
        
    }

    const hasUserLiked = likesCount?.find((like)=>(
        like.userId === user?.uid
    ))

    useEffect( ()=> {
        getLikes()
    },[])
    console.log(props.id);

    const addLike = async ()=>{
        try{
           const newDoc =  await addDoc(likedRef,{
                userId: user?.uid,
                postId:id ,
            })
            if(user){
            updateLikes( likesCount ? [...likesCount, {userId:user?.uid, likeId:newDoc.id}] : [{userId:user?.uid, likeId:newDoc.id}] )}
            }
        catch(err){
            console.log("error in adding likes"+err);
        }
    }

     const removeLike =async ( ) => {
            try{
                const likeToDeleteQuery =  query(likedRef,
                    where("postId","==", id), where("userId","==",user?.uid))
                const likeToDeletedata = await getDocs( likeToDeleteQuery );
                const likeId = likeToDeletedata.docs[0].id
                const likeToDelete = doc(db, "likes", likeId)

                await deleteDoc(likeToDelete);
                 if(user){
                    if(likesCount)
                          updateLikes(  likesCount.filter((like) => like.likeId !== likeId) )
            }


            }
            catch(err){
                console.log("error in removing likes"+err);
            }
     }

    return(
        <div className="Post">
            <div className="UserName">{username}</div>
            <div className="title">{ title} </div>
            <div className="description"> { description}</div>
            <div className="likeButton"><button onClick={hasUserLiked?  removeLike:addLike}>{hasUserLiked? <>&#128078;</> : <>&#128077;</>} </button></div>
            {likesCount  != null && 
            <div className="likes">likes:{ likesCount.length}</div>
            }
            <hr/>
        </div>
    )
}