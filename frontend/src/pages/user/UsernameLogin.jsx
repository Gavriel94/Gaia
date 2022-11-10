import React, { useState } from 'react'
import { Header, Title, InputField, Button, LoadingSpinner, Sidebar } from '../../components'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import API from '../../API'
import { Navigate } from 'react-router-dom'
import { useStateContext } from '../../context/ContextProvider'

/**
 * Provides an interface for users to login if they have an account created with email and password
 * 
 * @returns {JSX.Element} - Login page 
 */

const UsernameLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submit, setSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordIcon, setShowPasswordIcon] = useState(<AiOutlineEye size={'26px'} />)
  const [showPasswordString, setShowPasswordString] = useState('Show password')
  const [userID, setUserID] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const { sessionToken, setSessionToken, setLoggedInProfile } = useStateContext()

  const handleUsername = (e) => {
    setUsername(e)
  }

  const handlePassword = (e) => {
    setPassword(e)
  }

  const handleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false)
      setShowPasswordString('Show password')
      setShowPasswordIcon(<AiOutlineEye size={'26px'} />)
    } else {
      setShowPassword(true)
      setShowPasswordString('Hide password')
      setShowPasswordIcon(<AiOutlineEyeInvisible size={'26px'} />)
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleNewToken = (e) => {
    console.log(e)
    setSessionToken(e)
  }

  async function handleSubmit() {
    let authUser = new FormData()
    authUser.append('username', username)
    authUser.append('password', password)
    try {
      setSubmit()
      var userID
      var sessionToken = await API.post("/profile/login", authUser, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // }).then(response => console.log(response))
      }).then(response => {
        sessionToken = response.data.token
        userID = response.data.user.id
        handleNewToken(response.data.token)
        setLoggedInProfile(response.data.user)
      })
      // setSessionToken(sessionToken)
      setUserID(userID)
      setSubmit(false)
      setLoginSuccess(true)
    } catch (err) {
      console.log(err.response.data)
    }
  }

  return (
    <>
        <div className='fixed justify-center m-auto left-0 right-0'>
            <Sidebar />
        </div>
        {
        submit && (
          <>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-40'>
              <div className={`${submitted && 'hidden'}`}>
                <LoadingSpinner />
              </div>
              <div className={`${submitted && 'hidden'} mt-10`}>
                <Title text={'Submitting'} size={'text-3xl'} />
              </div>
            </div>

          </>
        )
      }
      {
        loginSuccess && (
          <>
            {console.log(sessionToken)}
            <Navigate to={`/profiles/${userID}`} replace={true} />
          </>
        )
      }
      {
        <div>
          <div className='fixed justify-center m-auto left-0 right-0 '>
            <Header page={'login'} />
          </div>
          <div className='flex justify-center'>
            <form className='pt-20'>
              <Title text={'Login'} size={'text-6xl'} />
              <div className='mt-20'>
                <InputField
                  required={true}
                  type={'input'}
                  placeholder={'Username'}
                  defaultValue={''}
                  onChange={e => handleUsername(e.target.value)}
                  autoComplete={'username'}
                />
              </div>
              <div className='mt-5'>
                <InputField
                  required={true}
                  type={`${showPassword ? 'text' : 'password'}`}
                  placeholder={'Password'}
                  defaultValue={''}
                  onChange={e => handlePassword(e.target.value)}
                  autoComplete={'password'}
                />
              </div>
              <div className={`${password !== '' ? 'flex mt-3 justify-center' : 'hidden'}`}>
                <Button icon={showPasswordIcon} func={() => handleShowPassword()} label={showPasswordString} labelProps={'text-base pl-2'} />
              </div>
              {/* Temp. Refactor after proper username and password validation checks */}
              <div className={`${username.length > 0 && password.length > 0 ? 'flex justify-center pt-10' : 'hidden'}`}>
                <Button label={'Submit'} func={() => handleSubmit()} />
              </div>
            </form>
          </div>
        </div>
      }
    </>
  )
}

export default UsernameLogin