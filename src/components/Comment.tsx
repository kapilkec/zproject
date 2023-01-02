import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth";
import { boolean } from "yup";
import "../Styles/Comment.css"
import { auth, db } from "../config/firebase";
import OthersProfile from "./OthersProfile";
export interface postIdforComment{
    postId:String;
    showWriteComment:Boolean;
    CurrentStateREnder:Boolean;
    changeRender:Function;
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
        
    }
    const getComments = async ()=> {
        const docSnap = await getDoc(commentRef) 
        
        const getCommentsList = docSnap.data() 
        const commentList = (getCommentsList && getCommentsList.comments)
       
        updatecommentsCount( commentList)
        
        
    }
    
    //get comments
    useEffect( ()=> {
        getComments()
         
    },[props.postId])

    //rerendering
    useEffect( () => {
        getComments()
    },[props.CurrentStateREnder])
    
  
    const uploadComment = async (e: any)=>{
        console.log("updating comment");
        e.preventDefault();
        if(newcomment.length == 0) return
        const obj = {
            userId: user?.uid+"",             
            comment: newcomment,
            commentPersonName:user?.displayName+"",
        }
       
        try{
            const newComments =commentsCount ? [...commentsCount,obj] : [obj  ]
            updatecommentsCount(newComments)
            console.log(commentsCount)
            await updateDoc(commentRef, {
                "comments":  newComments
                 
            })
           
              .then( ()=> {
                setComment(""); 
                props.changeRender();
             })
            }
         catch(err){
             console.log("error in adding comments"+err);
         }
    }
    //upload comment end


    return(
        <div>
        
        { props.showWriteComment != true && <>
            <div className="commentComponent">
            <div className="commentIcon" ><i className="fa-regular fa-comment likeIcon" /></div>
            {commentsCount  != null && 
                <div className="commentsCount">&nbsp;{commentsCount.length}&nbsp;comment{commentsCount.length > 1 && <>s</>}</div>
                }
            </div>
                </>
        }
            {props.showWriteComment == true && 
                <>
                    <div className="Comments">
                        { commentsCount && commentsCount.length > 0 && <div className="Showtext" onClick={setCommentFlage1} >{commentFlag ?<>Hide comments</>:<>view all {commentsCount.length} comments</>}</div>}
                        {commentFlag  && commentsCount && commentsCount.map( (comment) => {
                        return (
                        <div className="SingleComment">                       
                             
                                <div className="CommentUserDp">
                                     <OthersProfile  id={comment.userId}/>
                                </div>
                                <p className="CommentedUserName">
                                    {comment.commentPersonName}
                                </p>
                           
                                
                             <p className="UserComment">&nbsp;{comment.comment}</p>
                               
                        </div>
                            )
                            })}
                    </div>
                    <div className="commentBox">
                        <form onSubmit={uploadComment}>
                            <input className="CommentInput" onChange={updateComment}  value={newcomment} placeholder="write your comment..." />
                            <button className="commentButton"><img  className="commentIcon" src={require('../Images/sendicon.png')}/></button>     
                        </form>
                    </div>
                </>
            }
             
              
              
        </div>
    )
}