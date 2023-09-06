import React from 'react'
import ChatHeader from './ChatHeader'
import ChatContainer from './ChatContainer'
import MessageBar from './MessageBar'

function Chat() {
  return (
    <div className="for-image">
      <div className="border-conversation-border bg-[#032332db] flex flex-col h-[100vh] z-10 w-full responsive-container">
        <ChatHeader />
        <ChatContainer />
        <MessageBar />
      </div>
    </div>
  )
}

export default Chat
