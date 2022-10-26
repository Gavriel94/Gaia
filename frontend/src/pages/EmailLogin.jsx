import React, { useState } from 'react'
import { Header, InputField, Title, LoadingSpinner, Button } from '../components'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { useStateContext } from '../context/ContextProvider'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

/**
 * For now this functionality hasn't been confirmed to make it into the final build
 * Email login will inevitably have to come with 'forgot password' functionality
 * TODO: Password strength checking
 * TODO: Limit num of login attempts and link to the 'forgot password' functionality 
 */

const EmailLogin = () => {
    const { darkMode } = useStateContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submit, setSubmit] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordIcon, setShowPasswordIcon] = useState(<AiOutlineEye />)

    // password validity checks
    const [containsUL, setContainsUL] = useState(false) // uppercase letter
    const [containsLL, setContainsLL] = useState(false) // lowercase letter
    const [containsN, setContainsN] = useState(false) // number
    const [containsSC, setContainsSC] = useState(false) // special character
    const [contains8C, setContains8C] = useState(false) // min 8 characters
    const [passwordMatch, setPasswordMatch] = useState(false) // passwords match

    // checks all validations are true
    const [allValid, setAllValid] = useState(false)

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
            setShowPasswordIcon(<AiOutlineEye />)
        } else {
            setShowPassword(true)

            setShowPasswordIcon(<AiOutlineEyeInvisible />)
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
    }

    function handleSubmit() {
        // check for content
        const login = {
            email: email,
            password: password,
        }
        try {
            // post
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
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
                    <div className='mt-5 flex'>
                        <InputField
                            required={true}
                            type={`${showPassword ? 'text' : 'password'}`}
                            placeholder={'Password'}
                            defaultValue={''}
                            onChange={e => handlePassword(e.target.value)}
                            autoComplete={'password'}
                        />
                    </div>
                    <div className={`mt-5 ${password === '' ? 'hidden' : 'block'} flex flex-row`}>
                        <InputField
                            required={true}
                            type={`${showPassword ? 'text' : 'password'}`}
                            placeholder={'Confirm password'}
                            defaultValue={''}
                            onChange={e => handleConfirmPassword(e.target.value)}
                            borderColor={`${password === confirmPassword && confirmPassword !== '' ? 'border-light-green' : 'border-light-red'}`}
                            autoComplete={'password'}
                        />
                        <div className={`pl-10 ${password !== '' ? 'block mt-3' : 'hidden'}`}>
                            <Button icon={showPasswordIcon} func={() => handleShowPassword()} />
                        </div>
                    </div>
                    <div className='flex justify-center py-5'>
                        <Button label={'Submit'} func={handleSubmit} />
                    </div>
                </form>
            </div>
        </>
    )
}

export default EmailLogin