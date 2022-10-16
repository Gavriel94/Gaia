import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Button from './Button'
import LoadingSpinner from './LoadingSpinner'
import { AiOutlineWallet } from 'react-icons/ai'
import Modal from 'react-modal'
import { MdOutlineCancel } from 'react-icons/md'
import '../walletModal.css'
import { BsFillCheckCircleFill, BsFillXCircleFill } from 'react-icons/bs'

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
import Title from './Title'
import { useStateContext } from '../context/ContextProvider'
import { deepCompareKeys } from '@blueprintjs/core/lib/esm/common/utils'
import { BiBluetooth } from 'react-icons/bi'
let Buffer = require('buffer/').Buffer

const WalletConnectV2 = () => {

    const {
        connectedWallet,
        setConnectedWallet,
        protocolParams,
        darkMode
    } = useStateContext()
    const [showWalletSelectModal, setshowWalletSelectModal] = useState(false)
    const [showWalletLogoutModal, setShowWalletLogoutModal] = useState(false)
    const [wallets] = useState([])
    const [walletLoginButton, setwalletLoginButton] = useState(<AiOutlineWallet size={'26px'} />)
    const [loading, setLoading] = useState(false)
    const [walletIcons] = useState([])
    const [logoutSuccessful, setLogoutSuccessful] = useState(false)
    const [adaHandleInput, setAdaHandleInput] = useState('')


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
    var API = undefined


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
            API = await window.cardano[key].enable()
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
            const id = await API.getNetworkId()
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
            const rawUtxos = await API.getUtxos()

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
                        // console.log(`policyId: ${policyIdHex}`)
                        const assets = multiasset.get(policyId)
                        const assetNames = assets.keys();
                        const K = assetNames.len()
                        // console.log(`${K} Assets in the Multiasset`)

                        for (let j = 0; j < K; j++) {
                            const assetName = assetNames.get(j);
                            const assetNameString = Buffer.from(assetName.name(), "utf8").toString();
                            const assetNameHex = Buffer.from(assetName.name(), "utf8").toString("hex")
                            const multiassetAmt = multiasset.get_asset(policyId, assetName)
                            multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`
                            // console.log(assetNameString)
                            // console.log(`Asset Name: ${assetNameHex}`)
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
                col = await API.experimental.getCollateral()
            } else {
                col = await API.getCollateral()
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
            const balanceCBORHex = await API.getBalance()

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
            const raw = await API.getChangeAddress()
            const changeAdd = Address.from_bytes(Buffer.from(raw, "hex")).to_bech32()
            changeAddress = changeAdd
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Returns the address rewards from staking are paid into
     */
    const getRewardAddresses = async () => {
        try {
            const raw = API.getRewardAddresses()
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
            const raw = await API.getUsedAddresses()
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
                    const c = await getCollateral() // throws error
                    const b = await getBalance()
                    console.log('balance in lovelace:', balance)
                    console.log('utxos:', u)
                    console.log(API)
                    // await getChangeAddress()
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
                        collatUtxos: undefined, // undefined for now
                        balance: b,
                        changeAddress: undefined,
                        rewardAddress: undefined,
                        usedAddress: undefined,
                        API: API,
                    })
                    setLoading(false)
                } else {
                    console.log('no wallet enabled')
                    setConnectedWallet({
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
                    setLoading(false)
                }
            } else {
                console.log('no wallet found')
                setConnectedWallet({
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

    const openWalletLogoutModal = () => {
        setShowWalletLogoutModal(true)
    }

    const closeWalletLogoutModal = () => {
        setShowWalletLogoutModal(false)
    }

    const displayLogout = () => {
        return (
            <div>
                <Button func={() => setLogoutSuccessful(false)}
                    label={'Logout Success'}
                    labelProps={'font-medium pl-5'}
                    icon={<BsFillCheckCircleFill size={'24px'} />}
                />
            </div>
        )
    }

    const clearWallet = () => {
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
            setwalletLoginButton(<AiOutlineWallet size={'26px'} />)
            closeWalletLogoutModal()
            setLogoutSuccessful(true)
        } catch (err) {
            console.log(err)
        }
    }

    const handleAdaHandleInput = (e) => {
        setAdaHandleInput(e)
    }

    Modal.setAppElement("#root")

    return (
        <div className='hidden sm:block'> {/* hidden on mobile */}
            <div className={`${connectedWallet.walletIsEnabled === true ? 'hidden' : '' || logoutSuccessful === true ? 'hidden' : ''}`}>
                <Button
                    title={'Wallet'}
                    func={() => openWalletSelectModal()}
                    icon={walletLoginButton}
                    className='p-2'
                />
            </div>
            <div className={`${connectedWallet.walletIsEnabled === true ? '' : 'hidden'}`}>
                <Button
                    title={'Wallet'}
                    func={() => openWalletLogoutModal()}
                    label={`${connectedWallet.walletIsEnabled === true ? balanceInADA() : ''}`}
                    image={connectedWallet.walletIcon}
                    imageAlt={`${connectedWallet.walletName + 'wallet logo'}`}
                    imageHeight={24}
                    imageWidth={24}
                    labelProps={'text-base pl-2'}
                    className='p-2'
                />
            </div>
            <div>
                <Modal
                    isOpen={showWalletSelectModal}
                    onRequestClose={() => closeWalletSelectModal()}
                    contentLabel="Wallet Select Modal"
                    ariaHideApp={false} //! only false for testing change to true when done
                    className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                    overlayClassName={'overlayModal'}
                >
                    <div className='pt-28 text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center'>
                        Select Wallet
                    </div>
                    <div>
                        {

                            wallets.map(key =>
                                <div key={key} className='flex justify-center pt-10'>
                                    <button
                                        type='button'
                                        onClick={() => handleWalletSelect(key)}
                                        className='hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover w-80 rounded-full duration-150 ease-in-out'>
                                        <div className='flex flex-row justify-center'>
                                            <img src={window.cardano[key].icon} alt={'Wallet icon'} height={48} width={48} />
                                            <p className='pt-3'>{window.cardano[key].name}</p>
                                        </div>
                                    </button>
                                </div>
                            )}
                        <div className='flex justify-center pt-10'>
                            <input
                                className='p-5 grid-cols-2 rounded w-full py-2 px-4 appearance-none leading-tight border-2 
                                bg-light-white border-light-white input-black
                                dark:bg-dark-silver dark:border-dark-silver dark:input-light-white 
                                focus:outline-none focus:bg-light-white focus:border-light-orange'
                                required={false}
                                type='input'
                                placeholder='Ada Handle'
                                onChange={e => handleAdaHandleInput(e.target.value)}>
                            </input>
                            <div className={`${adaHandleInput === '' ? 'hidden' : 'block'} pl-3`}>
                                <Button
                                    icon={<BsFillCheckCircleFill size={'26px'} />} //! need to do submit function
                                />
                            </div>
                        </div>
                        <div className='flex justify-center pt-20 pb-4'>
                            <Button func={() => closeWalletSelectModal()} icon={<MdOutlineCancel />} />
                        </div>
                    </div>
                </Modal>
            </div>


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
                        Logout?
                    </div>
                    <div className='flex flex-row space-x-10'>
                        <Button
                            title={'Confirm'}
                            func={() => clearWallet()}
                            icon={<BsFillCheckCircleFill size={'26px'} />}
                        />
                        <Button
                            title={'Cancel'}
                            func={() => closeWalletLogoutModal()}
                            icon={<BsFillXCircleFill size={'26px'} />}
                        />
                    </div>
                </Modal>
            </div>
            <div className={`${logoutSuccessful ? 'block' : 'hidden'}`}>
                {displayLogout()}
            </div>
        </div>
    )
}

export default WalletConnectV2