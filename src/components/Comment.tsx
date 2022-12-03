import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
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
    id:string;
}

export const Comment = (props:  postIdforComment) => {
    const [commentsCount, updatecommentsCount]= useState <CommentBox[] | null>(null);
    const commentRef = collection(db, "comments");
    
    const commentsDoc = query(commentRef,where("postId","==",props.postId))

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
        const data = await getDocs(commentsDoc)
          updatecommentsCount(data.docs.map( (doc) => ( {commentPersonName:doc.data().commentPersonName , comment: doc.data().comment, id: doc.id})))
        
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
            postId:props.postId ,
            comment: newcomment,
            commentPersonName:user?.displayName ,
        }
       
        try{
            const newDoc =  await addDoc(commentRef,
                { ...obj }
             ).then( ()=> {
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