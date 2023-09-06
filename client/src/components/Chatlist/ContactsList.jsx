import { setAllUsers, setIsContacts } from '@/context/userReducer'
import { GET_ALL_USERS } from '@/utils/ApiRoutes'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import ChatLIstItem from './ChatLIstItem'

function ContactsList() {
  const dispatch = useDispatch()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchContacts, setSearchContacts] = useState('')

  useEffect(() => {
    async function getAllUsers() {
      try {
        const { data } = await axios.get(GET_ALL_USERS)
        dispatch(setAllUsers(data?.users))
        setSearchContacts(data?.users)
      } catch (error) {
        console.log(error)
      }
    }
    getAllUsers()
  }, [])

  const allUsers = useSelector((state) => state?.user?.allUsers)

  useEffect(() => {
    if (searchTerm?.length) {
      const filteredData = {}
      Object.keys(allUsers).forEach((key) => {
        filteredData[key] = allUsers[key].filter((obj) =>
          obj?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
      setSearchContacts(filteredData)
    } else {
      setSearchContacts(allUsers)
    }
  }, [searchTerm])

  // console.log(searchTerm.length)

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-end px-3 py-4 bg-[#0094c142]">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="text-xl cursor-pointer"
            onClick={() => dispatch(setIsContacts(true))}
          />
          <span>New Chat</span>
        </div>
      </div>
      <div className="h-full flex-auto overflow-auto custom-scrollbar pt-4">
        <div className="flex py-3 items-center gap-3 h-1">
          <div className="flex bg-panel-header-background items-center gap-4 px-3 py-1 rounded-lg flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search contacts"
                className="text-xm bg-transparent text-white focus:outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              {!searchTerm?.length > 0 && (
                <div className="pl-10 text-teal-light py-5">
                  {initialLetter}
                </div>
              )}
              {userList?.map((contact) => {
                return (
                  <ChatLIstItem
                    data={contact}
                    inContactPage={true}
                    key={contact?.id}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactsList
