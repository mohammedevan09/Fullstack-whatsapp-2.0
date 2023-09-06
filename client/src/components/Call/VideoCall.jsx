import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../Main'

const Container = dynamic(() => import('./Container'), { ssr: false })

function VideoCall() {
  const { userInfo } = useSelector((state) => state?.user)
  const { videoCall } = useSelector((state) => state?.call)

  useEffect(() => {
    if (videoCall?.type === 'out-going') {
      socket.emit('outgoing-video-call', {
        to: videoCall?.id,
        from: {
          id: userInfo?.id,
          profilePicture: userInfo?.profileImage,
          name: userInfo?.name,
        },
        callType: videoCall?.callType,
        roomId: videoCall?.roomId,
      })
    }
  }, [videoCall])

  return <Container data={videoCall} />
}

export default VideoCall
