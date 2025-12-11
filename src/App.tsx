import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import {BrowserRouter, Route, Routes} from 'react-router-dom'

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
            </Routes>
        </BrowserRouter>
    )
}

export default App;