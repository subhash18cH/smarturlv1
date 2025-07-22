import { useEffect, useState } from "react"
import Sidebar from "./sidebar"
import { api } from "./api";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FiFilePlus } from "react-icons/fi";
import LinkBox from "./utils/LinkBox";

interface UrlsType {
  _id: string;
  originalURL: string;
  shortURL: string;
  click_count: number;
  ownerUserId: string;
  qrCode?: string;
}
const UserLinks = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [urls, setUrls] = useState<UrlsType[]>([]);

  const getUserURLS = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/url/user");
      if (response.status === 200) {
        setUrls(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getUserURLS()
  }, [])

  return (
    <div className='min-h-screen bg-blue-50'>
      <Sidebar />
      <div className='flex justify-center'>
        <div className='w-full px-4 sm:px-6 md:px-8 sm:ml-52 mt-16 sm:mt-12 max-w-7xl mx-auto'>

          <div className="w-full">
            {!loading && urls && urls.length > 0 && (
              <h1 className='text-slate-800 text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-12 px-2 lg:ml-11 md:ml-7'>
                SmartUrl Links
              </h1>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {urls && urls?.length === 0 ? (
                  <div className='flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4'>
                    <div className='text-center'>
                      <h2 className='text-xl sm:text-2xl font-bold text-gray-800 mb-4'>
                        You didn't create any URL yet
                      </h2>
                      <p className='text-sm sm:text-base text-gray-600 mb-6'>
                        Start by clicking on Create URL button
                      </p>
                    </div>

                    <div className='flex justify-center w-full'>
                      <Link to="/link-page/create">
                        <button className='flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg 
                          hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200'>
                          <FiFilePlus className='mr-2' size={20} />
                          <span className='text-sm sm:text-base'>Create URL</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className='grid gap-4 sm:gap-6'>
                    {urls.map((item) => (
                      <LinkBox key={item.shortURL} {...item} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserLinks