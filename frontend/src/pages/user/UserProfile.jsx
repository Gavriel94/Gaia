import React, { useEffect, useState } from 'react'
import API from '../../API'
import parser from 'html-react-parser'
import { Header, SidebarV2, Title, Button, LogoutButton, ProfileArticleBar, ArticleLoading } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Link, Navigate } from 'react-router-dom'
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
 * TODO: Recreate a MiniArticle component for UserProfile page
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
    authored: [],
  })
  const [notLoaded, setNotLoaded] = useState(false)

  useEffect(() => {
    const profileDetail = () => {
      API.get(`/profile/user/${id}/`)
        .then((res) => {
          setProfileData(res.data)
          console.log(res.data)
        }).catch(err => {
          console.log(err.response)
          setNotLoaded(true)
        })
    }
    profileDetail()
  }, [id])
  if (profileData.id === '') {
    return (
      <>
        <ArticleLoading pageTitle={'Loading'} />
        {
          notLoaded && (
            <Navigate to={'not-found'} replace={true} />
          )
        }
      </>
    )
  }
  else {
    return (
      <>
        <div className='fixed justify-center m-auto left-0 right-0'>
          <SidebarV2 />
          <ProfileArticleBar header={'Articles Written'} articles={profileData.authored} />
          <Header page={'user'} />
        </div>
        <div className={`${profileData.profile_name === null ? 'block' : 'hidden'} pt-20 flex justify-center dark:text-white`}>
          <Title text={profileData.username} lengthLimit={true} />
        </div>
        <div className={`${profileData.profile_name === null ? 'hidden' : 'block'} pt-20 flex justify-center dark:text-white`}>
          <Title text={profileData.profile_name} size={'text-3xl'} />
        </div>


        <div className='grid grid-cols-1'>

          <div className='mt-10 flex justify-center'>
            <img src={profileData.profile_image} className='rounded-lg' alt='' height='200px' width='200px' />
          </div>
          <div className={`${profileData.bio === null ? 'hidden' : 'justify-center mt-10 w-[200px] m-auto dark:text-white'}`}>
            {parser(String(profileData.bio))}
          </div>
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
}

export default UserProfile