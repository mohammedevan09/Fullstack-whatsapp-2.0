import { setMessageSearch } from '@/context/messageReducer'
import { calculateTime } from '@/utils/CalculateTime'
import React, { useEffect, useState } from 'react'
import { BiSearchAlt2 } from 'react-icons/bi'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'

function SearchMessages() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedMessages, setSearchedMessages] = useState([])

  const dispatch = useDispatch()
  const { currentChatUser } = useSelector((state) => state?.user)
  const { chatMessages } = useSelector((state) => state?.message)

  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(
        chatMessages?.filter(
          (message) =>
            message?.type === 'text' &&
            message?.message?.toLowerCase()?.includes(searchTerm?.toLowerCase())
        )
      )
    } else {
      setSearchedMessages([])
    }
  }, [searchTerm])

  return (
    <div className="border-l border-conversation-border flex w-full bg-conversation-panel-background flex-col z-10 max-h-screen responsive-two">
      <div className="px-4 h-16 py-5 flex gap-10 items-center bg-panel-header-background text-primary-strong">
        <IoClose
          className="text-2xl cursor-pointer text-icon-lighter"
          onClick={() => dispatch(setMessageSearch())}
        />
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="flex bg-[#1f242d] items-center gap-4 px-3 py-1 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="search messages"
                  className="text-xm bg-transparent text-white focus:outline-none w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search for messages with ${currentChatUser?.name}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message) => (
              <div className="flex cursor-pointer flex-col justify-center hover:bg-background-default-hover w-full px-5 border-b-[0.1px] text-white border-secondary py-5">
                <div>{calculateTime(message?.createdAt)}</div>
                <div className="text-icon-green">{message?.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchMessages
