import {
  endCall,
  setIncomingVideoCall,
  setVideoCall,
} from '@/context/callReducer'
import Image from 'next/image'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../Main'

function IncomingVideoCall() {
  const dispatch = useDispatch()

  const { incomingVideoCall } = useSelector((state) => state?.call)

  const acceptCall = () => {
    dispatch(setVideoCall({ ...incomingVideoCall, type: 'in-coming' }))
    socket.emit('accept-incoming-call', { id: incomingVideoCall?.id })
    dispatch(setIncomingVideoCall(undefined))
  }

  const rejectCall = () => {
    socket.emit('reject-video-call', { from: incomingVideoCall?.id })
    dispatch(endCall())
  }

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm items-center justify-start flex p-4 gap-5 bg-conversation-panel-background text-white  drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall?.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomingVideoCall?.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default IncomingVideoCall
