import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Button from '../misc/Button'
import LoadingSpinner from '../misc/LoadingSpinner'

import Modal from 'react-modal'
import { MdOutlineCancel, MdOutlineMailOutline } from 'react-icons/md'
import '../../walletModal.css'
import { BsFillXCircleFill } from 'react-icons/bs'
import adaHandleLogo from '../../assets/adaHandleLogoRounded.png'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import { CgProfile } from 'react-icons/cg'
import cardanoLogo from '../../assets/cardanoLogo.png'
import { Link } from 'react-router-dom'

import {
    Address,
    BaseAddress,
    MultiAsset,
    Assets,
    ScriptHash,
    Costmdls,
    Language,
    CostModel,
    AssetName,
    TransactionUnspentOutput,
    TransactionUnspentOutputs,
    TransactionOutput,
    Value,
    TransactionBuilder,
    TransactionBuilderConfigBuilder,
    TransactionOutputBuilder,
    LinearFee,
    BigNum,
    BigInt,
    TransactionHash,
    TransactionInputs,
    TransactionInput,
    TransactionWitnessSet,
    Transaction,
    PlutusData,
    PlutusScripts,
    PlutusScript,
    PlutusList,
    Redeemers,
    Redeemer,
    RedeemerTag,
    Ed25519KeyHashes,
    ConstrPlutusData,
    ExUnits,
    Int,
    NetworkInfo,
    EnterpriseAddress,
    TransactionOutputs,
    hash_transaction,
    hash_script_data,
    hash_plutus_data,
    ScriptDataHash,
    Ed25519KeyHash,
    NativeScript,
    StakeCredential,
    TransactionBuilderConfig
} from "@emurgo/cardano-serialization-lib-asmjs"
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'
import LogoutButton from './LogoutButton'
let Buffer = require('buffer/').Buffer

/**
 * Login button currently coupled with wallet logic for transactions etc
 * @returns {JSX.Element} Login button
 */

/**
 * TODO: Hardcode which wallets are allowed (typhoncip30, eternl & nami) instead of polling the browser
 * TODO: Require wallet signature for like and dislike
 * TODO: Enable ADA tipping feature 
 */

