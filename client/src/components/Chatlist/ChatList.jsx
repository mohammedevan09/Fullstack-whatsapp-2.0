import React, { useEffect, useState } from 'react'
import ChatListHeader from './ChatListHeader'
import SearchBar from './SearchBar'
import List from './List'
import { useSelector } from 'react-redux'
import ContactsList from './ContactsList'

function ChatList() {
  const [pageType, setPageType] = useState('all-contacts')
  const isContacts = useSelector((state) => state?.user?.isContacts)
  const { isOpenChatList } = useSelector((state) => state?.responsive)

  useEffect(() => {
    if (!isContacts) {
      setPageType('all-contacts')
    } else {
      setPageType('default')
    }
  }, [isContacts])

  return (
    <div
      className={`flex bg-[black] text-white flex-col max-h-screen z-20 w-screen lg:w-full md:visible ${
        isOpenChatList ? 'hidden' : 'visible'
      }`}
    >
      {pageType === 'default' && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === 'all-contacts' && <ContactsList />}
    </div>
  )
}

export default ChatList
