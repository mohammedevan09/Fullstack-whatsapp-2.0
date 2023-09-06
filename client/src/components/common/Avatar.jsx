import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaCamera } from 'react-icons/fa'
import ContextMenu from './ContextMenu'
import PhotoPicker from './PhotoPicker'
import PhotoLibrary from './PhotoLibrary'

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false)
  const [grabPhoto, setGrabPhoto] = useState(false)
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false)
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  })
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false)

  const showContextMenu = (e) => {
    e.preventDefault()
    setContextMenuCordinates({ x: e.pageX, y: e.pageY })
    setIsContextMenuVisible(true)
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

  const contextMenuOptions = [
    // { name: 'Take Photo', callback: () => {} },
    {
      name: 'Choose From Library',
      callback: () => {
        setShowPhotoLibrary(true)
      },
    },
    {
      name: 'Upload Photo',
      callback: () => {
        setGrabPhoto(true)
      },
    },
    {
      name: 'Remove Photo',
      callback: () => {
        setImage('/default_avatar.png')
      },
    },
  ]

  const photoPickerChange = async (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    const data = document.createElement('img')
    reader.onload = function (event) {
      data.src = event.target.result
      data.setAttribute('data-src', event.target.result)
    }
    reader.readAsDataURL(file)
    setTimeout(() => {
      setImage(data.src)
    }, 100)
  }
  return (
    <>
      <div className="flex items-center justify-center">
        {type === 'sm' && (
          <div className="relative h-10 w-10">
            <Image
              src={image}
              alt="avatar"
              className="object-cover rounded-full border-none"
              fill
            />
          </div>
        )}
        {type === 'lg' && (
          <div className="relative h-14 w-14">
            <Image
              src={image}
              alt="avatar"
              className="object-cover rounded-full border-none"
              fill
            />
          </div>
        )}
        {type === 'xl' && (
          <div
            className="relative cursor-pointer z-0 transition-all duration-1000"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => showContextMenu(e)}
          >
            <div
              className={`bg-photopicker-overlay-background h-60 w-60 flex items-center rounded-full justify-center flex-col text-center gap-2 transition-all duration-1000  ${
                hover ? 'visible' : 'hidden'
              }`}
              onClick={(e) => showContextMenu(e)}
              id="context-opener"
            >
              <Image
                onClick={(e) => showContextMenu(e)}
                src={'/camera.png'}
                alt="camera"
                className="border-none"
                width={50}
                height={50}
              />
              <h4>Change Profile</h4>
            </div>
            <div
              className={`h-60 w-60 transition-all duration-1000 ${
                !hover ? 'visible' : 'hidden'
              }`}
              onClick={(e) => showContextMenu(e)}
            >
              <Image
                src={image}
                alt="avatar"
                className="object-cover rounded-full p-2"
                fill
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
    </>
  )
}

export default Avatar
