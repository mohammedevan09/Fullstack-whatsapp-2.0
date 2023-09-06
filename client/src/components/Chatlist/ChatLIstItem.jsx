import React from 'react'
import Avatar from '../common/Avatar'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentChatUser, setIsContacts } from '@/context/userReducer'
import { calculateTime } from '@/utils/CalculateTime'
import MessageStatus from '../common/MessageStatus'
import { FaCamera, FaImage } from 'react-icons/fa'
import {
  setIsOpenChatList,
  setIsOpenSearchMessage,
} from '@/context/responsiveReducer'

function ChatLIstItem({ data }) {
  const dispatch = useDispatch()

  const { userInfo, isContacts, onlineUsers } = useSelector(
    (state) => state?.user
  )

  const handleContactClick = () => {
    dispatch(setCurrentChatUser(data))

    dispatch(setIsOpenChatList(false))
    dispatch(setIsOpenSearchMessage(false))

    if (!isContacts) {
      dispatch(setIsContacts(true))
    }
  }
  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-background-default-hover`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <div className="relative">
          <Avatar type={'lg'} image={data?.profilePicture} />
          {onlineUsers.includes(data?.id) && (
            <span className="w-3 h-3 rounded-full bg-lime-400 absolute bottom-0 right-0 border-2 border-black"></span>
          )}
        </div>
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full border-b border-[#0094c142]">
        <div className="flex justify-between">
          <div>
            <span className="text-white">
              {data?.name === userInfo?.name ? 'You' : data?.name}
            </span>
          </div>
          {isContacts && (
            <div>
              <span
                className={`${
                  !data?.totalUnreadMessages > 0
                    ? 'text-secondary'
                    : 'text-icon-green'
                } text-xs`}
              >
                {calculateTime(data?.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {!isContacts ? (
                data?.about || '\u00A0'
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data?.senderId === userInfo?.id && (
                    <MessageStatus messageStatus={data?.messageStatus} />
                  )}
                  {data?.type === 'text' && (
                    <span className="truncate">{data?.message}</span>
                  )}
                  {data?.type === 'image' && (
                    <span className="flex gap-1 items-center">
                      <FaCamera />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data?.totalUnreadMessages > 0 && (
              <span className="px-[6px] bg-icon-green rounded-full text-sm">
                {data?.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatLIstItem
