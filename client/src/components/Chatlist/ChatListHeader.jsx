import React, { useState } from 'react'
import Avatar from '../common/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { setIsContacts, setUserInfo } from '@/context/userReducer'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { firebaseAuth } from '@/utils/FirebaseConfig'
import { socket } from '../Main'
import { BiArrowBack } from 'react-icons/bi'
import { setIsOpenChatList } from '@/context/responsiveReducer'

function ChatListHeader() {
  const router = useRouter()

  const dispatch = useDispatch()
  const user = useSelector((state) => state?.user?.userInfo)

  const [logout, setLogout] = useState(false)

  const handleLogout = () => {
    if (logout) {
      setLogout(false)
    } else {
      setLogout(true)
    }
  }

  const logingOut = () => {
    socket.emit('signout', user.id)
    dispatch(setUserInfo(undefined))
    signOut(firebaseAuth)
    router.push('/login')
  }

  const handleBackArrow = () => {
    dispatch(setIsOpenChatList(false))
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-[#0094c142]">
      <div className="flex items-center justify-center gap-3">
        <BiArrowBack
          className="responsive-one cursor-pointer"
          size={28}
          onClick={handleBackArrow}
        />
        <Avatar type={'sm'} image={user?.profileImage} />
      </div>
      <div className="flex gap-4 items-center justify-center">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl mt-[4px]"
          title="New Chat"
          onClick={() => dispatch(setIsContacts(false))}
        />
        <>
          <div className="relative">
            <BsThreeDotsVertical
              className="text-panel-header-icon cursor-pointer text-xl"
              onClick={handleLogout}
            />
            {logout && (
              <button
                className="text-black absolute text-sm right-3 bg-white px-2 py-2 rounded-lg font-bold flex justify-center items-center mt-3"
                onClick={logingOut}
              >
                Logout
              </button>
            )}
          </div>
        </>
      </div>
    </div>
  )
}

export default ChatListHeader
