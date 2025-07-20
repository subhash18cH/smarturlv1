import { useEffect, useState } from "react"
import Sidebar from "./sidebar"
import { api } from "./api";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { FiFilePlus } from "react-icons/fi";

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
  const [urls, setUrls] = useState<UrlsType[]>();

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
    <div className="bg-blue-50 min-h-screen ">
      <Sidebar />

      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin size-8 text-blue-600" />
          </div>
        ) : <>
          {urls && urls.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">You didn't create any URL yet</h2>
              <p className=" text-gray-600 mb-6">Start by clicking on Create URL button</p>
              <Link to={"/link-page/create"}>
                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg hover:cursor-pointer">
                  <FiFilePlus size={20} className="mr-2" />
                  <span className="text-lg">Create URL</span>
                </button>
              </Link>
            </div>
          ) : (
            <div>
              urls
            </div>
          )}

        </>}

      </div>
    </div>
  )
}

export default UserLinks