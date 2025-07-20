import { useState } from "react";
import CreateModel from "./utils/createModel";
import SideButton from "./utils/sideButton";
import { IoMdCreate, IoMdLogOut } from "react-icons/io";
import { FiLink } from "react-icons/fi";
import { QrCode } from "lucide-react";
import { IoAnalytics } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import logo from '/src/assets/logo.jpg';

const Sidebar = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("JWT")
    navigate("/")
  }

  return (
    <div className={`w-52 h-screen fixed flex flex-col justify-between py-6`}>

      <div>

        <div className="flex items-center pl-3 gap-2">
          <Link to="/home" className=''>
            <img className='rounded-full w-12 sm:w-12' src={logo} alt="SmartUrl" />
          </Link>
          <span className='text-2xl  font-semibold text-[#5052ce]'>SmartUrl</span>
        </div>

        <div className="flex flex-col justify-center items-center mt-6">
          <button onClick={() => {
            setIsModalOpen(true)
          }} className="flex items-center px-6 py-2 hover:bg-blue-200 w-full space-x-3 font-semibold">
            <IoMdCreate className="text-2xl" />
            <span className="font-semibold">Create</span>
          </button>

          <SideButton icon={<FiLink />} label="Links" route="/link-page" />
          <SideButton icon={<QrCode />} label="Qr Code" route="/qr-code" />
          <SideButton icon={<IoAnalytics />} label="Analytics" route="/analytics" />

          <button onClick={handleLogout}
            className="flex items-center font-semibold hover:bg-red-600 hover:text-white rounded-md space-x-5 w-full px-5 py-2">
            <span className="text-2xl"><IoMdLogOut /></span>
            <span>Logout</span>
          </button>
        </div>

      </div>
      <CreateModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Sidebar