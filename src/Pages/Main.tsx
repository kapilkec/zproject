import {  auth, db } from "../config/firebase"
import { getDocs, collection, doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Post from "../components/Post"
import "../Styles/Main.css"
import { createContext } from "react"
import { useAuthState } from "react-firebase-hooks/auth"


 export interface Post{
    comments: String;
    likes: String;
    id: any;
    description:String;
    title: String;
    userId: String;
    username: String;
    getImageId: String;


}
 
interface Followers{
    FollowerId: String;
    FollowerName: String;
}

export const Context = createContext<Followers[] | null>(null);

 export default function Main(){

    const [user] = useAuthState(auth);
    const postRef = collection(db, "posts")
    const [posts, setPostLists] = useState<Post[] | null>([]);

    //for followers list ::start
    const [followers,updateFollowers] = useState<Followers[] | null>(null)
    const FollowRef = doc(db, "userDetails",user? user.uid : "unknownuser")

    const getFollowers = async () => {
        const docSnap = await getDoc(FollowRef);
        if(docSnap.exists()){
            const getFollowersList = docSnap.data() 
            
             updateFollowers( getFollowersList.Followers )
             const temp = followers?.filter((e) => {
               return e.FollowerId == user?.uid
             })
             console.log(getFollowersList.Followers)
        }
       else{
        console.log("no data")
       }
    }

    useEffect( () => {
        getFollowers()
    },[user])
    //followers list :: end

    
    //get posts :: start
    const getPosts = async ()=> {
        const data = await getDocs(postRef);
        // console.log(data.docs[0].data())
        setPostLists(
            data.docs.map( (doc) => ({...doc.data(), id:doc.id }))  as Post[]
            );
    }
    

      useEffect( () => {
        getPosts();
    }, [])

    //get posts :: end 

     
    return(
        <div className="MainPage">
            <Context.Provider value = { followers }>
            { posts?.map((post) => (

                    <Post    id={post.id}
                    description={post.description}
                    title = {post.title}
                    userId = {post.userId}
                    username={ post.username}
                    getImageId={post.getImageId}
                    likes={post.likes}
                    comments={post.comments}
                    updateHomePage = {getPosts}
                    globalFollowersChange = { updateFollowers}/>
            )) }
            </Context.Provider>
        </div>
    )
}