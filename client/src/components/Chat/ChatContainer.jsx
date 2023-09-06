import { calculateTime } from '@/utils/CalculateTime'
import React from 'react'
import { useSelector } from 'react-redux'
import MessageStatus from '../common/MessageStatus'
import ScrollToBottom from 'react-scroll-to-bottom'
import { HOST } from '@/utils/ApiRoutes'
import ImageMessage from './ImageMessage'

function ChatContainer() {
  const { currentChatUser, userInfo } = useSelector((state) => state?.user)
  const { chatMessages } = useSelector((state) => state?.message)

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar pt-3 px-3">
      <div className="for-image bg-fixed">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto bg-[#032332db]">
            <ScrollToBottom>
              {chatMessages?.map((message, i) => {
                return (
                  <div
                    key={i}
                    className={`${
                      message?.senderId === currentChatUser?.id
                        ? 'justify-start'
                        : 'justify-end'
                    } flex self-end my-1`}
                  >
                    {message?.type === 'text' && (
                      <div
                        className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-center max-w-[45%] ${
                          message?.senderId === currentChatUser?.id
                            ? 'bg-incoming-background'
                            : 'bg-outgoing-background'
                        }`}
                      >
                        <span className="break-word max-w-[75%]">
                          {message?.message}
                        </span>
                        <div className="flex gap-1 items-end">
                          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                            {calculateTime(message?.createdAt)}
                          </span>
                          <span>
                            {message?.senderId === userInfo?.id && (
                              <MessageStatus
                                messageStatus={message?.messageStatus}
                              />
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {message?.type === 'image' && (
                      <ImageMessage message={message} />
                    )}
                  </div>
                )
              })}
            </ScrollToBottom>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatContainer
