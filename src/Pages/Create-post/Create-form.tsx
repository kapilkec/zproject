import { useForm } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { addDoc, collection} from "firebase/firestore"
import {auth, db } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../../Styles/Create-form.css"
import {  useNavigate } from "react-router-dom";
import  {useState } from "react"
import { ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage"
import  { storage } from "../../config/firebase"


 
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
          const timestamp =  user.uid+Date.now();
       console.log("time"+timestamp);
       await  addDoc (postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,
            getImageId : timestamp,

       }).then(async ()=>{
        alert("post added succesfully");
        alert("image uploading please wait a moment")
        await uploadImage(timestamp as string);
         navigate("/");
        
       })
    }
    //  console.log("timestamp" + Date.now())
    return(
        <form className="PostForm" onSubmit={handleSubmit(onsubmiting)}>
            <input  type="text" className="title" placeholder="Title..." {...register("title")}/>
            <p>{errors.title?.message }</p>
            <textarea  className="description" placeholder="Description.." {...register("description")} />
            <p>{errors.description?.message }</p>
            
            <input type="file" onChange={ setImage } />
             
            <input  type="submit" className="submit"/>
            
        </form>

    )
}