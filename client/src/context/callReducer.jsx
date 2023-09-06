'use client'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  voiceCall: undefined,
  videoCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
}

export const callSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setVoiceCall: (state, action) => {
      return { ...state, voiceCall: action.payload }
    },
    setVideoCall: (state, action) => {
      return { ...state, videoCall: action.payload }
    },
    setIncomingVoiceCall: (state, action) => {
      return { ...state, incomingVoiceCall: action.payload }
    },
    setIncomingVideoCall: (state, action) => {
      return { ...state, incomingVideoCall: action.payload }
    },
    endCall: (state, action) => {
      return {
        ...state,
        voiceCall: undefined,
        videoCall: undefined,
        incomingVoiceCall: undefined,
        incomingVideoCall: undefined,
      }
    },
  },
})

export const {
  setVoiceCall,
  setVideoCall,
  setIncomingVoiceCall,
  setIncomingVideoCall,
  endCall,
} = callSlice.actions

export default callSlice.reducer
