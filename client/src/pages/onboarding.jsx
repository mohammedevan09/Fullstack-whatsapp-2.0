import Avatar from '@/components/common/Avatar'
import Input from '@/components/common/Input'
import { setNewUser, setUserInfo } from '@/context/userReducer'
import { ONBOARD_USER_ROUTE } from '@/utils/ApiRoutes'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

function onboarding() {
  const router = useRouter()
  const dispatch = useDispatch()

  const user = useSelector((state) => state?.user?.userInfo)
  const [name, setName] = useState(user?.name || '')
  const [about, setAbout] = useState('')
  const [image, setImage] = useState('/default_avatar.png')

  useEffect(() => {
    if (!setNewUser && !user?.email) {
      router.push('/login')
    }
    if (user?.id) {
      router.push('/')
    }
  }, [user, router])

  const onBoardUserHandler = async () => {
    if (validateDetails) {
      const email = user.email
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        })
        if (data.status) {
          dispatch(setNewUser(false))
          dispatch(
            setUserInfo({
              id: data?.data?.id,
              name,
              email,
              profileImage: image,
              status: about,
            })
          )
          router.push('/')
        }
      } catch (error) {
        console.log(error)
        toast.error('There is a server error or the image is to large!')
      }
    }
  }

  const validateDetails = () => {
    if (name.length < 3) {
      return false
    }
    return true
  }

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white md:flex grid items-center justify-center md:gap-40 gap-14 my-4">
      <div className="grid items-center justify-center gap-2">
        <Image
          src={'/whatsappNew.png'}
          alt="whatsapp"
          height={250}
          width={250}
          className="mx-auto"
        />
        <span className="text-7xl">WhatsApp</span>
      </div>
      <div>
        <h2 className="text-3xl text-center mx-auto">Create your profile</h2>
        <div className="mt-5">
          <Avatar type={'xl'} image={image} setImage={setImage} />
        </div>
        <div className="flex gap-6 mt-6 justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-6">
            <Input name="Display Name" state={name} setState={setName} label />
            <Input name="About" state={about} setState={setAbout} label />
            <div
              className="flex items-center justify-center"
              onClick={onBoardUserHandler}
            >
              <button className="flex items-center justify-center gap-7 text-xl bg-[#00bdbf] text-black p-3 rounded-full font-bold hover:bg-white">
                Create Profile
              </button>
            </div>
          </div>
        </div>
        {/* <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div> */}
      </div>
    </div>
  )
}

export default onboarding
