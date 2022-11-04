import React, { useEffect, useState } from 'react'
import API from '../../API'
import parser from 'html-react-parser'
import { Header, Sidebar, Title, Button, LogoutButton } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Link } from 'react-router-dom'
import { AiOutlineEdit } from 'react-icons/ai'

/**
 * Page which displays information about the user
 * Allows a logged in user access to their personal EditProfile page
 * 
 * @returns {JSX.Element} - Profile details page
 * 
 */

/**
 * 
 * TODO: EAdd a list of likes, posts etc
 */

const UserProfile = () => {
  const { darkMode } = useStateContext()
  const { sessionToken, loggedInProfile, setLoggedInProfile, displayAdaHandle, adaHandleSelected, walletUser } = useStateContext()
  const [trimmedAddress, setTrimmedAddress] = useState('')

  useEffect(() => {
    const profileDetail = () => {
      console.log(sessionToken)
      API.get(`/profile/user`, {
        headers: {
          'Authorization': `Token ${sessionToken}`
        }
      }
      ).then((res) => {
        // setProfile(res.data)
        setLoggedInProfile(res.data)
        if (walletUser) {
          trimAddress()
        }
      }).catch(console.err)
    }

    profileDetail()
  }, [])

  const trimAddress = () => {
    setTrimmedAddress(loggedInProfile.username.slice(0, 20) + '...')
  }

  return (
    <>
      <div className='fixed justify-center m-auto left-0 right-0'>
        <Header page={'user'} />
        <Sidebar />
      </div>
      <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
        <div className='pt-20 justify-center mx-autow-full'>
          {/* <Title text={`${article.title}`} size={'text-6xl'} /> */}
          <div className='flex justify-center flex-row'>
            <div className={`${walletUser && 'hidden'} pt-5`}>
              <Title text={`${loggedInProfile.username}`} size={'text-6xl'} />
            </div>
            <div className={`${!walletUser && 'hidden'} pt-5`}>
              <Title text={`${displayAdaHandle ? adaHandleSelected : trimmedAddress}`} size={'text-6xl'} />
              <div className={`${displayAdaHandle ? 'block' : 'hidden'}`}>
                <Title text={trimmedAddress} />
              </div>
            </div>
          </div>
          <div className='pr-2 sm:pr-0 pl-2 md:pl-10 flex justify-center mt-20'>
            <img src={`${loggedInProfile.profile_image}`} className='rounded-lg' alt="" height={'200px'} width={'200px'} />
          </div>
          <div className='mt-20' />
          <div className='flex justify-center content-center text-center self-center w-[400px] sm:w-[600px] xl:w-[1000px]'>
            {parser(String(loggedInProfile.bio))}
            {console.log(loggedInProfile)}
          </div>
        </div>
      </div>
      <div className='flex justify-center space-x-4 mt-10'>
        <Link to={'/profiles/edit'}>
          <Button icon={<AiOutlineEdit size={'26px'} />} label={'Edit profile'} labelProps={'text-sm pt-1 pl-2'} />
        </Link>
        <LogoutButton />
      </div>
    </>
  )
}

export default UserProfile