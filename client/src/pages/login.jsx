import { setNewUser, setUserInfo } from '@/context/userReducer'
import { CHECK_USER_ROUTE } from '@/utils/ApiRoutes'
import { firebaseAuth } from '@/utils/FirebaseConfig'
import axios from 'axios'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux'

function login() {
  const router = useRouter()
  const dispatch = useDispatch()

  const user = useSelector((state) => state?.user?.userInfo)
  useEffect(() => {
    if (user?.id) {
      router.push('/')
    }
  }, [user])

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider)

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email })

        if (!data?.status) {
          dispatch(setNewUser(true))
          dispatch(setUserInfo({ name, email, profileImage, status: '' }))
          router.push('/onboarding')
        } else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            status,
          } = data.data
          dispatch(setUserInfo({ id, name, email, profileImage, status }))
          router.push('/')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className=" grid items-center justify-center gap-2 text-white">
        <Image
          src="/whatsappNew.png"
          alt="Whatsapp"
          height={300}
          width={300}
          className="mx-auto"
        />
        <span className="md:text-7xl text-5xl mx-auto">WhatsApp</span>
      </div>
      <button
        className="flex items-center justify-center md:gap-7 gap-3 bg-search-input-container-background md:p-5 p-3 rounded-full"
        onClick={handleLogin}
      >
        <FcGoogle className="md:text-4xl text-3xl" />
        <span className="text-black text-2xl font-bold">Login with google</span>
      </button>
    </div>
  )
}

export default login