const LoginButton = () => {

    const {
        connectedWallet,
        setConnectedWallet,
        protocolParams,
        darkMode,
        showLogoutAlert, setshowLogoutAlert,
        showErrorAlert, setShowErrorAlert,
        displayAdaHandle, setDisplayAdaHandle,
        adaHandleSelected, setAdaHandleSelected,
        walletUser, setWalletUser,
        loggedInProfile, setLoggedInProfile,
        adaHandleDetected, setadaHandleDetected,
        adaHandleName, setadaHandleName,
    } = useStateContext()
    const [showWalletSelectModal, setshowWalletSelectModal] = useState(false)
    const [showWalletLogoutModal, setShowWalletLogoutModal] = useState(false)
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
     *  This is used to verify the ada handle and ensures it is legitamite 
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
    var collatUtxos = undefined
    var balance = undefined
    var changeAddress = undefined
    var rewardAddress = undefined
    var usedAddress = undefined
    var txBody = undefined
    var txBodyCborHex_unsigned = ''
    var txBodyCborHex_signed = ''
    var submittedTxHash = ''
    var walletAPI = undefined


    /**
     * Checks the browser for wallet plugins and adds them to state
     */
    const pollWallets = useCallback(() => {

        let discardedWallets = [] //remove legacy or unsupported wallets
        for (const key in window.cardano) {
            if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
                if (key === 'ccvault' || key === 'typhon' || key === 'flint') {
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
        console.log('inside handleWalletSelect')
        console.log('obj passed in', obj)
        // pick the wallet from the wallets[] and use obj to compare values
        // use this to set whichWalletSelected, as an element from the array wallets
        const index = wallets.indexOf(obj)
        whichWalletSelected = wallets[index]
        walletIcon = walletIcons[index]
        closeWalletSelectModal()
        refreshData()
    }

    /**
     * Generate address from Plutus cborhex
     */
    const generateScriptAddress = () => {
        // const script = PlutusScript.from_bytes(Buffer.from(plutusScriptCborHex, "hex"))
        const blake2bhash = "67f33146617a5e61936081db3b2117cbf59bd2123748f58ac9678656";
        const scripthash = ScriptHash.from_bytes(Buffer.from(blake2bhash, "hex"));
        const cred = StakeCredential.from_scripthash(scripthash);
        const networkId = NetworkInfo.testnet().network_id();
        const baseAddr = EnterpriseAddress.new(networkId, cred);
        const addr = baseAddr.to_address();
        const addrBech32 = addr.to_bech32();
        const ScriptAddress = Address.from_bech32("addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8");

        // // hash of address generated from script
        // console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"))
        // // hash of address generated from cardano-cli
        // console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"))

        // console.log(ScriptAddress.to_bech32())
        // console.log(addrBech32)
    }

    /**
     * Checks if a wallet is running in the browser
     * @returns {boolean}
     */
    const checkIfWalletFound = () => {
        const key = whichWalletSelected
        console.log('whichWalletSelected', whichWalletSelected)
        console.log('key', key)
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
        console.log('enable wallet', key)
        try {
            walletAPI = await window.cardano[key].enable()
        } catch (err) {
            console.log(err)
            // resetWalletSelection()
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
                    const keys = multiasset.keys() // policy Ids of thee multiasset
                    const N = keys.len();
                    // console.log(`${N} Multiassets in the UTXO`)


                    for (let i = 0; i < N; i++) {
                        const policyId = keys.get(i);
                        const policyIdHex = Buffer.from(policyId.to_bytes(), "utf8").toString("hex");
                        // console.log(`policyId: ${policyIdHex}`)  //policyID
                        const assets = multiasset.get(policyId)
                        const assetNames = assets.keys();
                        const K = assetNames.len()
                        // console.log(`${K} Assets in the Multiasset`)

                        for (let j = 0; j < K; j++) {
                            const assetName = assetNames.get(j);
                            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
                            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
                            const multiassetAmt = multiasset.get_asset(policyId, assetName)
                            if (policyIdHex === adaHandlePolicyID) {
                                adaHandleName.push(assetNameString)
                                setadaHandleDetected(true)
                            }
                            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
                            // console.log(assetNameString)
                            // console.log(`Asset Name: ${assetNameHex}`)
                            // console.log(multiassetAmt)
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
     * Collateral is used for Plutus Scripts
     * Used for paying fees if script execution fails after validation
     * If used it suggests the smart contract has been written incorrectly
     */
    const getCollateral = async () => {
        let colUtxos = []

        try {
            let col = []

            const userWallet = whichWalletSelected
            if (userWallet === 'nami') {
                col = await walletAPI.experimental.getCollateral()
            } else {
                col = await walletAPI.getCollateral()
            }

            for (const c of col) {
                const tx = TransactionUnspentOutput.from_bytes(Buffer.from(c, "hex"))
                colUtxos.push(tx)
            }
            collatUtxos = colUtxos
            return collatUtxos
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
            console.log(changeAddress)
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Returns the address rewards from staking are paid into
     */
    const getRewardAddresses = async () => {
        try {
            const raw = walletAPI.getRewardAddresses()
            const rawFirst = raw[0]
            const address = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
            rewardAddress = address
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Gets used addresses
     */
    const getUsedAddresses = async () => {
        try {
            const raw = await walletAPI.getUsedAddresses()
            const rawFirst = raw[0]
            const address = Address.from_bytes(Buffer.from(rawFirst, "hex")).to_bech32()
            usedAddress = address
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
        // generateScriptAddress()
        // console.log(generateScriptAddress())
        try {
            const f = checkIfWalletFound()
            console.log('wallet found', f)
            if (f) {
                setLoading(true)
                setwalletLoginButton(<LoadingSpinner />)
                const wAPI = await getAPIVersion()
                const wn = await getWalletName()
                const enabled = await enableWallet()
                console.log('wallet enabled', enabled)
                if (enabled) {
                    const nID = await getNetworkId()
                    const u = await getUtxos()
                    console.log(adaHandleName)
                    // const c = await getCollateral() // throws error
                    const b = await getBalance()
                    console.log(walletAPI)
                    const ca = await getChangeAddress()
                    handleUserID(ca)
                    // await getAssets()
                    // await getRewardAddresses()
                    // await getUsedAddresses()
                    setConnectedWallet({
                        whichWalletSelected: whichWalletSelected,
                        walletFound: f,
                        walletIsEnabled: enabled,
                        walletName: wn,
                        walletAPIVersion: wAPI,
                        walletIcon: walletIcon,
                        wallets: wallets,
                        networkId: nID,
                        Utxos: u,
                        collatUtxos: undefined,
                        balance: b,
                        changeAddress: ca,
                        rewardAddress: undefined,
                        usedAddress: undefined,
                        walletAPI: walletAPI,
                    })
                    authenticate()
                } else {
                    console.log('no wallet enabled')
                    clearWallet('error')
                }
            } else {
                console.log('no wallet found')
                clearWallet('error')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const getUserProfile = (e) => {
        API.get("/profile/user", {
            headers: {
                'Authorization': `Token ${e}`
            },
        }).then((res) => {
            console.log('res', res)
            setLoggedInProfile({
                sessionToken: e,
                id: res.data.id,
                username: res.data.username,
                bio: res.data.bio,
                profile_image: res.data.profile_image,
                profile_name: res.data.profile_name,
                authored: res.data.authored,
                reacted: res.data.reacted,
            })
            // setLoggedInProfile(res.data)
            console.log('res.data', res.data)
            if(res.data.profile_name.charAt(0) === '$') {
                console.log('handle found as display name')
                let handle = res.data?.profile_name?.slice(1, res.data?.display_name?.length)
                for(let i = 0; i < adaHandleName.length; i++) {
                    console.log(adaHandleName[i])
                    console.log(handle)
                    if(adaHandleName[i] === handle) {
                        setAdaHandleSelected('$' + adaHandleName[i])
                        setDisplayAdaHandle(true)
                    }
                }
            }
            console.log(loggedInProfile)
            console.log(res.data)
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
                console.log(response)
                sessionToken = response.data.token
                console.log('in login', sessionToken)
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
                        console.log('in create', sessionToken)
                        handleNewToken(response.data.token)
                        getUserProfile(response.data.token)
                    })
                    setUserID(userID)
                    setWalletUser(true)
                    getUserProfile()
                    setLoading(false)
                } catch (err) {
                    console.log(err)
                }
            }
            else {
                console.log('response not 404', err)
                console.log(err.response.data)
            }
            setLoading(false) //could display an error message
        }
    }

    /**
     * Every transaction requires the transaction builder and setting of protocol parameters
     */
    const initTransactionBuilder = async () => {
        const builder = TransactionBuilder.new(
            TransactionBuilderConfigBuilder.new()
                .fee_algo(LinearFee.new(BigNum.from_str(protocolParams.linearFee.minFeeA), BigNum.from_str(this.protocolParams.linearFee.minFeeB)))
                .pool_deposit(BigNum.from_str(protocolParams.poolDeposit))
                .key_deposit(BigNum.from_str(protocolParams.keyDeposit))
                .coins_per_utxo_byte(BigNum.from_str(protocolParams.coinsPerUtxoWord))
                .max_value_size(protocolParams.maxValSize)
                .max_tx_size(protocolParams.maxTxSize)
                .prefer_pure_change(true)
                .build()
        );
        return builder
    }

    /**
     * Builds an object of UTxOs from the user wallet
     */
    const getTxUnspentOutputs = async () => {
        let outputs = TransactionUnspentOutputs.new()
        for (const utxo of Utxos) {
            outputs.add(utxo.TransactionUnspentOutput)
        }
        return outputs
    }

    /**                                              
     * !---------------------------------------------- *
     */

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

    const balanceInADA = () => {
        const b = 'Balance: ' + Math.round(connectedWallet.balance / 1000000) + ' ₳'
        return b
    }

    const longAddress = () => {
        return connectedWallet.changeAddress
    }

    const shortenAddress = () => {
        if(loggedInProfile?.display_name?.length > 3) {
            return String(loggedInProfile.display_name).slice(0,8) + '...'
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

    Modal.setAppElement("#root")

    return (
        <div className='hidden sm:block'> {/* login hidden on mobile (temp) */}
            {
                showLogoutAlert && (
                    <div className='opacity-100 animate-bounce flex justify-center pl-5
                     mt-5 bg-light-orange dark:bg-dark-orange border-black border-1 text-light-white rounded-lg'>
                        <div className='p-2 flex justify-center'>
                            <p>Logged out successfully.</p>
                        </div>
                    </div>
                )
            }
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
                            label={`${displayAdaHandle ? adaHandleSelected : shortenAddress()}`}
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

                            {/*! Email option removed for now */}

                            {/* <div className='block justify-center pt-5'>
                                <Link to={'/register'}>
                                    <button
                                        type='button'
                                        className='hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover w-60 rounded-full duration-150 ease-in-out p-3'>
                                        <div className='flex flex-row justify-center'>
                                            <MdOutlineMailOutline size={'52px'} color={'white'} />
                                            <p className={`pt-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                                                Email
                                            </p>
                                        </div>
                                    </button>
                                </Link>
                            </div> */}

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
                    <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                        Select Wallet
                    </div>
                    <div>
                        {

                            wallets.map(key =>
                                <div key={key} className={`flex justify-center pt-5 pl-5 pr-5 ${darkMode && 'text-white'}`}>
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
                            <span className={`${darkMode && 'text-white'} flex justify-center text-center pt-2`}>
                                This does not give Gaia permission to access funds.
                                <br />
                                <br />
                                Cardano generates different addresses for different wallets.
                                <br />
                                Ensure you always use the same wallet for your Gaia profile.
                                <br />
                            </span>
                        </div>
                        <div className='flex justify-center pt-10 pb-4'>
                            <Button func={() => closeWalletSelectModal()} icon={<MdOutlineCancel />} />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default LoginButton