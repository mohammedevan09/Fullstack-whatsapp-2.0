import { endCall } from '@/context/callReducer'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MdOutlineCallEnd } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../Main'
import { GET_CALL_TOKEN } from '@/utils/ApiRoutes'
import axios from 'axios'

function Container({ data }) {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state?.user)

  const [callAccepted, setCallAccepted] = useState(false)
  const [fetchedToken, setFetchedToken] = useState(undefined)
  const [zgVar, setZgVar] = useState(undefined)
  const [localStream, setLocalStream] = useState(undefined)
  const [publishStream, setPublishStream] = useState(undefined)

  useEffect(() => {
    if (data?.type === 'out-going') {
      socket.on('accept-call', () => setCallAccepted(true))
    } else {
      setTimeout(() => {
        setCallAccepted(true)
      }, 1000)
    }
  }, [data])

  useEffect(() => {
    const getToken = async () => {
      try {
        const {
          data: { token },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo?.id}`)
        setFetchedToken(token)
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
  }, [callAccepted])

  useEffect(() => {
    const startCall = async () => {
      import('zego-express-engine-webrtc').then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID),
            process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
          )
          setZgVar(zg)

          zg.on(
            'roomStreamUpdate',
            async (roomID, updateType, streamList, extendedData) => {
              if (updateType === 'ADD') {
                const rmVideo = document.getElementById('remote-video')
                const vd = document.createElement(
                  data?.callType === 'video' ? 'video' : 'audio'
                )
                vd.id = streamList[0].streamID
                vd.autoplay = true
                vd.playsInline = true
                vd.muted = false
                if (rmVideo) {
                  rmVideo.appendChild(vd)
                }
                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => (vd.srcObject = stream))
              } else if (
                updateType === 'DELETE' &&
                zg &&
                localStream &&
                streamList[0].streamID
              ) {
                zg.destroyStream(localStream)
                zg.stopPublishingStream(streamList[0].streamID)
                zg.logoutRoom(data?.roomId?.toString())
                dispatch(endCall())
              }
            }
          )
          await zg.loginRoom(
            data?.roomId?.toString(),
            fetchedToken,
            { userID: userInfo?.id?.toString(), userName: userInfo?.name },
            { userUpdate: true }
          )

          const localStream = await zg.createStream({
            camera: {
              audio: true,
              video: data?.callType === 'video' ? true : false,
            },
          })
          const localVideo = document.getElementById('local-audio')
          const videoElement = document.createElement(
            data?.callType === 'video' ? 'video' : 'audio'
          )
          videoElement.id = 'video-local-zego'
          videoElement.className = 'h-28 w-32'
          videoElement.autoplay = true
          videoElement.muted = false
          videoElement.playsInline = true

          localVideo.appendChild(videoElement)
          const td = document.getElementById('video-local-zego')
          td.srcObject = localStream
          const streamID = '123' + Date.now()
          setPublishStream(streamID)
          setLocalStream(localStream)
          zg.startPublishingStream(streamID, localStream)
        }
      )
    }
    if (fetchedToken) {
      startCall()
    }
  }, [fetchedToken])

  const endingCall = () => {
    if (data?.callType === 'voice') {
      socket.emit('reject-voice-call', { from: data?.id })
      if (zgVar && localStream && publishStream) {
        zgVar.destroyStream(localStream)
        zgVar.stopPublishingStream(publishStream)
        zgVar.logoutRoom(data?.roomId.toString())
      }
    } else {
      socket.emit('reject-video-call', { from: data?.id })
    }
    dispatch(endCall())
  }

  // console.log(data)

  return (
    <div className="border-l border-conversation-border w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data?.name}</span>
        <span className="text-lg">
          {callAccepted && data?.callType !== 'video'
            ? 'On going call'
            : 'Calling'}
        </span>
      </div>
      {(!callAccepted || data?.callType === 'audio') && (
        <div className="my-24">
          <Image
            src={data?.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>
      <div className="h-16 w-16 flex items-center bg-red-600 justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endingCall}
        />
      </div>
    </div>
  )
}

export default Container
