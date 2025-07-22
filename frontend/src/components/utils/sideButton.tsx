import type { ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"

interface SideButtonProps {
  route: string,
  label: string,
  icon: ReactNode,
  isLogout?: boolean,
  onClick?: () => void

}
const SideButton = ({ route, label, icon, isLogout }: SideButtonProps) => {
  const navigate = useNavigate();
  const handleCLick = (e: React.MouseEvent) => {
    if (isLogout) {
      e.preventDefault();
      localStorage.removeItem("JWT");
      navigate("/")
    }
  }
  return (
    <NavLink
      className={({ isActive }) =>
        isActive ?
          "flex items-center font-bold bg-blue-200 text-[#5052ce] w-full py-2 px-5 space-x-5 rounded-md " :
          "flex items-center font-semibold  hover:bg-blue-100 w-full py-2 px-5 space-x-5 rounded-md "
      }
      to={route}
      onClick={handleCLick}>
      <span className='text-2xl'>{icon}</span>
      <span className=''>{label}</span>
    </NavLink>
  )
}

export default SideButton