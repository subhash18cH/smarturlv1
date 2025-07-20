import { Link } from "react-router-dom"
import Navbar from "./navbar"
import FeatureCard from "./utils/featureCard"
import { BarChart3, LineChart, LinkIcon, QrCode, Smartphone } from "lucide-react"
import FeatureListItem from "./utils/featureListItem"
import data from "../assets/image.png"
const Landingpage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">

        <section className="pt-16 flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 mt-28">More than just shorter links</h1>
          <p className="max-w-xl text-lg text-gray-600 mb-6">SmartUrl helps you create shorter, memorable links and track their performance with comprehensive analytics
          </p>
          <Link to={"/signin"} className="border font-semibold  py-3 rounded-md bg-[#5052ce] hover:bg-[#6a6bd5] text-white px-6 text-lg transition-colors">Get Started</Link>

        </section>

        <section className="py-20">
          <div className="max-w-7xl grid grid-cols-3 px-8 gap-8">
            <FeatureCard icon={<LinkIcon />} title="Link Shortening" description="Convert long links into short, trackable, and shareable URLs effortlessly." />

            <FeatureCard icon={<BarChart3 />} title="Click Analytics
" description="Analyze click patterns and engagement trends over time periods." />

            <FeatureCard icon={<QrCode />} title="QR Codes
" description="Generate QR codes instantly for your shortened links." />
          </div>

        </section>

        <section className="p-6">
          <div className="grid grid-cols-2 items-center">
            <div className="">
              <h2 className="text-3xl text-gray-900 font-bold mb-4">
                Powerful Analytics at Your Fingertips
              </h2>

              <div className="flex flex-col gap-4">
                <FeatureListItem icon={<Smartphone />} title="Device Analysis" desc="Understand user behavior across different devices and platforms." />

                <FeatureListItem icon={<LineChart />} title="Click Tracking" desc="Monitor click patterns and engagement over time." />

                <FeatureListItem icon={<BarChart3 />} title="Performance Insights" desc="Get detailed reports on link performance and user behavior." />
              </div>

            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <img src={data} alt="data" />
            </div>
          </div>

        </section>

        <section>
          <div className="flex flex-col justify-center items-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Try SmartUrl Today</h1>
            <p className="text-lg text-gray-600 max-w-2xl text-center px-4 mb-6">Transform your long URLs into short, trackable links, making sharing and analytics effortless.
            </p>
            <Link to={"/signup"} className="bg-[#5052ce] hover:bg-[#6a6bd5] text-white px-6 rounded-md py-3 text-lg font-semibold transition-colors">Create Account</Link>
          </div>
        </section>

      </div>
    </>
  )
}

export default Landingpage