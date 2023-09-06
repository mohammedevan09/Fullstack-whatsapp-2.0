import { setOnlineUsers, setUserContacts } from '@/context/userReducer'
import { GET_INITIAL_CONTACTS_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatLIstItem from './ChatLIstItem'

function List() {
  const dispatch = useDispatch()
  const { userInfo, filteredContacts } = useSelector((state) => state?.user)
  const { chatMessages } = useSelector((state) => state?.message)

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo?.id}`)

        dispatch(setOnlineUsers(onlineUsers))
        dispatch(setUserContacts(users))
        // console.log(users, onlineUsers)
      } catch (error) {
        console.log(error)
      }
    }
    getContacts()
  }, [userInfo, chatMessages])

  const { userContacts } = useSelector((state) => state?.user)
  // console.log(userContacts)

  return (
    <div className="bg-search-input-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts?.length > 0
        ? filteredContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact?.id} />
          ))
        : userContacts?.map((contact) => (
            <ChatLIstItem data={contact} key={contact?.id} />
          ))}
    </div>
  )
}

export default List
