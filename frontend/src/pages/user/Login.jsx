import React from 'react'
import { Navigate } from 'react-router-dom'
import { LoginButton, Title, Header, Sidebar } from '../../components'
import { useStateContext } from '../../context/ContextProvider'

const Login = () => {
    const { loggedInProfile, sessionToken } = useStateContext()

    return (
        <>
            <div>
                <Header />
                <Sidebar />
            </div>
            <div className='flex justify-center mt-20'>
                <Title text={'Login'} size={'text-6xl'} />
            </div>
            <div className='mt-20 flex justify-center'>
                <LoginButton />
            </div>
        </>
    )
}

export default Login