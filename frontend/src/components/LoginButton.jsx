import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'

import Modal from 'react-modal'
import { MdOutlineCancel, MdOutlineMailOutline } from 'react-icons/md'
import '../walletModal.css'
import { BsFillXCircleFill } from 'react-icons/bs'
import adaHandleLogo from '../assets/adaHandleLogoRounded.png'
import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi'
import cardanoLogo from '../assets/cardanoLogo.png'
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
import { useStateContext } from '../context/ContextProvider'
let Buffer = require('buffer/').Buffer


/**
 * TODO: Hardcode which wallets are allowed (typhoncip30, eternl & nami) instead of polling the browser
 *
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
        adaHandleSelected, setAdaHandleSelected
    } = useStateContext()
    const [showWalletSelectModal, setshowWalletSelectModal] = useState(false)
    const [showWalletLogoutModal, setShowWalletLogoutModal] = useState(false)
    const [wallets] = useState([])
    const [walletLoginButton, setwalletLoginButton] = useState(<BiLogInCircle size={'26px'} />)
    const [loading, setLoading] = useState(false)
    const [walletIcons] = useState([])
    const [logoutSuccessful, setLogoutSuccessful] = useState(false)
    const [adaHandleDetected, setadaHandleDetected] = useState(false)
    const [adaHandleName, setadaHandleName] = useState([])
    const [showLoginOptionModal, setShowLoginOptionModal] = useState(false)
    const [loginOption, setLoginOption] = useState('')
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
                    // console.log(walletAPI)
                    setLoading(false)
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

    /**
     * Every transaction requires the transaction builder and setting of protocol parameters
     */
    const initTransactionBuilder = async () => {
        const builder = TransactionBuilder.new(
            TransactionBuilderConfigBuilder.new()
                .fee_algo(LinearFee.new(BigNum.from_str(protocolParams.linearFee.minFeeA), BigNum.from_str(this.protocolParams.linearFee.minFeeB)))
                .pool_deposit(BigNum.from_str(protocolParams.poolDeposit))
                .key_deposit(BigNum.from_str(protocolParams.keyDeposit))
                .coins_per_utxo_word(BigNum.from_str(protocolParams.coinsPerUtxoWord))
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

    const openWalletLogoutModal = () => {
        setShowWalletLogoutModal(true)
    }

    const closeWalletLogoutModal = () => {
        setShowWalletLogoutModal(false)
    }


    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function displayLogoutAlert() {
        setshowLogoutAlert(true);
        await sleep(1000);
        setshowLogoutAlert(false);
    }

    async function displayErrorAlert() {
        setShowErrorAlert(true);
        await sleep(2000);
        setShowErrorAlert(false);
    }

    const shortenAddress = () => {
        return String(connectedWallet.changeAddress).slice(0, 8) + '...'
    }

    const clearWallet = (reason) => {
        try {
            setwalletLoginButton(<LoadingSpinner size={'26px'} />)
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
            setwalletLoginButton(<BiLogInCircle size={'26px'} />)
            closeWalletLogoutModal()
            setadaHandleDetected(false)
            setadaHandleName([])
            setDisplayAdaHandle(false)
            setAdaHandleSelected(undefined)
            setLogoutSuccessful(true)
            if (reason === 'logout') {
                displayLogoutAlert()
            }
            if (reason === 'error') {
                displayErrorAlert()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleAdaHandleSelect = (obj) => {
        const index = adaHandleName.indexOf(obj)
        const adaHandleSelected = adaHandleName[index]
        setAdaHandleSelected('$' + adaHandleSelected)
        setDisplayAdaHandle(true)
        closeWalletLogoutModal()
    }

    const handleLoginOption = () => {
        ''
    }

    const openLoginOptionModal = () => {
        setShowLoginOptionModal(true)
    }

    Modal.setAppElement("#root")

    return (
        <div className='hidden sm:block'> {/* hidden on mobile */}
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
                        className='p-2'
                    />
                </div>

                {/* Shows the logo and address of the connected wallet */}
                <div className={`${connectedWallet.walletIsEnabled === true ? '' : 'hidden'}`}>
                    <Button
                        title={'Wallet'}
                        func={() => openWalletLogoutModal()}
                        // label={`${connectedWallet.walletIsEnabled === true ? balanceInADA() : ''}`}
                        label={`${displayAdaHandle ? adaHandleSelected : shortenAddress()}`}
                        image={`${displayAdaHandle ? adaHandleLogo : connectedWallet.walletIcon}`}
                        imageAlt={`${connectedWallet.walletName + 'wallet logo'}`}
                        imageHeight={24}
                        imageWidth={24}
                        labelProps={'text-base pl-2'}
                        className='p-2'
                    />
                </div>
            </div>

            {/* Add another button which shows the username if user chooses email login */}

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
                            <div className='block justify-center pt-5'>
                                <Link to={'/login'}>
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
                            <span className={`${darkMode && 'text-white'} block pt-2`}>
                            This is free and does not give Gaia permission to access funds.
                            <br/>
                            </span>
                        </div>
                        <div className='flex justify-center pt-10 pb-4'>
                            <Button func={() => closeWalletSelectModal()} icon={<MdOutlineCancel />} />
                        </div>
                    </div>

                </Modal>

                {/* Handles logout options */}
                {/* !!
                        Not configured for email 
                */}
                <div>
                    <Modal
                        isOpen={showWalletLogoutModal}
                        onRequestClose={() => closeWalletLogoutModal()}
                        contentLabel="Wallet Logout Modal"
                        ariaHideApp={false} //! only false for testing change to true when done
                        className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                        overlayClassName={'overlayModal'}
                    >
                        <div className='pb-10 text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center'>
                            Options
                        </div>
                        <div className={`${adaHandleDetected ? 'pb-10' : 'hidden'}`}>
                            <div className='pb-5 flex justify-center text-white'>
                                Display ADA Handle?
                            </div>
                            <div>{adaHandleName.map(key =>
                                <div key={key} className='flex justify-center min-w-full pb-5'>
                                    <div> {/** Could add className to hide handle if picked */}
                                        <Button
                                            label={'$' + key}
                                            labelProps={'flex justify-center pl-5 pt-3'}
                                            image={adaHandleLogo}
                                            imageHeight={48}
                                            imageWidth={48}
                                            func={() => handleAdaHandleSelect(key)} />
                                    </div>
                                </div>
                            )}

                            </div>
                        </div>
                        <div className='flex justify-center pb-10 text-white'>
                            <p>{balanceInADA()}</p>
                        </div>
                        <div className='flex flex-row space-x-10'>
                            <Button
                                title={'Confirm'}
                                func={() => clearWallet('logout')}
                                icon={<BiLogOutCircle size={'26px'} />}
                                label={'Logout'}
                                labelProps={'pl-10'}
                            />
                            <Button
                                title={'Cancel'}
                                func={() => closeWalletLogoutModal()}
                                icon={<BsFillXCircleFill size={'26px'} />}
                                label={'Cancel'}
                                labelProps={'pl-10'}
                            />
                        </div>
                    </Modal>
                </div>
            </div >
        </div >
    )
}

export default LoginButton