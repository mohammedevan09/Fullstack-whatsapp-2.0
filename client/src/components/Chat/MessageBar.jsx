import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { FaMicrophone } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import { MdSend } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../Main'
import { addMessage } from '@/context/messageReducer'
import EmojiPicker from 'emoji-picker-react'
import PhotoPicker from '../common/PhotoPicker'
import dynamic from 'next/dynamic'

const CaptureAudio = dynamic(() => import('../common/CaptureAudio'), {
  ssr: false,
})

function MessageBar() {
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [showAudioRecorder, setShowAudioRecorder] = useState(false)

  const emojiPickerRef = useRef(null)

  const dispatch = useDispatch()
  const { userInfo, currentChatUser } = useSelector((state) => state?.user)

  const sendMessage = async () => {
    try {
      if (message !== '') {
        axios
          .post(ADD_MESSAGE_ROUTE, {
            to: currentChatUser?.id,
            from: userInfo?.id,
            message,
          })
          .then(({ data }) => {
            // console.log(data)
          })

        socket.emit('send-msg', {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message,
        })
        dispatch(
          addMessage({
            id: Date.now().toString(),
            senderId: userInfo?.id,
            recieverId: currentChatUser?.id,
            message,
            type: 'text',
            messageStatus: 'delivered',
            createdAt: Date.now(),
          })
        )
        // await socket.on('msg-receive', (data) => {
        //   console.log(data)
        //   console.log('data::', data)
        // })
        setMessage('')
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== 'emoji-open') {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(e.target)
        ) {
          setShowEmojiPicker(false)
        }
      }
    }
    document.addEventListener('click', handleOutsideClick)

    return () => document.removeEventListener('click', handleOutsideClick)
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }
  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev)
  }
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => (prev += emoji?.emoji))
  }

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById('photo-picker')
      data.click()
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false)
        }, 1000)
      }
    }
  }, [grabPhoto])

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      })
      if (response.status === 201) {
        socket.emit('send-msg', {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response?.data?.message?.message,
        })
        dispatch(addMessage(response?.data?.message))
        // console.log(response?.data?.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="h-20 bg-panel-header-background px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              className="text-xl cursor-pointer text-panel-header-icon"
              title="Emoji"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                className="absolute bottom-24 left-16 z-40"
                ref={emojiPickerRef}
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
              </div>
            )}
            <ImAttachment
              className="text-xl cursor-pointer text-panel-header-icon"
              title="Attach File"
              onClick={() => setGrabPhoto(true)}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              placeholder="Type a message"
              className="text-sm bg-input-background focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            <button>
              {/* {message?.length ? ( */}
              <MdSend
                className="text-xl cursor-pointer text-panel-header-icon"
                title="Send message"
                onClick={sendMessage}
                size={28}
              />
              {/* ) : (
                <FaMicrophone
                  className="text-xl cursor-pointer text-panel-header-icon"
                  title="Record"
                  onClick={() => setShowAudioRecorder((prev) => !prev)}
                />
              )} */}
            </button>
          </div>
        </>
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  )
}

export default MessageBar
