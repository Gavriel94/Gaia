import React, { useState } from 'react'
import API from '../../API'
import { Button } from '..'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { useStateContext } from '../../context/ContextProvider'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from '..'

/**
 * Logout button which clears user profile data and wallet if web3 user
 * 
 * @returns {JSX.Element} Button to destroy sessionToken
 */

const LogoutButton = () => {
    const { setSessionToken, loggedInProfile, setLoggedInProfile, walletUser, setConnectedWallet, setadaHandleDetected, setadaHandleName, setDisplayAdaHandle, setAdaHandleSelected, setWalletUser } = useStateContext()
    const [loggedOut, setLoggedOut] = useState(false)
    const [buttonIcon, setButtonIcon] = useState(<BiLogInCircle size={'26px'}/>)

    const clearWallet = () => {
        try {
            
            setConnectedWallet({
                whichWalletSelected: '',
                walletFound: undefined,
                walletIsEnabled: false,
                Utxos: undefined,
                collatUtxos: undefined,
                balance: undefined,
                changeAddress: null,
                rewardAddress: null,
                usedAddress: null,
                txBody: null,
                txBodyCborHex_unsigned: '',
                txBodyCborHex_signed: '',
                submittedTxHash: ''

            })
            // closeWalletLogoutModal()
            setadaHandleDetected(false)
            setadaHandleName([])
            setDisplayAdaHandle(false)
            setAdaHandleSelected(undefined)
            setWalletUser(false)
            // setLogoutSuccessful(true)
        } catch (err) {
            console.log(err)
        }
    }

    const handleLogout = () => {
        setButtonIcon(<LoadingSpinner size={'26px'} />)
        setSessionToken(null)
        setLoggedInProfile({
            sessionToken: '',
            id: '',
            email: '',
            username: '',
            bio: '',
            profile_image: '',
            display_name: '',
        })
        if(walletUser) {
            clearWallet()
        }
        setButtonIcon(<BiLogInCircle size={'26px'} />)
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