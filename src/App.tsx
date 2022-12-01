import React from 'react';
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

 import Main from "./Pages/Main"
 import Login from './Pages/Login';
 import CreatePost from './Pages/Create-post/CreatePost';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">

       < Router>
          <Navbar />
          <Routes>
              <Route path="/" element={<Main/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/createPost" element={<CreatePost/>} />

          </Routes>
       </Router>
    </div>
  );
}

export default App;
