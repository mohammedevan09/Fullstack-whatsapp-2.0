import React, { useState } from 'react'
import Avatar from '../common/Avatar'
import { MdCall } from 'react-icons/md'
import { IoVideocam } from 'react-icons/io5'
import { BiSearchAlt2 } from 'react-icons/bi'
import { RiMenuFoldFill } from 'react-icons/ri'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import { setMessageSearch } from '@/context/messageReducer'
import { setVideoCall, setVoiceCall } from '@/context/callReducer'
import { setCurrentChatUser, setIsContacts } from '@/context/userReducer'
import { setIsOpenChatList } from '@/context/responsiveReducer'

function ChatHeader() {
  const dispatch = useDispatch()

  const { currentChatUser, userInfo, onlineUsers } = useSelector(
    (state) => state?.user
  )

  const [showExit, setShowExit] = useState(false)

  const handleVoiceCall = () => {
    dispatch(
      setVoiceCall({
        ...currentChatUser,
        type: 'out-going',
        callType: 'voice',
        roomId: Date.now(),
      })
    )
  }

  const handleVideoCall = () => {
    dispatch(
      setVideoCall({
        ...currentChatUser,
        type: 'out-going',
        callType: 'video',
        roomId: Date.now(),
      })
    )
  }

  const handleShowExit = () => {
    if (showExit) {
      setShowExit(false)
    } else {
      setShowExit(true)
    }
  }

  const handleChatMenu = () => {
    dispatch(setIsOpenChatList(true))
    dispatch(setIsContacts(false))
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center md:gap-6 sm:gap-3 gap-2">
        <div className="flex items-center justify-center gap-3 relative">
          <RiMenuFoldFill
            color="white"
            size={28}
            className="responsive-one cursor-pointer"
            onClick={handleChatMenu}
          />
          <Avatar type={'sm'} image={currentChatUser?.profilePicture} />
          {onlineUsers.includes(currentChatUser?.id) && (
            <span className="w-3 h-3 rounded-full bg-lime-400 absolute bottom-0 right-0 border-2 border-black"></span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="text-primary-strong font-bold">
            {currentChatUser?.name === userInfo?.name
              ? 'You'
              : currentChatUser?.name.substr(0, 11)}
          </span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser?.id) ? 'online' : 'offline'}
          </span>
        </div>
      </div>
      <div className="flex md:gap-6 sm:gap-4 gap-3">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch(setMessageSearch())}
        />
        <div className="relative">
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            onClick={handleShowExit}
          />
          {showExit && (
            <button
              className="text-black absolute text-sm right-3 flex bg-white px-2 py-1 rounded-lg font-bold mt-3"
              onClick={() => dispatch(setCurrentChatUser(undefined))}
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
