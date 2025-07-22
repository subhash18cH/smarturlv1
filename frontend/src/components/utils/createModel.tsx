import { QrCode } from 'lucide-react';
import { FiLink } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

interface CreateModelProps {
  isOpen: boolean,
  onClose: () => void
}

const CreateModel = ({ isOpen, onClose }: CreateModelProps) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 px-4 sm:px-0'>

      <div className='bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm space-y-4'>

        <button onClick={() => {
          navigate("/link-page/create")
        }}
          className='rounded-lg hover:cursor-pointer gap-2 p-3 items-center w-full bg-[#5052ce] text-white hover:bg-[#6a6bd5] font-semibold flex justify-center sm:justify-start sm:pl-16'>
          <span><FiLink className='text-xl' /></span>
          Create Link
        </button>

        <button onClick={() => {
          navigate("/qr-code/create")
        }}
          className='rounded-lg hover:cursor-pointer w-full flex items-center gap-2 p-3 justify-center sm:justify-start sm:pl-16 bg-[#5052ce] text-white hover:bg-[#6a6bd5] font-semibold'>
          <span><QrCode /></span>
          Create QR Code
        </button>

        <button onClick={onClose} className='rounded-lg w-full hover:cursor-pointer bg-red-600 p-2 font-semibold hover:bg-red-500 text-white'>
          Cancel
        </button>

      </div>

    </div>
  )
}

export default CreateModel;
