import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import CreateBlog from "./pages/blog/CreateBlog";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import MyBlog from "./pages/blog/MyBlog";
import EditBlog from "./pages/blog/EditBlog";
import ViewAllBlogs from "./pages/blog/ViewAllBlogs";
import SingleBlog from "./pages/blog/SingleBlog";

function App(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute>
                    <Home/>
                </ProtectedRoute>}/>
                <Route path="/signin" element={
                    <PublicRoute>
                        <SignIn/>
                    </PublicRoute>
                }/>
                <Route path="/signup" element={
                    <PublicRoute>
                        <SignUp/>
                    </PublicRoute>
                }/>
                <Route path="/create/blog" element={<ProtectedRoute>
                    <CreateBlog/>
                </ProtectedRoute>}/>
                <Route path="/my-blogs" element={<ProtectedRoute>
                    <MyBlog/>
                </ProtectedRoute>}/>
                <Route path="/edit/blog/:id" element={<ProtectedRoute>
                    <EditBlog/>
                </ProtectedRoute>}/>
                <Route path="/view/blogs" element={<ProtectedRoute>
                    <ViewAllBlogs/>
                </ProtectedRoute>}/>
                <Route path="/blogs/:id" element={<ProtectedRoute>
                    <SingleBlog/>
                </ProtectedRoute>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;