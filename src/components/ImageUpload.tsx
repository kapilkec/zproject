import { useState } from "react"
import  { storage } from "../config/firebase"
import { ref, uploadBytes, listAll, getDownloadURL} from "firebase/storage"
import { url } from "inspector";

export   const ImageUpload = ()=> {
        const [PostImage, setPostImage] = useState<File | null>(null);
        const [ImageList, setIamgeList] = useState<any>([]);
        const setImage = (e: any)=>{
            {e && setPostImage(e.target.files[0])}
            console.log(e.target.files[0]);
        }
        const uploadImage = async ()=> {
            if(PostImage == null) return;
            const imagref = ref(storage, "postImages/uid");
           await  uploadBytes(imagref,PostImage).then(
                ()=>{
                    console.log("image uploaded");
                }
            )
        }

        const displayImage =async ()=> {
            const getImageref = ref(storage, "postImages/")
               await listAll(getImageref).then(
                (response) => {
                    // console.log("response of image list"+response)
                    response.items.forEach(async (item) => {
                       await  getDownloadURL(item).then((url) => {
                                console.log(ImageList);
                                setIamgeList( [...ImageList, url])
                        })
                    })
                }
            )
        }
         
        return(
            <div>
                <input type="file" onChange={ setImage }/>
                <button onClick={uploadImage}>Done</button>
                <button onClick={displayImage}>display</button>
                {   ImageList.map ((url: string) => {
                    
                     return <img src={url} style={{width:"400px"}} ></img>
                    
                })  }
                {/* <img src={ImageList[0]}></img> */}
            </div>

        )
}

export const AddPhotoToPost = () => {
    const [PostImage, setPostImage] = useState<File | null>(null);
}