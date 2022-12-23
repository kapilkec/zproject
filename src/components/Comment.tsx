import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { boolean } from "yup";
import { auth, db } from "../config/firebase";
export interface postIdforComment{
    postId:String
}
interface CommentBox {
    commentPersonName:String;
    comment:String;
    userId:string;
}

export const Comment = (props:  postIdforComment) => {
    const [commentsCount, updatecommentsCount]= useState <CommentBox[] | null>(null);
    const commentRef = doc(db, "posts", props.postId+"")
    
    

    const [newcomment, setComment] = useState(String);
    const [user] = useAuthState(auth);

    //show comments
    const [commentFlag,setCommentFlage] =  useState( false  )
    const setCommentFlage1 = ()=> {
        setCommentFlage(!commentFlag)
        console.log("comment flasg changed")
    }

    const updateComment = (e: any)=> {
        
        setComment(e.target.value);
        console.log(e.target.value)
    }
    const getComments = async ()=> {
        const docSnap = await getDoc(commentRef);
        
        const getCommentsList = docSnap.data() 
        const commentList = (getCommentsList && getCommentsList.comments)
           
          updatecommentsCount( commentList)
        
    }

    //get comments
    useEffect( ()=> {
        getComments()
         
    },[])
  
    const uploadComment = async (e: any)=>{
        console.log("updating comment");
        e.preventDefault();
        const obj = {
            userId: user?.uid,
             
            comment: newcomment,
            commentPersonName:user?.displayName ,
        }
       
        try{
            const newComments =commentsCount ? [...commentsCount,obj] : [obj  ]
            await updateDoc(commentRef, {
                "comments":  newComments
                 
            })
           
              .then( ()=> {
                setComment("");
               
                 getComments();
                
             })
            }
         catch(err){
             console.log("error in adding likes"+err);
         }
    }


    return(
        <div>
        <div className="comments" ><i  onClick={setCommentFlage1}  className="fa-regular fa-message fa-2x"></i></div>
        {commentsCount  != null && 
            <div className="comments">comments:{ commentsCount.length}</div>
            }

            <form onSubmit={uploadComment}>
            <input  onChange={updateComment}  value={newcomment} placeholder="write a comment..." />
            <button type="submit">Post</button>
           
            </form>
              
            {commentFlag  && commentsCount && commentsCount.map( (comment) => {
                return (
                   <div  >
                   
                    @{comment.commentPersonName}
                     
                    <div>{ comment.comment}</div>
                    
                    </div>
                )
            })}, 
            
        </div>
    )
}