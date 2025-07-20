import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landingpage from "./components/landingpage"
import Signup from "./components/Auth/signup"
import Signin from "./components/Auth/signin"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/protectedRoute"
import HomePage from "./components/homePage"
import QrCode from "./components/qrCode"
import UserQrCode from "./components/userQr"
import UserLinks from "./components/userLinks"
import LinkCreate from "./components/linkCreate"
import AnalyticsPage from "./components/analyticsPage"
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
              <HomePage />
            </ProtectedRoute>
          } />

          <Route path="/link-page/create" element={
            <ProtectedRoute>
              <LinkCreate />
            </ProtectedRoute>
          } />


          <Route path="/link-page" element={
            <ProtectedRoute>
              <UserLinks />
            </ProtectedRoute>
          } />

          <Route path="/qr-code/create" element={
            <ProtectedRoute>
              <QrCode />
            </ProtectedRoute>
          } />

          <Route path="/qr-code" element={
            <ProtectedRoute>
              <UserQrCode />
            </ProtectedRoute>
          } />
          <Route 
          path="/analytics" element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          } />



        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App