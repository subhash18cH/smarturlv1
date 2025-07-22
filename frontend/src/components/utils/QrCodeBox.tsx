
import toast from 'react-hot-toast';
import { MdSubdirectoryArrowRight } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiDownloadSimple } from "react-icons/pi";
import { api } from '../api';
import { QRCodeSVG } from 'qrcode.react';

interface QrCodeBoxProps {
  index: number,
  qrCode: string,
  shortUrl: string
}
const QrCodeBox = ({ index, shortUrl }: QrCodeBoxProps) => {


  const handleDownload = () => {
    try {
      const svg = document.getElementById(`qr-${index}`);
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg as HTMLElement);

      const canvas = document.createElement("canvas");
      const size = 500;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx?.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `qrcode-${Date.now()}.png`;
        link.href = pngUrl;
        link.click();
      };

      img.src = url;
    } catch (error) {
      console.log(error);
      toast.error("Failed to download QR Code");
    }
  };


  const handleDelete = async (url: string) => {
    try {
      const response = await api.delete("/api/qrcode/delete-qr", {
        data: { shortUrl: url }
      })
      if (response.status === 200) {
        toast.success("Qr Code deleted!")
        setTimeout(() => {
          window.location.reload();
        }, 1000);

      }
    } catch (error) {
      console.log(error)

    }

  }
  return (
    <div key={index} className=" shadow-md gap-2 bg-white rounded-lg
    w-full sm:w-[95%] md:w-[90%]  flex sm:gap-4 sm:p-4 min-h-[8rem] sm:min-h-[10rem] mb-4 sm:mb6 items-center">

      <QRCodeSVG
        id={`qr-${index}`}
        value={`${import.meta.env.VITE_BACKEND_URL}/api/url/${shortUrl}`}
        size={70}
        level="H"
        className="rounded-sm"
      />

      <div className='flex lg:flex-row md:flex-row flex-col gap-4 p-2'>
        <a className=" flex items-center gap-1" target='_blank' href={`${import.meta.env.VITE_BACKEND_URL}/api/url/${shortUrl}`}>
          <MdSubdirectoryArrowRight />
          <span className='break-all hover:text-blue-700  hover:underline'>{`${import.meta.env.VITE_BACKEND_URL}/api/url/${shortUrl}`}</span>
        </a>

        <div className='flex justify-between items-center lg:ml-10'>
          <button className='hover:cursor-pointer md:p-2 lg:p-2 rounded lg hover:bg-blue-200 mr-5' onClick={handleDownload}>
            <PiDownloadSimple className='text-2xl text-blue-900 font-bold ' />
          </button>


          <button className=' mr-4 rounded-lg ml-2 hover:cursor-pointer' onClick={() => {
            handleDelete(shortUrl)
          }}>
            <div className=' rounded-lg md:p-2 lg:p-2 hover:bg-red-200'>
              <RiDeleteBin6Line className='text-2xl text-red-700 ' />
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}

export default QrCodeBox