import React, { useEffect, useState } from 'react'
import Title from '../misc/Title'
import { Link } from 'react-router-dom'
import API from '../../API'
import TipButton from '../buttons/TipButton'

/**
 * 
 * @param {String} authorID - ID of the Author  
 * @param {Boolean} showTipButton - Displays the tip button if the reader is not using the same wallet as the author
 * @returns Link showing display name, profile picture and a tip button of article author
 */

const AuthorBar = ({ authorID, showTipButton }) => {
  const [authorProfile, setAuthorProfile] = useState(undefined)

  useEffect(() => {
    const authorDetail = async () => {
      await API.get(`/profile/user/author/${authorID}`)
        .then((res) => {
          setAuthorProfile(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    authorDetail()
  }, [authorID])

  const checkProfileName = () => {
    if(authorProfile?.profile_name === '') {
      setAuthorProfile({
        id: authorProfile.id,
        username: authorProfile.username,
        profile_name: authorProfile.username.slice(0,6) + '...',
        profile_image: authorProfile.profile_image
      })
    }

    return (
      <Title text={authorProfile?.profile_name} size={'text-3xl'} lengthLimit={true} hover={true} />
    )
  }

  return (
    <div>
      <div className={`flex invisible xl:visible items-end px-10 flex-col`}>
        <div className='duration-300 bg-opacity-5 dark:bg-opacity-5 overflow-auto fixed'>
          <div className='my-20' />
          <Title text={'Author'} size={'text-3xl'} hover={true}/>
          <div className='p-4 mt-4'>
            <Link to={`/profiles/${authorID}`} style={{ textDecoration: 'none' }}>
              <div className='grid grid-cols-1 gap-y-4 content-center justify-center text-center m-auto'>
                <div>
                {checkProfileName()}
                </div>
                <div className='flex justify-center'>
                  <img src={authorProfile?.profile_image} alt={'Authors profile'} width={120} />
                </div>
              </div>
            </Link>
          </div>
          <div className={`${showTipButton ? 'flex justify-center mb-2' : 'hidden'}`}>
            <TipButton authorUsername={authorProfile?.username}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthorBar

