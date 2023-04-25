import React, { useState, useEffect, useCallback } from 'react'
import Button from '../misc/Button'
import LoadingSpinner from '../misc/LoadingSpinner'

import Modal from 'react-modal'
import { MdOutlineCancel } from 'react-icons/md'
import '../../walletModal.css'
import adaHandleLogo from '../../assets/adaHandleLogoRounded.png'
import { BiLogInCircle } from 'react-icons/bi'
import cardanoLogo from '../../assets/cardanoLogo.png'
import { Link } from 'react-router-dom'

import {
    Address,
    TransactionUnspentOutput,
    Value,
} from "@emurgo/cardano-serialization-lib-asmjs"
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'
import LoginErrorAlert from '../alerts/LoginErrorAlert'
let Buffer = require('buffer/').Buffer

/**
 * Allows user to select a wallet, authenticate their login and sets users profile to state context
 * 
 * @returns {JSX.Element} Login button
 */

const LoginButton = () => {

    const {
        connectedWallet,
        setConnectedWallet,
        darkMode,
        showLogoutAlert,
        showErrorAlert,
        displayAdaHandle, setDisplayAdaHandle,
        adaHandleSelected, setAdaHandleSelected,
        walletUser, setWalletUser,
        loggedInProfile, setLoggedInProfile,
        setadaHandleDetected,
        adaHandleName,
        loginErrorAlert, setLoginErrorAlert,
        profileName, setProfileName,
        profileNameFound, setProfileNameFound,
    } = useStateContext()
    const [showWalletSelectModal, setshowWalletSelectModal] = useState(false)
    const [wallets] = useState([])
    const [walletLoginButton, setwalletLoginButton] = useState(<BiLogInCircle size={'26px'} />)
    const [loading, setLoading] = useState(false)
    const [walletIcons] = useState([])
    // const [adaHandleDetected, setadaHandleDetected] = useState(false)
    // const [adaHandleName, setadaHandleName] = useState([])
    const [showLoginOptionModal, setShowLoginOptionModal] = useState(false)
    const [addressAsID, setAddressAsID] = useState('')
    const [userID, setUserID] = useState('')
    const [sessionToken, setSessionToken] = useState('')

    /**
     *  This is used to verify any ADA Handle found in a users wallet is legitamite 
     */
    const adaHandlePolicyID = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

    var whichWalletSelected = ''
    var walletFound = undefined
    var walletIsEnabled = false
    var walletName = undefined
    var walletIcon = undefined
    var walletAPIVersion = undefined
    var networkId = undefined
    var Utxos = undefined
    var balance = undefined
    var changeAddress = undefined
    var walletAPI = undefined

    /**
     * Checks the browser for wallet plugins and adds them to state
     */
    const pollWallets = useCallback(() => {

        let discardedWallets = [] //remove legacy or unsupported wallets
        for (const key in window.cardano) {
            if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
                if (key === 'ccvault' || key === 'typhon' || key === 'flint' || key === 'nami' || key === 'yoroi' || key === 'gero') {
                    discardedWallets.push(key)
                }
                else {
                    wallets.push(key)
                    walletIcons.push(window.cardano[key].icon)
                }
            }
        }
    }, [wallets, walletIcons])

    useEffect(() => {
        pollWallets()
    }, [pollWallets])

    /**
     * Handles user selection
     * 
     * @param obj 
     */
    const handleWalletSelect = (obj) => {
        const index = wallets.indexOf(obj)
        whichWalletSelected = wallets[index]
        walletIcon = walletIcons[index]
        closeWalletSelectModal()
        refreshData()
    }

    /**
     * Checks if a wallet is running in the browser
     * @returns {boolean}
     */
    const checkIfWalletFound = () => {
        const key = whichWalletSelected
        walletFound = !!window?.cardano?.[key]
        return walletFound
    }

    /**
     * Checks if connection established with wallet
     * 
     * @returns {Promise<boolean>}
     */
    const checkIfWalletEnabled = async () => {
        try {
            const name = whichWalletSelected
            walletIsEnabled = await window.cardano[name].isEnabled()
        } catch (err) {
            console.log(err)
        }
        return walletIsEnabled
    }

    /**
     * Produces a popup asking the user to connect to their chosen wallet
     * 
     * @returns {Promise<boolean>}
     */
    const enableWallet = async () => {
        const key = whichWalletSelected
        try {
            walletAPI = await window.cardano[key].enable()
        } catch (err) {
            console.log(err)
        }

        return checkIfWalletEnabled()
    }

    /**
     * Saves the API version used by the wallet to state
     * 
     * @returns {*}
     */
    const getAPIVersion = () => {
        const key = whichWalletSelected
        walletAPIVersion = window?.cardano?.[key].apiVersion
        return walletAPIVersion
    }

    /**
     * Saves the name of the wallet to state
     * 
     * @returns {*}
     */
    const getWalletName = () => {
        const key = whichWalletSelected
        const name = window?.cardano?.[key].name
        walletName = name
        return walletName
    }

    /**
     * Saves network ID to state
     * 0 = testnet
     * 1 = mainnet
     */
    const getNetworkId = async () => {
        try {
            const id = await walletAPI.getNetworkId()
            networkId = id
            return networkId
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Stores the UTxOs from the users wallet in state
     */
    const getUtxos = async () => {
        let utxos = []

        try {
            const rawUtxos = await walletAPI.getUtxos()

            for (const rawUtxo of rawUtxos) {
                const utxo = TransactionUnspentOutput.from_bytes(Buffer.from(rawUtxo, "hex"));
                const input = utxo.input();
                const txid = Buffer.from(input.transaction_id().to_bytes(), "utf8").toString("hex");
                const txindx = input.index();
                const output = utxo.output();
                const amount = output.amount().coin().to_str(); // ADA amount in lovelace
                const multiasset = output.amount().multiasset();

                let multiAssetStr = "";

                if (multiasset) {
                    const keys = multiasset.keys() // policyID of NFTs in wallet
                    const N = keys.len();


                    for (let i = 0; i < N; i++) {
                        const policyId = keys.get(i);
                        const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
                        const assets = multiasset.get(policyId)
                        const assetNames = assets.keys();
                        const K = assetNames.len()

                        for (let j = 0; j < K; j++) {
                            const assetName = assetNames.get(j);
                            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
                            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
                            const multiassetAmt = multiasset.get_asset(policyId, assetName)
                            if (policyIdHex === adaHandlePolicyID) {
                                //ADA Handle found
                                adaHandleName.push(assetNameString)
                                setadaHandleDetected(true)
                            }
                            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
                        }
                    }
                }

                const utxoObj = {
                    txid: txid,
                    txindx: txindx,
                    amount: amount,
                    str: `${txid} #${txindx} = ${amount}`,
                    multiAssetStr: multiAssetStr,
                    TransactionUnspentOutput: utxo
                }
                utxos.push(utxoObj)
            }
            Utxos = utxos
            return Utxos
        } catch (err) {
            console.log(err)
        }
    }
    /**
     * Gets the balance of the users wallet in Lovelace
     * Does not include tokens
     * 
     * 1 ADA = 1,000,000 Lovelace
     */
    const getBalance = async () => {
        try {
            const balanceCBORHex = await walletAPI.getBalance()

            const b = Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin().to_str()
            balance = b
            return balance
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Gets destination address for spare UTxO to be sent to when building transactions
     */
    const getChangeAddress = async () => {
        try {
            const raw = await walletAPI.getChangeAddress()
            const changeAdd = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
            changeAddress = changeAdd
            return changeAddress
        } catch (err) {
            console.log(err)
        }
    }

    const handleUserID = (e) => {
        setAddressAsID(e)
    }

    const handleNewToken = (e) => {
        setSessionToken(e)
    }

    /**
     * Refresh data from the users wallet
     */
    const refreshData = async () => {
        try {
            const walletFound = checkIfWalletFound()
            if (walletFound) {
                setLoading(true)
                setwalletLoginButton(<LoadingSpinner />)
                const walletAPIVersion = await getAPIVersion()
                const walletName = await getWalletName()
                const walletEnabled = await enableWallet()
                if (walletEnabled) {
                    const networkID = await getNetworkId()
                    const utxos = await getUtxos()
                    const balance = await getBalance()
                    const changeAddress = await getChangeAddress()
                    handleUserID(changeAddress)
                    setConnectedWallet({
                        whichWalletSelected: whichWalletSelected,
                        walletFound: walletFound,
                        walletIsEnabled: walletEnabled,
                        walletName: walletName,
                        walletAPIVersion: walletAPIVersion,
                        walletIcon: walletIcon,
                        wallets: wallets,
                        networkId: networkID,
                        Utxos: utxos,
                        balance: balance,
                        changeAddress: changeAddress,
                        walletAPI: walletAPI,
                    })
                    await authenticate()
                } else {
                    clearWallet('error')
                }
            } else {
                clearWallet('error')
            }
        } catch (err) {
            setLoginErrorAlert(true)
        }
    }

    const getUserProfile = (e) => {
        API.get("/profile/user", {
            headers: {
                'Authorization': `Token ${e}`
            },
        }).then((res) => {
            setLoggedInProfile({
                sessionToken: e,
                id: res.data.id,
                username: res.data.username,
                bio: res.data.bio,
                profile_image: res.data.profile_image,
                profile_name: res.data.profile_name,
                notifications: res.data.notifications,
                authored: res.data.authored,
                reacted: res.data.reacted,
                bookmarked: res.data.bookmarked,
            })
            if (res.data.profile_name.charAt(0) === '$') {
                let handle = res.data?.profile_name?.slice(1, res.data?.display_name?.length)
                for (let i = 0; i < adaHandleName.length; i++) {
                    if (adaHandleName[i] === handle) {
                        setAdaHandleSelected('$' + adaHandleName[i])
                        setDisplayAdaHandle(true)
                    }
                }
            }
            if (res.data.profile_name.length > 0) {
                setProfileNameFound(true)
                setProfileName(res.data.profile_name)
            }
        }).catch(console.err)
    }

    const authenticate = async () => {
        //Tries to login, if it fails, create a new account
        let walletUser = new FormData()
        const ca = await getChangeAddress()
        walletUser.append('username', ca)
        walletUser.append('password', 'password') // 'password' is safe as wallet login required before GET request
        try {
            var userID
            var sessionToken = await API.post("/profile/login", walletUser, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }).then(response => {
                sessionToken = response.data.token
                userID = response.data.user.id
                handleNewToken(response.data.token)
                getUserProfile(response.data.token)
            })
            setUserID(userID)
            setWalletUser(true)
            setLoading(false)
        } catch (err) {
            if (err.response.status === 404) {
                try {
                    sessionToken = await API.post("profile/user/create", walletUser, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    }).then(response => {
                        sessionToken = response.data.token
                        handleNewToken(response.data.token)
                        getUserProfile(response.data.token)
                    })
                    setUserID(userID)
                    setWalletUser(true)
                    getUserProfile()
                    setLoading(false)
                } catch (err) {
                    setLoginErrorAlert(true)
                }
            }
            else {
                setLoginErrorAlert(true)
            }
            setLoading(false)
        }
    }

    const openWalletSelectModal = () => {
        setShowLoginOptionModal(false)
        pollWallets()
        setshowWalletSelectModal(!showWalletSelectModal)
        if (showWalletSelectModal) {
            document.body.style.overflow = 'unset';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    const closeWalletSelectModal = () => {
        setshowWalletSelectModal(false)
        document.body.style.overflow = 'unset';
    }

    const shortenAddress = () => {
        if (loggedInProfile?.display_name?.length > 3) {
            return String(loggedInProfile.display_name).slice(0, 8) + '...'
        }
        return String(connectedWallet.changeAddress).slice(0, 8) + '...'
    }

    const clearWallet = () => {
        while (walletUser) {
            setwalletLoginButton(<LoadingSpinner size={'26px'} />)
        }
        setwalletLoginButton(<BiLogInCircle size={'26px'} />)
    }

    const openLoginOptionModal = () => {
        setShowLoginOptionModal(true)
    }

    const walletSelectModalContent = () => {
        if (wallets.length === 0) {
            return (
                <div className={`${darkMode && 'text-white'} text-white justify-center text-center pt-2`}>
                    <div>
                        No wallets found.
                    </div>
                    <div>
                        Gaia currently supports Eternl and Typhon wallets.
                    </div>
                    <div>
                        Click <Link to='/walletinstructions' style={{ textDecoration: 'none' }}>here</Link> for more information
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                        Select Wallet
                    </div>
                    <div>
                        {

                            wallets.map(key =>
                                <div key={key} className={`flex justify-center pt-5 pl-5 pr-5 text-white`}>
                                    <button
                                        type='button'
                                        onClick={() => handleWalletSelect(key)}
                                        className='hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover w-60 rounded-full duration-150 ease-in-out p-3'>
                                        <div className='flex flex-row justify-center'>
                                            <img src={window.cardano[key].icon} alt={'Wallet icon'} height={48} width={48} />
                                            <p className='pt-3'>{window.cardano[key].name}</p>
                                        </div>
                                    </button>
                                </div>
                            )
                        }

                        <div className='justify-center pt-5 pl-5 pr-5' />
                        <div>
                            <span className={`text-white flex justify-center text-center pt-2`}>
                                This does not give Gaia permission to access funds.
                                <br />
                                <br />
                                Cardano generates different addresses for different wallets.
                                <br />
                                Ensure you always use the same wallet for your Gaia profile.
                                <br />
                            </span>
                        </div>
                    </div>
                </>
            )
        }
    }

    Modal.setAppElement("#root")

    return (
        <div className='hidden sm:block'> {/* login hidden on mobile (temp) */}
            {
                showErrorAlert && (
                    <div className='opacity-100 animate-bounce flex justify-center
                     mt-5 bg-light-red border-black border-1 text-light-white rounded-lg'>
                        <div className='p-2'>
                            <p>Wallet not connected.</p>
                        </div>
                    </div>
                )
            }

            {/* Button for user to begin the login process */}
            <div className={`${showLogoutAlert && 'hidden'} ${showErrorAlert && 'hidden'}`}>
                <div className={`${connectedWallet.walletIsEnabled === true ? 'hidden' : ''} `}>
                    <Button
                        title={'Wallet'}
                        func={() => openLoginOptionModal()}
                        icon={walletLoginButton}
                        label={'Login'}
                        labelProps={'text-sm pt-1 pl-2'}
                        className='p-2'
                    />
                </div>

                {/* Shows the logo and address of the connected wallet */}
                <div className={`${connectedWallet.walletIsEnabled === true ? '' : 'hidden'}`}>

                    <Link to={`/profiles/${loggedInProfile.id}`}>
                        <Button
                            title={'Wallet'}
                            // func={() => openWalletLogoutModal()}
                            // label={`${connectedWallet.walletIsEnabled === true ? balanceInADA() : ''}`}
                            label={`${displayAdaHandle ? adaHandleSelected : profileNameFound ? profileName : shortenAddress()}`}
                            image={`${displayAdaHandle ? adaHandleLogo : connectedWallet.walletIcon}`}
                            imageAlt={`${connectedWallet.walletName + 'wallet logo'}`}
                            imageHeight={24}
                            imageWidth={24}
                            labelProps={'text-base pl-2'}
                            className='p-2'
                        />
                    </Link>
                </div>
            </div>

            {/* 
                This modal handles the login options prompting for email or Cardano wallet
             */}
            <div>
                <Modal
                    isOpen={showLoginOptionModal}
                    onRequestClose={() => setShowLoginOptionModal(false)}
                    contentLabel="Login Modal"
                    ariaHideApp={false} //! only false for testing change to true when done
                    className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                    overlayClassName={'overlayModal'}
                >
                    <>
                        <div>
                            <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                                Login
                            </div>

                            <div className='block justify-center mt-10'>
                                <button
                                    type='button'
                                    onClick={() => openWalletSelectModal()}
                                    className='hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover w-60 rounded-full duration-150 ease-in-out p-3'>
                                    <div className='flex flex-row justify-center'>
                                        <img src={cardanoLogo} alt={'Cardano Logo'} height={48} width={48} />
                                        <p className={`pt-3 ${darkMode && 'text-white'}`}>
                                            Cardano
                                        </p>
                                    </div>
                                </button>
                            </div>

                            <div className='flex justify-center pt-5 pl-5 pr-5'>
                                <div className='flex justify-center pt-10 pb-4'>
                                    <Button func={() => setShowLoginOptionModal(false)} icon={<MdOutlineCancel />} />
                                </div>
                            </div>
                        </div>
                    </>
                </Modal>
            </div>

            {/* Handles wallet selection on Cardano option from above modal */}
            <div>
                <Modal
                    isOpen={showWalletSelectModal}
                    onRequestClose={() => closeWalletSelectModal()}
                    contentLabel="Wallet Select Modal"
                    ariaHideApp={false} //! only false for testing change to true when done
                    className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                    overlayClassName={'overlayModal'}
                >
                    {walletSelectModalContent()}
                    <div className='flex justify-center pt-10 pb-4'>
                        <Button func={() => closeWalletSelectModal()} icon={<MdOutlineCancel />} />
                    </div>
                </Modal>
            </div>
            <LoginErrorAlert open={loginErrorAlert} />
        </div>
    )
}

export default LoginButton