import React, { useEffect, useState } from 'react';
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./Styles/App.css"
 import Main from "./Pages/Main"
 import Login from './Pages/Login';
 import CreatePost from './Pages/Create-post/CreatePost';
import Navbar from './components/Navbar';
import MyPost from './Pages/myPost';
import Profile from './Pages/profile';
import { createContext } from "react";
import { userInfo } from 'os';
import { boolean } from 'yup';

interface  UserInfo {
  followers:Number;
  following:number;
  posts:Number;
}
interface forContext{
  Userinfo:  {
    followers:Number;
    following:number;
    posts:Number;
  } ;
  updateUserInfo:Function;
  
} 
export const Context2 =  createContext<forContext| null>(null);

export default function App() {
 
  const [UserInformation,updateUserInfo2] = useState<UserInfo|null>(null);
   

 

 
   

  return (
    <div className="App"  >
    
      <Context2.Provider value = {{Userinfo:UserInformation as any,updateUserInfo:updateUserInfo2}}>
          < Router>
              <Navbar />
              <Routes>
                  <Route path="/" element={<Main  /> }/>
                  <Route path="/login" element={<Login />} />
                  <Route path="/createPost" element={<CreatePost/>} />
                  <Route path ="/profile" element={<Profile/>} />

              </Routes>
          </Router>
       </Context2.Provider>
    </div>
  );
}

 
