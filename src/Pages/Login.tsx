import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
 
import "../Styles/Login.css";
 



export default  function Login () {
    


    const navigate = useNavigate()

    const signinWithGoogle =  async () => {
         

        const result = await  signInWithPopup(auth,provider);
        
        console.log(result);
        navigate("/");
    }
    return(
              <div className="login" onClick={signinWithGoogle}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                     Login 
              </div>

            
        
    )

}