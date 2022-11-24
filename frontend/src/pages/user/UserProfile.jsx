import React, { useEffect, useState } from 'react'
import API from '../../API'
import parser from 'html-react-parser'
import { Header, SidebarV2, Title, Button, LogoutButton, ProfileArticleBar, ArticleLoading, ProfileArticle } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Link, Navigate } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { BiLike, BiDislike } from 'react-icons/bi'
import { BsPen } from 'react-icons/bs'

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
    reacted: [],
  })
  const [notLoaded, setNotLoaded] = useState(false)
  const [showArticles, setShowArticles] = useState([])
  const [title, setTitle] = useState('Articles Written')

  useEffect(() => {
    const profileDetail = () => {
      API.get(`/profile/user/${id}/`)
        .then((res) => {
          setProfileData(res.data)
          setShowArticles(res.data.authored)
          console.log(res.data)
        }).catch(err => {
          console.log(err.response)
          setNotLoaded(true)
        })
    }
    profileDetail()
  }, [id])

  const sortByWritten = () => {
    setTitle('Articles Written')
    setShowArticles(profileData.authored)
  }

  const sortByLiked = () => {
    setTitle('Articles Liked')
    const liked = []
    for(var i = 0; i < profileData.reacted.length; i++) {
      if(profileData.reacted[i].sentiment === 1) {
        liked.push(profileData.reacted[i].article_id)
      } 
    }
    setShowArticles(liked)
  }

  const sortByDisliked = () => {
    const disliked = []
    setTitle('Articles Disliked')
    for(var i = 0; i < profileData.reacted.length; i++) {
      if(profileData.reacted[i].sentiment === 2) {
        disliked.push(profileData.reacted[i].article_id)
      } 
    }
    setShowArticles(disliked)
  }

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
          {/* <ProfileArticleBar header={'Articles Written'} articles={profileData.authored} /> */}
          <div>
            <div className={`flex invisible xl:visible items-end px-10 flex-col h-full`}>
                <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
                    <div className='py-4' />
                    <div className='w-[300px] h-[10px] justify-center py-10'>
                        <Title text={title} size={'text-3xl'} />
                    </div>
                    {showArticles.map((article) => (
                        <div className='pt-4 grid grid-cols-1 gap-y-4' key={article.id}>
                            <ProfileArticle
                                id={article.id}
                                title={article.title}
                                image={article.preview_image}
                                imageHeight={80}
                                imageWidth={80}
                            />
                        </div>
                    ))}

                    <div className='flex justify-center space-x-2 mt-2'>
                        <Button icon={<BsPen size={'26px'} />} func={() => sortByWritten()}/>
                        <Button icon={<BiLike size={'26px'} />} func={() => sortByLiked()}/>
                        <Button icon={<BiDislike size={'26px'} />} func={() => sortByDisliked()}/>
                    </div>

                </div>
            </div>
        </div>
          {/* <ProfileArticleBar header={'Articles Written'} articles={showArticles} /> */}
          <Header page={'user'} />
          <SidebarV2 />
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