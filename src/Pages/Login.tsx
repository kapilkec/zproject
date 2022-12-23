import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"
 

export default  function Login () {
    const navigate = useNavigate()

    const signinWithGoogle =  async () => {
         

        const result = await  signInWithPopup(auth,provider);
        console.log(result);
        navigate("/");
    }
    return(
        <div style={{marginLeft:"50%"}}>
            <p>Login with google</p>
            <button onClick={signinWithGoogle}>Login</button>
        </div>
    )

}