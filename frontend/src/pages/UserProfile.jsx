import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../API'
import parser from 'html-react-parser'
import { Header, Sidebar, Title, Button } from '../components'
import { useStateContext } from '../context/ContextProvider'

/**
 * User profile
 * 
 * TODO: Eventually add a list of likes, posts etc
 */

const UserProfile = () => {
  const { darkMode } = useStateContext()
  const [profile, setProfile] = useState('')
  const { id } = useParams()

  useEffect(() => {
    const profileDetail = () => {
      API.get(`/profiles/${id}`).then((res) => {
        setProfile(res.data)
      }).catch(console.error)
    }
    profileDetail()
  }, [])

  return (
    <>
      <div className='fixed justify-center m-auto left-0 right-0'>
        <Header />
        <Sidebar />
      </div>
      <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
        <div className='pt-20 justify-center mx-autow-full'>
          {/* <Title text={`${article.title}`} size={'text-6xl'} /> */}
          <div className='flex justify-center flex-row'>
            <div className='pt-5'>
              <Title text={`${profile.username !== '' ? profile.username : profile.email}`} size={'text-6xl'} />
            </div>
          </div>
          <div className='pr-2 sm:pr-0 pl-2 md:pl-10 flex justify-center mt-20'>
              <img src={`${profile.profile_image}`} className='rounded-lg' alt="" height={'200px'} width={'200px'} />
            </div>
          <div className='mt-20' />
          <div className='flex justify-center content-center text-center self-center w-[400px] sm:w-[600px] xl:w-[1000px]'>
            {parser(String(profile.bio))}
          </div>
        </div>
      </div>
    </>
  )

  // return (
  //   <div className='dark:text-white'>UserProfile {id} {profile.email} {profile.username} {parser(profile.bio)} {<img src={profile.profile_image}></img>}</div>
  // )
}

export default UserProfile