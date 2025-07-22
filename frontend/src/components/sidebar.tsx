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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("JWT")
    navigate("/")
  }

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md sm:hidden"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <div className={`
        w-52 sm:w-60 h-screen fixed flex flex-col justify-between py-4 bg-blue-50 shadow-md
        transform transition-transform duration-300 ease-in-out z-40
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        sm:translate-x-0
      `}>
        <div className='flex flex-col justify-between'>

          <div className='flex pl-3 items-center px-2 gap-2 sm:gap-3 sm:pl-4'>
            <Link to="/home">
              <img className='rounded-full w-12 sm:w-12' src={logo} alt="SmartUrl" />
            </Link>
            <span className='text-lg sm:text-xl md:text-2xl font-semibold text-[#5052ce]'>SmartUrl</span>
          </div>

          <div className='flex flex-col space-y-4 sm:space-y-5 md:space-y-6 justify-center items-center mt-6 sm:mt-10'>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex hover:cursor-pointer items-center space-x-3 sm:space-x-4 md:space-x-5 px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-200 w-full font-semibold text-sm sm:text-base"
            >
              <IoMdCreate className='text-2xl sm:text-2xl' />
              <span className='font-semibold'>Create</span>
            </button>

            <SideButton
              label="Links"
              route="/link-page"
              icon={<FiLink />}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SideButton
              label="Qr Code"
              route="/qr-code"
              icon={<QrCode />}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <SideButton
              label="Analytics"
              route="/analytics"
              icon={<IoAnalytics />}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <button onClick={handleLogout} className='flex items-center font-semibold hover:cursor-pointer hover:bg-red-600 hover:text-white w-full py-2 px-5 space-x-3 sm:space-x-5 rounded-md'>
              <span className='text-2xl'><IoMdLogOut /></span>
              <span className='font-semibold'>Logout</span>
            </button>
          </div>

        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-30 sm:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <CreateModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

export default Sidebar;
