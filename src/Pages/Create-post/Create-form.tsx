import { useForm } from "react-hook-form"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup"
import { addDoc, collection} from "firebase/firestore"
import {auth, db } from "../../config/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import "../../Styles/Create-form.css"
import {  useNavigate } from "react-router-dom";

//collection says in which collection we need to add
//adDoc will add a document


export default function CreateForm() {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    interface CreateFormData {
        title: string;
        description: string;

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
       await  addDoc (postRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid,

       }).then( ()=>{
        alert("post added succesfully");
         navigate("/");
        
       })
    }

    return(
        <form className="PostForm" onSubmit={handleSubmit(onsubmiting)}>
            <input  className="title" placeholder="Title..." {...register("title")}/>
            <p>{errors.title?.message }</p>
            <textarea  className="description" placeholder="Description.." {...register("description")} />
            <p>{errors.description?.message }</p>
            <input  type="submit" className="submit"/>
           
        </form>
    )
}