import { useState } from "react";
import { MdContentCopy } from "react-icons/md";
import Sidebar from "./sidebar";
import { api } from "./api";
import toast from "react-hot-toast";

const LinkCreate = () => {
  const [longURL, setLongURL] = useState<string>('');
  const [shortURL, setShortURL] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortURL).then(() => {
      toast.success('Short URL copied!');
    }).catch(() => {
      toast.error('Failed to copy URL.');
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post('/api/url/short-url', { longUrl: longURL });
      console.log(response.data);

      if (response.status === 200) {
        setShortURL(`${import.meta.env.VITE_BACKEND_URL}/api/url/` + response.data.shortURL);
        toast.success('URL shortened successfully!');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen sm:flex-row">
      <Sidebar />
      <div className="flex flex-col justify-center items-center flex-1 p-4 bg-blue-50 sm:ml-52">
        <div className="w-full max-w-3xl rounded-lg flex flex-col p-4 sm:p-6 bg-white shadow-lg">
          <h1 className="text-slate-800 text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6">Create a link</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Enter your URL <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 sm:px-4 sm:py-3 shadow-sm rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
                type="url"
                required
                placeholder="Enter your long URL here"
                value={longURL}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLongURL(e.target.value)}
              />
            </div>

            <div className="mb-4 sm:mb-6">
              <label className="block mb-2 font-semibold text-gray-700 text-sm sm:text-base">
                Your short URL
              </label>
              <div className="relative">
                <input
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 shadow-sm rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm sm:text-base"
                  type="text"
                  placeholder="Your shortened URL will appear here"
                  value={shortURL}
                  readOnly
                />
                {shortURL && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute hover:cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none"
                    aria-label="Copy short URL"
                  >
                    <MdContentCopy size={20} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full hover:cursor-pointer px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${isLoading ? 'bg-[#9792dd] cursor-wait' : 'bg-[#5052ce] hover:bg-[#6a6bd5]'} text-white`}
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkCreate;
