import {  db } from "../config/firebase"
import { getDocs, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import Post from "../components/Post"
import {ImageUpload } from "../components/ImageUpload"
 
 export interface Post{
    id: any;
    description:String;
    title: String;
    userId: String;
    username: String;

}
 export default function Main(){
    const postRef = collection(db, "posts")
    const [posts, setPostLists] = useState<Post[] | null>([]);
     const getPosts = async ()=> {
        const data = await getDocs(postRef);
        setPostLists(
            data.docs.map( (doc) => ({...doc.data(), id:doc.id }))  as Post[]
            );
    }
    

    useEffect( () => {
        getPosts();
    }, [])
    return(
        <div>
            { posts?.map((post) => (
                    <Post   {...post}/>
            )) }
             
        </div>
    )
}