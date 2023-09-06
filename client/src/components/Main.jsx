import React, { useEffect, useRef, useState } from 'react'
import ChatList from './Chatlist/ChatList'
import Empty from './Empty'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Chat from './Chat/Chat'
import axios from 'axios'
import { GET_MESSAGES_ROUTE, HOST } from '@/utils/ApiRoutes'
import { io } from 'socket.io-client'
import { addMessage, setChatMessages } from '@/context/messageReducer'
import SearchMessages from './Chat/SearchMessages'
import VideoCall from './Call/VideoCall'
import VoiceCall from './Call/VoiceCall'
import {
  endCall,
  setIncomingVideoCall,
  setIncomingVoiceCall,
} from '@/context/callReducer'
import IncomingVideoCall from './common/IncomingVideoCall'
import IncomingCall from './common/IncomingCall'
import { setOnlineUsers } from '@/context/userReducer'

export let socket = io(HOST, {
  transports: ['websocket'],
})
function Main() {
  const { currentChatUser, userInfo } = useSelector((state) => state?.user)
  const { messagesSearch } = useSelector((state) => state?.message)
  const { voiceCall, videoCall, incomingVoiceCall, incomingVideoCall } =
    useSelector((state) => state?.call)

  const [socketEvent, setSocketEvent] = useState(false)

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userInfo?.id) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      socket.emit('add-user', userInfo.id)
      // console.log('Socket connected:', socket.connected)
    }
  }, [socket])

  useEffect(() => {
    if (socket && !socketEvent) {
      socket.on('msg-receive', (data) => {
        // console.log(data)
        dispatch(
          addMessage({
            id: Date.now().toString(),
            senderId: data?.from,
            recieverId: data?.to,
            message: data?.message,
            type: 'text',
            messageStatus: 'delivered',
            createdAt: Date.now(),
          })
        )
      })

      socket.on('incoming-voice-call', ({ from, roomId, callType }) => {
        dispatch(setIncomingVoiceCall({ ...from, roomId, callType }))
      })

      socket.on('incoming-video-call', ({ from, roomId, callType }) => {
        dispatch(setIncomingVideoCall({ ...from, roomId, callType }))
      })

      socket.on('voice-call-rejected', () => {
        dispatch(endCall())
      })

      socket.on('video-call-rejected', () => {
        dispatch(endCall())
      })

      socket.on('online-users', ({ onlineUsers }) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      setSocketEvent(true)
    }
    // console.log(socketEvent)
  }, [socket])

  useEffect(() => {
    const getMessages = async () => {
      const { data } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`
      )
      dispatch(setChatMessages(data?.messages))
    }

    if (currentChatUser?.id) {
      getMessages()
    }
  }, [currentChatUser])
  return (
    <>
      {incomingVideoCall && <IncomingVideoCall />}
      {incomingVoiceCall && <IncomingCall />}
      {videoCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VideoCall />
        </div>
      )}

      {voiceCall && (
        <div className="h-screen w-screen max-h-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div
              className={messagesSearch ? 'grid grid-cols-2' : 'grid-cols-2'}
            >
              <Chat />
              {messagesSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  )
}
export default Main
