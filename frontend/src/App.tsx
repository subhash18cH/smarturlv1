import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landingpage from "./components/landingpage"
import Signup from "./components/Auth/signup"
import Signin from "./components/Auth/signin"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./protectedRoute"
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />


          <Route path="/home" element={
            <ProtectedRoute>
              <Signin />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App