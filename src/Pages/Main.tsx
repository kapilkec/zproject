import {  auth, db } from "../config/firebase"
import { getDocs, collection, doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import Post from "../components/Post"
import "../Styles/Main.css"
import { createContext } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { Context2 } from "../App";
import { useContext } from "react"

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

 
 
 export default function Main( ){
    //context
    const userInfoFromContext = useContext(Context2);

    const [user] = useAuthState(auth);
    const postRef = collection(db, "posts")
    
    const [posts, setPostLists] = useState<Post[] | null>([]);
    const removePost = (id: string) => {
        if(!posts) return;
        console.log(posts);
        const newArr = posts.filter(object => {
            return object.id !== id;
          });
          console.log(newArr);
          setPostLists(newArr);
        //   console.log(posts);
        
    }
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
             const data = await getDocs(postRef);
         
       
            const postcount =  data.docs.filter( (doc) => {
            return doc.data().userId == user?.uid
            })

             const ob = {
                followers:getFollowersList.Friends.length,
                following:getFollowersList.Followers.length,
                posts:postcount.length,
             }
             userInfoFromContext?.updateUserInfo(ob)
             
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
        console.log('`````')
       
         const postcount =  data.docs.filter( (doc) => {
           return doc.data().userId == user?.uid
         })
         

        
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
                    globalFollowersChange = { updateFollowers}
                    removePost = {removePost}/>
            )) }
            </Context.Provider>
        </div>
    )
}