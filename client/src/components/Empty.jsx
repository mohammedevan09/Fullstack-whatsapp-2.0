import Image from 'next/image'
import React from 'react'

function Empty() {
  return (
    <div className="for-image">
      <div className="border-conversation-border flex flex-col w-full h-[100vh] border-b-4 border-b-icon-green items-center justify-center backdrop-blur-[2px] md:backdrop-blur-[3px] bg-[#032332db]">
        <Image src="/whatsappNew.png" alt="whatsapp" height={300} width={300} />
      </div>
    </div>
  )
}

export default Empty
