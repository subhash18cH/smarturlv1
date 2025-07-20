import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode
}
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("JWT");
  if (!token) {
    return <Navigate to={"/signin"} />
  }
  return (
    <>{children}</>
  )
}

export default ProtectedRoute