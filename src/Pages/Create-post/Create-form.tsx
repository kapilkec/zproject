import { useForm } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { addDoc, collection} from "firebase/firestore"
import {auth, db } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../../Styles/Create-form.css"
import {  useNavigate } from "react-router-dom";
import  {useEffect, useState } from "react"
import { ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage"
import  { storage } from "../../config/firebase"
import OthersProfile from "../../components/OthersProfile";


 
//collection says in which collection we need to add
//adDoc will add a document

interface CreateFormData {
    title: string;
    description: string;

}


export default function CreateForm() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const [PostImage, setPostImage] = useState<File | null>(null);
    const setImage = (e: any)=>{
        {e && setPostImage(e.target.files[0])}
        console.log(e.target.files[0]);
    }

    const uploadImage = async (postId: String)=> {
        if(PostImage == null) return;
        const imagref = ref(storage, "postImages/"+postId+"/img");
       await  uploadBytes(imagref,PostImage).then(
            ()=>{

                console.log("image uploaded");
            }
        )
    }

    

    const postRef = collection(db, "posts")

    const schema = yup.object().shape(
        {
            title: yup.string().required("You must add a title"),
            description : yup.string().required("You must add a description"),
            
        }
    )
    const { register, handleSubmit, formState: { errors}} = useForm<CreateFormData>({
        resolver: yupResolver(schema),
    })

    const onsubmiting = async  (data: CreateFormData)=> {
        if(!user) return;
        if(PostImage == null){
            alert("Must add an image");
            return;
        }
          const timestamp =  user.uid+Date.now();
       console.log("time"+timestamp);
       await  addDoc (postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
            getImageId : timestamp,
            likes:[],
            comments:[]

       }).then(async ()=>{
        alert("post added succesfully");
        alert("image uploading please wait a moment")
        await uploadImage(timestamp as string);
         navigate("/");
        
       })
    }
    //  console.log("timestamp" + Date.now())
    return(
        <div className="createPost">
           
            <form   className="PostForm" onSubmit={handleSubmit(onsubmiting)}>
              
                <div className="userNameProfile">
                    {/* <div> */}
                        <div className="profileCreatePost">
                            <OthersProfile id={user?.uid+""}/>
                        </div>
                        <p className="newPostName">{user?.displayName?.split(" ")[0]}</p>

                    {/* </div> */}
                    
                   
                    <p className="rightEnd animate-charcter">Add new post</p>
                </div>
               
                <input  type="text" className="title" placeholder="Title..." {...register("title")}/>
                <p>{errors.title?.message }</p>
                <textarea  className="description" placeholder="Description.." {...register("description")} />
                <p>{errors.description?.message }</p>
                <label className="postImageLabel" htmlFor="postImage">
                <i className="fa fa-2x fa-camera"></i><span className="postImageName">{PostImage?.type}</span>
                <input  id="postImage" className="inputFile"  style={{display:"none"}}  type="file" onChange={ setImage } />
                </label>
                <br></br>
                <div className="createPostSubmit">
                    <input  type="submit" className="submit"/>
                </div>
                
            </form>
        </div>

    )
}