'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpenChatList: false,
  isOpenSearchMessage: false,
}

export const responsiveSlice = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    setIsOpenChatList: (state, action) => {
      return { ...state, isOpenChatList: action.payload }
    },
    setIsOpenSearchMessage: (state, action) => {
      return { ...state, isOpenSearchMessage: action.payload }
    },
  },
})

export const { setIsOpenChatList, setIsOpenSearchMessage } =
  responsiveSlice.actions

export default responsiveSlice.reducer
