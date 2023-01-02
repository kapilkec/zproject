import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Post from "../components/Post";
import { db, auth} from "../config/firebase";


export interface Post{
    id: any;
    description:String;
    title: String;
    userId: String;
    username: String;
    

}

export default function MyPost() {

   
    const [Myposts, setMyPostLists] = useState<Post[] | null>([]);
   
    const [user] = useAuthState(auth);
    const postRef = collection(db, "posts")
    const userId = user? user.uid : "none";
    const lquery = query(postRef,where("userId","==", userId))
    const getData = async () => {
        const data = await getDocs(lquery)
        setMyPostLists(
            data.docs.map( (doc) => ({...doc.data(), id:doc.id }))  as Post[]
            );
    }
    useEffect( () => {
        getData();
    },[user])
     //remove Post
     const removePost = (id: string) => {
        if(!Myposts) return;
        console.log(Myposts);
        const newArr = Myposts.filter(object => {
            return object.id !== id;
          });
          console.log(newArr);
          setMyPostLists(newArr);
        //   console.log(posts);
        
    }
    return(
        <div >  
        { Myposts?.map((post) => (
                    <Post {...post} removePost={removePost}/>
            )) }
        </div>
    
    )
}