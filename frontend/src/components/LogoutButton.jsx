import React, { useState } from 'react'
import API from '../API'
import { Button } from '../components'
import { BiLogOutCircle } from 'react-icons/bi'
import { useStateContext } from '../context/ContextProvider'
import { Navigate } from 'react-router-dom'

/**
 * 
 * @returns Button to destroy sessionToken
 */

const LogoutButton = () => {
    const { setSessionToken, loggedInProfile, setLoggedInProfile } = useStateContext()
    const [loggedOut, setLoggedOut] = useState(false)

    const handleLogout = () => {
        setSessionToken(null)
        setLoggedInProfile({
            sessionToken: '',
            id: '',
            email: '',
            username: '',
            bio: '',
            profile_image: ''
        })
        setLoggedOut(true)
    }

    return (
        <div>
            <Button
                title={'Logout'}
                func={() => handleLogout()}
                icon={<BiLogOutCircle size={'26px'} />}
                label={'Logout'}
                labelProps={'text-sm pt-1 pl-2'}
                className='p-2'
            />
            {
                loggedOut && (
                    <Navigate to={'/home'} replace={true} />
                )
            }
        </div>
    )
}

export default LogoutButton