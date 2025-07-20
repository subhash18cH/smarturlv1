import { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import Sidebar from "./sidebar";


const LinkCreate = () => {
  const [longURL, setLongURL] = useState<string>('');
  const [shortURL, setShortURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCopy = () => {

  }

  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <div className="bg-blue-50">
        <div className="w-full bg-white p-6 shadow-lg">
          <h1 className="text-slate-800 text-2xl font-semibold mb-6">Create a Link</h1>
          <form >

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="">Enter your URL <span className="text-red-500">*</span></label>
              <input className="w-full px-4 py-3 border rounded-lg outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required type="url" value={longURL} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLongURL(e.target.value)} placeholder="Enter Your Long URL here" />
            </div>

            <div className="mb-6" >
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="">Your short URL</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 border outline-none transition-all rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 "
                  type="text"
                  readOnly
                  value={shortURL}
                  placeholder="Your shortened URL will appear here"
                />
                {shortURL && (
                  <button
                    className="absolute right-3 top-1/2 text-gray-500 hover:text-blue-500"
                    onClick={handleCopy}>
                    <MdContentCopy size={20} />
                  </button>
                )}
              </div>

            </div>

            <div>
              <button type="submit" disabled={isLoading} className={`w-full px-4 py-3 rounded-lg font-semibold text-white ${isLoading ? "bg-[#9792dd] cursor-wait" : "bg-[#5052ce] hover:bg-[#6a6bd5]"}`}>
                {isLoading ? "Generating..." : "Generate"}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LinkCreate