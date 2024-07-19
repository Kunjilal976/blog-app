import './App.css'

import Header from "./components/Header"
import {Route,Routes} from "react-router-dom"
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './components/CreatePost';
import BlogsPage from './components/BlogsPage';
import Blog from './components/Blog';
import EditBlog from './components/EditBlog';
function App() {
 
  return (
    <UserContextProvider>
      <>
      <Header/>
      <Routes>
        <Route path="/" element={<BlogsPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/create" element={<CreatePost/>}/>
        <Route path="/blog/:id" element={<Blog/>}/>
        <Route path="/edit/:id" element={<EditBlog/>}/>
      </Routes>
      </>
    </UserContextProvider>
  );
}
export default App;