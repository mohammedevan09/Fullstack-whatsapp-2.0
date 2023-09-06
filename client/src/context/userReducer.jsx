'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  newUser: false,
  userInfo: {},
  allUsers: {},
  isContacts: false,
  currentChatUser: undefined,
  userContacts: [],
  onlineUsers: [],
  filteredContacts: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNewUser: (state, action) => {
      return { ...state, newUser: action.payload }
    },
    setUserInfo: (state, action) => {
      return { ...state, userInfo: action.payload }
    },
    setIsContacts: (state, action) => {
      return { ...state, isContacts: action.payload }
    },
    setAllUsers: (state, action) => {
      return { ...state, allUsers: action.payload }
    },
    setCurrentChatUser: (state, action) => {
      return { ...state, currentChatUser: action.payload }
    },
    setUserContacts: (state, action) => {
      return { ...state, userContacts: action.payload }
    },
    setOnlineUsers: (state, action) => {
      return { ...state, onlineUsers: action.payload }
    },
    setFilterContacts: (state, action) => {
      return {
        ...state,
        filteredContacts: state?.userContacts?.filter((contact) =>
          contact?.name?.toLowerCase().includes(action.payload)
        ),
      }
    },
  },
})

export const {
  setNewUser,
  setUserInfo,
  setIsContacts,
  setAllUsers,
  setCurrentChatUser,
  setUserContacts,
  setOnlineUsers,
  setFilterContacts,
} = userSlice.actions

export default userSlice.reducer
