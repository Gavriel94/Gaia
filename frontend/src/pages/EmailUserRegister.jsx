import React, { useState } from 'react'
import { Header, InputField, Title, LoadingSpinner, Button, Editor } from '../components'
import { BsFillCheckCircleFill, BsCardImage } from 'react-icons/bs'
import { useStateContext } from '../context/ContextProvider'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import API from '../API'
import { Link, Navigate } from 'react-router-dom'
import defaultProfileImage from '../assets/fpngs/DefaultAvatar.png'

/**
 * For now this functionality hasn't been confirmed to make it into the final build
 * Email login will inevitably have to come with 'forgot password' functionality
 * TODO: Password strength checking
 * TODO: Limit num of login attempts and link to the 'forgot password' functionality 
 */

const EmailUserRegister = () => {
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

    const [moreOptions, setMoreOptions] = useState(false)
    const [profileImage, setProfileImage] = useState(undefined)
    const [content, setContent] = useState('') //user bio
    const [username, setUsername] = useState('')


    const [newUserID, setNewUserID] = useState('')
    const [newProfileSuccess, setNewProfileSuccess] = useState(false)

    const [newUserToken, setNewUserToken] = useState('')

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

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function confirmSubmit(e) {
        setSubmit(true);
        await sleep(2000);
        setSubmitted(true)
        await sleep(1000);
        setSubmitted(false)
        setSubmit(false);
        if (e === 1) {
            setMoreOptions(true)
        } else {
            setNewProfileSuccess(true)
        }
    }

    async function handleSubmit() {
        let newUser = new FormData()
        console.log(email)
        console.log(password)
        newUser.append('email', email)
        newUser.append('password', password)
        newUser.append('profile_image', profileImage)
        newUser.append('bio', content)
        newUser.append('username', username)
        try {
            var id 
            var userT = await API.post("/profile/user/create", newUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then(response => console.log(response))
            // }).then(response => userID = response.data.id)
            setNewUserToken(userT)
            setNewUserID(id)
            confirmSubmit()
        } catch (err) {
            console.log(err.response.data)
        }
    }

    const handleImageUpload = e => {
        if (e.target.files[0].size > 800000) {
            alert('Image must be less than 8MB')
            return
        }
        setProfileImage(e.target.files[0])
    }

    return (
        <>
            {
                moreOptions && (
                    <>
                        <form className='pt-20' required={false}>
                            <Title text={'Details'} size={'text-6xl'} />
                            <div className='flex justify-center mt-20'>
                                <div className='rounded-full focus:outline-none
              bg-light-orange hover:bg-light-white  
              text-light-white dark:bg-dark-orange dark:text-white 
                w-[100px] py-2 px-4 text-xl font-bold cursor-pointer z-0 absolute content-center'>
                                    <div className='flex justify-center'>
                                        <BsCardImage size={'26px'} />
                                    </div>
                                </div>
                                <input type='file' className='opacity-0 z-10 w-[100px] h-[50px] cursor-pointer' onChange={handleImageUpload} required={false} />
                            </div>
                            <Editor setContent={setContent} />
                        </form>

                        <Button label={'Submit'} func={() => handleSubmit()} />
                    </>
                )
            }
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
                            <div className={`${!submitted && 'hidden'}`}>
                                <Title text={'Submitted!'} size={'text-6xl'} />
                            </div>
                        </div>

                    </>
                )
            }
            {
                <div className={`${submit ? 'hidden' : moreOptions ? 'hidden' : 'block'}`}>
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
                            <div className={`${confirmPassword !== '' ? 'hidden' : 'mt-5 dark:text-white'}`}>
                                Already have an account? <Link to={'/login'} style={{ textDecoration: 'none' }} >Login</Link>
                            </div>
                            <div className={`${password !== '' ? 'flex mt-3 justify-center' : 'hidden'}`}>
                                <Button icon={showPasswordIcon} func={() => handleShowPassword()} label={showPasswordString} labelProps={'text-base pl-2'} />
                            </div>
                            {/* Temp. Refactor after proper email and password validation checks */}
                            <div className={`${email.length > 0 && password === confirmPassword && confirmPassword !== '' ? 'flex justify-center pt-10' : 'hidden'}`}>
                                <Button label={'Submit'} func={() => confirmSubmit(1)} />
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default EmailUserRegister