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
    <div className='fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50 '>

      <div className='bg-white rounded-lg p-6 w-80 space-y-4'>

        <button onClick={() => {
          navigate("/link-page/create")
        }}
          className='rounded-lg hover:cursor-pointer gap-2 p-3 items-center w-full bg-[#5052ce] text-white hover:bg-[#6a6bd5] font-semibold flex pl-16 '>
          <span><FiLink className='text-xl' /></span>
          Create Link
        </button>

        <button onClick={() => {
          navigate("/qr-code/create")
        }}
          className='rounded-lg hover:cursor-pointer w-full flex items-center gap-2 p-3 pl-16 bg-[#5052ce] text-white hover:bg-[#6a6bd5] font-semibold'>
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

export default CreateModel