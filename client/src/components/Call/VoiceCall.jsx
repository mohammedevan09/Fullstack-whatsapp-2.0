import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { socket } from '../Main'

const Container = dynamic(() => import('./Container'), { ssr: false })

function VoiceCall() {
  const { userInfo } = useSelector((state) => state?.user)
  const { voiceCall } = useSelector((state) => state?.call)

  useEffect(() => {
    if (voiceCall?.type === 'out-going') {
      socket.emit('outgoing-voice-call', {
        to: voiceCall?.id,
        from: {
          id: userInfo?.id,
          profilePicture: userInfo?.profileImage,
          name: userInfo?.name,
        },
        callType: voiceCall?.callType,
        roomId: voiceCall?.roomId,
      })
    }
  }, [voiceCall])

  return <Container data={voiceCall} />
}

export default VoiceCall
