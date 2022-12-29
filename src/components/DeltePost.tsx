import { db } from "../config/firebase"
import { collection,doc, query, where,  deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import "../Styles/DeltePost.css"
  
interface Postid{
    PostId:string;
    updateHomePage:Function
    getImageId:String
    removePost:Function

     
}
export const DeletePost = (props :Postid) => {
    
     
     
     
    const deletePost =async ()=> {
        const confirmBox = window.confirm(
            "Do you really want to delete this Post"
          )
        
        console.log("delete post called");
        if ( confirmBox){
            
            props.removePost(props.PostId);
            await deleteDoc (doc(db, "posts", props.PostId)).then(async ()=>{
                // window.location.reload();
                await deleteImage().then( ()=> {
                   
                //    window.location.reload();
                });
                
            }               
            )
            
        }

    }

    

    //deleting image

    const storage = getStorage();

    // Create a reference to the file to delete
    const desertRef = ref(storage, 'postImages/'+props.getImageId+'/img');

    // Delete the file
    const deleteImage =async ()=>{

       await deleteObject(desertRef).then(() => {
        console.log("image deleted succesfully")
        }).catch((error) => {
        console.log("cant delte image"+error)
        });
    }
    return(
        <button className="DeletePostButton"onClick={deletePost}>Delete Post&nbsp;</button>
    )
}