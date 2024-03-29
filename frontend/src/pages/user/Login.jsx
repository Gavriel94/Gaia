import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginButton, Title, Header, SidebarV2 } from '../../components'
import { useStateContext } from '../../context/ContextProvider'

/**
 * 
 * Provides a button for the user to login
 * Automatically redirects to the users profile page
 * Login page 
 */

const Login = () => {
    const { loggedInProfile } = useStateContext()
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        if(loggedInProfile.id !== '') {
            setLoggedIn(true)
        }
    }, [loggedInProfile.id])


    return (
        <>
        {
            loggedIn && (
                <Navigate to={`/profiles/${loggedInProfile.id}`} replace={true}/>
            )
        }
        <Header page={'login'}/>

                <SidebarV2 />

            <div className='flex justify-center mt-20'>
                <Title text={'Login'} size={'text-6xl'} hover={true}/>
            </div>
            <div className='mt-20 dark:text-white text-center'>
                Login to view your profile
            </div>
            <div className='mt-5 flex justify-center'>
                <LoginButton />
            </div>
        </>
    )
}

export default Login