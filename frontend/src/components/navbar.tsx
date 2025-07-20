import { NavLink } from "react-router-dom"
import logo from "/src/assets/logo.jpg";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full">
      <div className="flex justify-between items-center p-3">

        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="logo" className="rounded-full w-14" />
          <span className="font-bold md:text-2xl lg:text-2xl text-xl text-[#5052ce]">SmartUrl</span>
        </div>

        <div className="space-x-8">
          <NavLink to={"/signin"} className="px-4 py-3 text-[#5052ce] hover:text-[#6a6bd5] hover:underline font-bold">Log In</NavLink>
          <NavLink to={"signup"} className="border px-4 py-3 bg-[#5052ce] text-white hover:bg-[#6a6bd5] font-semibold rounded-md">Sign Up</NavLink>
        </div>

      </div>

    </nav>
  )
}

export default Navbar