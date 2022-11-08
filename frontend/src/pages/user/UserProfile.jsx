import React, { useEffect, useState } from 'react'
import API from '../../API'
import parser from 'html-react-parser'
import { Header, Sidebar, Title, Button, LogoutButton, LoginButton } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { useParams } from 'react-router-dom'

/**
 * Page which displays information about the user
 * Allows a logged in user access to their personal EditProfile page
 * 
 * @returns {JSX.Element} - Profile details page
 * 
 */

/**
 * 
 * TODO: Add a list of likes, posts etc
 */

const UserProfile = () => {
  const { loggedInProfile } = useStateContext()
  const { id } = useParams()
  const [profileData, setProfileData] = useState({
    id: '',
    email: '',
    username: '',
    bio: '',
    profile_image: '',
    display_name: ''
  })

  useEffect(() => {
    const profileDetail = () => {
      API.get(`/profile/user/${id}/`)
        .then((res) => {
          console.log(res)
          console.log(res.data.display_name)
          setProfileData(res.data)
          console.log('2nd', profileData.display_name)
          // if (res.data.displayName.length > 20) {
          //   setDisplayName(res.data.display_name.slice(0, 20) + '...')
          // } else {
          //   setDisplayName(res.data.display_name)
          // }
        }).catch(console.err)
    }
    profileDetail()
  }, [id])


  return (
    <>
      <div className='fixed justify-center m-auto left-0 right-0'>
        <Header page={'user'} />
        <Sidebar />
      </div>
      <div className='pt-20 flex justify-center dark:text-white'>
        {/* If you're not the logged in profile */}
          <Title text={profileData.display_name} size='text-6xl' />
      </div>
      <div className='mt-10 flex justify-center'>
        <img src={profileData.profile_image} className='rounded-lg' alt='' height='200px' width='200px' />
      </div>
      <div className='flex justify-center mt-10 text-center dark:text-white'>
        {parser(String(profileData.bio))}
      </div>
      <div className={`${id === loggedInProfile.id ? 'flex justify-center mt-10' : 'hidden'}`}>
        {/* If logged in profile ID is equal to router URL ID && sessionToken then show */}
        <div className={`px-2 ${profileData.id === loggedInProfile.id ? 'block px-2' : 'hidden'}`}>
          <Link to={'/profiles/edit'} replace={true}>
            <Button icon={<AiOutlineEdit size={'26px'} />} label={'Edit profile'} labelProps={'text-sm pt-1 pl-2'} />
          </Link>
        </div>
        <div className={`px-2 ${profileData.id === loggedInProfile.id ? 'block px-2' : 'hidden'}`}>
          <LogoutButton />
        </div>
      </div>
      <div className={`${profileData.id !== loggedInProfile.id ? 'block' : 'hidden'}`}>
        <Button label={'Tip'} />
      </div>
    </>

  )
}

export default UserProfile