import { db } from "../config/firebase"
import { collection,doc, query, where,  deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

  
interface Postid{
    PostId:string;
    updateHomePage:Function
    getImageId:String

     
}
export const DeletePost = (props :Postid) => {
    
     
     
     
    const deletePost =async ()=> {
        const confirmBox = window.confirm(
            "Do you really want to delete this Post"
          )
        
        console.log("delete post called");
        if ( confirmBox){
            await deleteDoc (doc(db, "posts", props.PostId)).then(async ()=>{
               
                deleteImage();
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
        <button onClick={deletePost}>Delete Post</button>
    )
}