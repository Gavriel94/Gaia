import React, { useState } from 'react'
import { Header, Title, InputField, Button } from '../components'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import API from '../API'
import { Navigate } from 'react-router-dom'
import { useStateContext } from '../context/ContextProvider'

const EmailLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submit, setSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordIcon, setShowPasswordIcon] = useState(<AiOutlineEye size={'26px'} />)
  const [showPasswordString, setShowPasswordString] = useState('Show password')
  const [userID, setUserID] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const { sessionToken, setSessionToken } = useStateContext()

  const handleEmail = (e) => {
    setEmail(e)
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

  async function confirmSubmit() {
    setSubmit(true);
    await sleep(2000);
    setSubmitted(true)
    await sleep(1000);
    setSubmitted(false)
    setSubmit(false);
    setLoginSuccess(true)
  }

  const handleNewToken = (e) => {
    console.log(e)
    setSessionToken(e)
    console.log(e)
    console.log(sessionToken)
  }

  async function handleSubmit() {
    let authUser = new FormData()
    console.log(email)
    console.log(password)
    authUser.append('email', email)
    authUser.append('password', password)
    try {
      var userID
      var sessionToken = await API.post("/profile/login", authUser, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // }).then(response => console.log(response))
      }).then(response => {
        sessionToken = response.data.token
        console.log('in response', sessionToken)
        console.log(response)
        console.log(response.data)
        console.log(response.data.token)
        userID = response.data.user.id
        handleNewToken(response.data.token)
      })
      console.log(userID)
      // setSessionToken(sessionToken)
      setUserID(userID)
      confirmSubmit()
    } catch (err) {
      console.log(err.response.data)
    }
  }

  return (
    <>
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
                  placeholder={'Email'}
                  defaultValue={''}
                  onChange={e => handleEmail(e.target.value)}
                  autoComplete={'email'}
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
              {/* Temp. Refactor after proper email and password validation checks */}
              <div className={`${email.length > 0 && password.length > 0 ? 'flex justify-center pt-10' : 'hidden'}`}>
                <Button label={'Submit'} func={() => handleSubmit()} />
              </div>
            </form>
          </div>
        </div>
      }
    </>
  )
}

export default EmailLogin