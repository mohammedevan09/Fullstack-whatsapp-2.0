'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  chatMessages: [],
  messagesSearch: false,
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setChatMessages: (state, action) => {
      return { ...state, chatMessages: action.payload }
    },
    addMessage: (state, action) => {
      return { ...state, chatMessages: [...state.chatMessages, action.payload] }
    },
    setMessageSearch: (state, action) => {
      return { ...state, messagesSearch: !state.messagesSearch }
    },
  },
})

export const { setChatMessages, addMessage, setMessageSearch } =
  messageSlice.actions

export default messageSlice.reducer
