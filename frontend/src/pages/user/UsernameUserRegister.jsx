import React, { useState } from 'react'
import { Header, InputField, Title, LoadingSpinner, Button, Editor } from '../../components'
import { BsCardImage } from 'react-icons/bs'
import { IoWarningOutline } from 'react-icons/io5'
import { useStateContext } from '../../context/ContextProvider'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import API from '../../API'
import { Link, Navigate } from 'react-router-dom'

/**
 * Provides an interface for the user to create an account with email and password
 * 
 * @returns {JSX.Element} - Page for user to create an account
 */

/**
 * TODO: Set up 'forgot password' functionality 
 * TODO: Password strength checking
 * TODO: Limit num of login attempts and link to the 'forgot password' functionality 
 */

const UsernameUserRegister = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submit, setSubmit] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordIcon, setShowPasswordIcon] = useState(<AiOutlineEye size={'26px'} />)
    const [showPasswordString, setShowPasswordString] = useState('Show password')

    // password validity checks
    const [containsUL, setContainsUL] = useState(false) // uppercase letter
    const [containsLL, setContainsLL] = useState(false) // lowercase letter
    const [containsN, setContainsN] = useState(false) // number
    const [containsSC, setContainsSC] = useState(false) // special character
    const [contains8C, setContains8C] = useState(false) // min 8 characters
    const [passwordMatch, setPasswordMatch] = useState(false) // passwords match

    // checks all validations are true
    const [allValid, setAllValid] = useState(false)

    const [username, setUsername] = useState('')


    const [newUserID, setNewUserID] = useState('')
    const [newProfileSuccess, setNewProfileSuccess] = useState(false)

    const { sessionToken, setSessionToken } = useStateContext()

    const handleUsername = (e) => {
        setUsername(e)
    }

    const handleEmail = (e) => {
        setEmail(e)
    }

    const handlePassword = (e) => {
        setPassword(e)
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e)
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

    const handleNewToken = (e) => {
        console.log(e)
        setSessionToken(e)
        console.log(e)
        console.log(sessionToken)
    }

    async function handleSubmit() {
        let newUser = new FormData()
        newUser.append('email', email)
        newUser.append('password', password)
        newUser.append('username', username)
        try {
            setSubmit(true)
            var userID
            var sessionToken = await API.post("/profile/user/create", newUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then(response => {
                sessionToken = response.data.token
                console.log('in response', sessionToken)
                userID = response.data.user.id
                handleNewToken(response.data.token)
            })
            setNewUserID(userID)
            setSubmit(false)
            setNewProfileSuccess(true)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {
                newProfileSuccess && (
                    <>
                        <Navigate to={`/profiles/${newUserID}}`} replace={true} />
                    </>
                )
            }
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
                <div className={`${submit ? 'hidden' : 'block'}`}>
                    <div className='fixed justify-center m-auto left-0 right-0 '>
                        <Header page={'login'} />
                    </div>
                    <div className='flex justify-center'>
                        <form className='pt-20'>
                            <Title text={'Register'} size={'text-6xl'} />
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
                            <div className='justify-center mt-5'>
                                <InputField
                                    required={true}
                                    type={'input'}
                                    placeholder={'Username (required)'}
                                    defaultValue={''}
                                    onChange={e => handleUsername(e.target.value)}
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
                            <div className={`mt-5 ${password === '' ? 'hidden' : ''}`}>
                                <InputField
                                    required={true}
                                    type={`${showPassword ? 'text' : 'password'}`}
                                    placeholder={'Confirm password'}
                                    defaultValue={''}
                                    onChange={e => handleConfirmPassword(e.target.value)}
                                    borderColor={`${password === confirmPassword && confirmPassword !== '' ? 'border-light-green' : 'border-light-red'}`}
                                    autoComplete={'password'}
                                />
                            </div>
                            <div className={`${confirmPassword !== '' ? 'hidden' : 'mt-5 dark:text-white text-center'}`}>
                                Already have an account? <Link to={'/login'} style={{ textDecoration: 'none' }} >Login</Link>
                            </div>
                            <div className={`${password !== '' ? 'flex mt-3 justify-center' : 'hidden'}`}>
                                <Button icon={showPasswordIcon} func={() => handleShowPassword()} label={showPasswordString} labelProps={'text-base pl-2'} />
                            </div>
                            {/* Temp. Refactor after proper email and password validation checks */}
                            <div className={`${email.length > 0 && password === confirmPassword && confirmPassword !== '' ? 'flex justify-center pt-10' : 'hidden'}`}>
                                <Button label={'Submit'} func={() => handleSubmit()} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default UsernameUserRegister