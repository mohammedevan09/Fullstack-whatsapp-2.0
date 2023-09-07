import { setIsOpenChatList } from '@/context/responsiveReducer'
import Image from 'next/image'
import React from 'react'
import { useDispatch } from 'react-redux'

function Empty() {
  const dispatch = useDispatch()
  return (
    <div className="for-image responsive-container ">
      <div className="border-conversation-border flex flex-col w-full h-[100vh] border-b-4 border-b-icon-green items-center justify-center backdrop-blur-[2px] md:backdrop-blur-[3px] bg-[#032332db]">
        <Image src="/whatsappNew.png" alt="whatsapp" height={300} width={300} />
        <button
          className="responsive-one bg-red-900 mt-10  text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg  px-5 py-2.5 text-center mr-2 mb-2 text-xl"
          onClick={() => dispatch(setIsOpenChatList(true))}
        >
          See contacts
        </button>
      </div>
    </div>
  )
}

export default Empty

