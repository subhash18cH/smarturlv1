import { useEffect, useState } from "react";
import { api } from "./api";
import Sidebar from "./sidebar";
import { Loader2 } from "lucide-react";
import QrCodeBox from "./utils/QrCodeBox";

interface QRCodeData {
  qrCode: string;
  shortURL: string;
}

const UserQrCode = () => {
  const [userQrCodes, setUserQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQRCodes = async () => {
    try {
      setLoading(true);

      const response = await api.get('/api/url/user');

      if (response.status === 200) {
        const qrCodes: QRCodeData[] = response.data
          .map((item: { qrCode?: string; shortURL: string }) =>
            item.qrCode
              ? { qrCode: item.qrCode, shortURL: item.shortURL }
              : null
          )
          .filter((item: QRCodeData): item is QRCodeData => item !== null);

        setUserQrCodes(qrCodes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      <Sidebar />
      <div className="flex justify-center">
        <div className="w-full px-4 sm:px-6 md:px-8 sm:ml-52 mt-16 sm:mt-12 max-w-7xl mx-auto lg:ml-64">
          <div className="w-full">
            {!loading && userQrCodes.length > 0 && (
              <h1 className='text-slate-800 text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 sm:mb-12 px-2 lg:ml-1 md:ml-7'>
                QR Codes
              </h1>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {userQrCodes.length === 0 ? (
                <div className="p-8 rounded-lg text-center">
                  <h1 className="text-gray-600 text-3xl mt-36">Create your first QR code!</h1>
                  <p className="text-gray-400 text-2xl mt-2">
                    Your generated QR codes will appear here
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6">
                  {userQrCodes.map((qrCodeData, index) => (
                    <QrCodeBox
                      key={index}
                      index={index}
                      qrCode={qrCodeData.qrCode}
                      shortUrl={qrCodeData.shortURL}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserQrCode;
