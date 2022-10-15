import React, { useState, useEffect, useCallback } from 'react'
import Button from './Button'
import { AiOutlineWallet } from 'react-icons/ai'
import Modal from 'react-modal'
import { MdOutlineCancel } from 'react-icons/md'

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
let Buffer = require('buffer/').Buffer

const WalletConnectV2 = () => {

    const { 
        whichWalletSelected, setWhichWalletSelected,
        walletFound, setWalletFound,
        walletIsEnabled, setWalletIsEnabled,
        walletName, setWalletName,
        walletIcon, setWalletIcon,
        walletAPIVersion, setWalletAPIVerison,
        wallets, setWallets,
        networkId, setNetworkId,
        Utxos, setUtxos,
        collatUtxos, setCollatUtxos,
        balance, setBalance,
        changeAddress, setChangeAddress,
        rewardAddress, setRewardAddress,
        usedAddress, setUsedAddress,
        txBody, setTxBody,
        txBodyCborHex_unsigned, setTxBodyCborHex_unsigned,
        txBodyCborHex_signed, setTxBodyCborHex_signed,
        submittedTxHash, setSubmittedTxHash,
        API, setAPI,
        protocolParams, setProtocolParams,
    } = useStateContext()

    const [showModal, setShowModal] = useState(false)

    /**
     * Checks the browser for wallet plugins and adds them to state
     */
    const pollWallets = useCallback(() => {

        let discardedWallets = [] //remove legacy or unsupported wallets
        for (const key in window.cardano) {
            if (window.cardano[key].enable && wallets.indexOf(key) === -1) {
                if (key === 'ccvault' || key === 'typhon') {
                    discardedWallets.push(key)
                }
                else { wallets.push(key) }
            }
        }
    }, [wallets])

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
        setWhichWalletSelected(wallets[index])
        setWalletIcon(wallets[index].icon)
        closeModal()
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
        console.log('inside checkIfWalletFound:')
        console.log('whichWalletSelected', whichWalletSelected)
        console.log('key', key)
        console.log('checkIfWalletFound end')
        const walletFound = !!window?.cardano?.[key]
        setWalletFound(walletFound)
        return walletFound
    }

    /**
     * Checks if connection established with wallet
     * 
     * @returns {Promise<boolean>}
     */
    const checkIfWalletEnabled = async () => {
        let walletEnabled = false
        try {
            const name = whichWalletSelected
            walletEnabled = await window.cardano[name].isEnabled()
        } catch (err) {
            console.log(err)
        }
        setWalletIsEnabled(walletEnabled)
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
            setAPI(await window.cardano[key].enable())
        } catch (err) {
            console.log(err)
            resetWalletSelection()
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
        setWalletAPIVerison(window?.cardano?.[key].apiVersion)
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
        setWalletName(name)
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
            setNetworkId(id)
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
            setUtxos(utxos)
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
            setCollatUtxos(colUtxos)
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
            setBalance(b)
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
            setChangeAddress(changeAdd)
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
            setRewardAddress(address)
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
            setUsedAddress(address)
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Refresh data from the users wallet
     */
    const refreshData = async () => {
        console.log('re')
        generateScriptAddress()
        // console.log(generateScriptAddress())
        console.log('inside refresh data')
        try {
            checkIfWalletFound()
            console.log('wallet found', walletFound)
            if (walletFound) {
                await getAPIVersion()
                await getWalletName()
                const enabled = await enableWallet()
                console.log('wallet enabled', enabled)
                if (enabled) {
                    await getNetworkId()
                    console.log('network ID', networkId)
                    await getUtxos()
                    console.log('Utxos', Utxos)
                    // await getCollateral()
                    await getBalance()
                    console.log('balance in lovelace:', balance)
                    // await getChangeAddress()
                    // await getRewardAddresses()
                    // await getUsedAddresses()
                } else {
                    console.log('no wallet enabled branch')
                    setUtxos(null)
                    setCollatUtxos(null)
                    setBalance(null)
                    setChangeAddress(null)
                    setRewardAddress(null)
                    setUsedAddress(null)

                    setTxBody(null)
                    setTxBodyCborHex_unsigned('')
                    setTxBodyCborHex_signed('')
                    setSubmittedTxHash('')
                }
            } else {
                console.log('no wallet found branch')
                setWalletIsEnabled(false)
                setUtxos(null)
                setCollatUtxos(null)
                setBalance(null)
                setChangeAddress(null)
                setRewardAddress(null)
                setUsedAddress(null)

                setTxBody(null)
                setTxBodyCborHex_unsigned('')
                setTxBodyCborHex_signed('')
                setSubmittedTxHash('')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const resetWalletSelection = async () => {
        console.log('resetting wallet selection')
        setWalletFound(false)
        setWalletIsEnabled(false)
        setUtxos(null)
        setCollatUtxos(null)
        setBalance(null)
        setChangeAddress(null)
        setRewardAddress(null)
        setUsedAddress(null)

        setTxBody(null)
        setTxBodyCborHex_unsigned('')
        setTxBodyCborHex_signed('')
        setSubmittedTxHash('')
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

    const openModal = () => {
        pollWallets()
        setShowModal(true)
        document.body.style.overflow = 'hidden';
    }

    const closeModal = () => {
        setShowModal(false)
        document.body.style.overflow = 'unset';
    }

    const balanceInADA = () => {
        const b = 'Balance: ' + Math.round(balance / 1000000) + ' ADA'
        return b
    }

    return (
        <>
            <div className={`${walletIsEnabled === true ? 'hidden' : ''}`}>
                <Button
                    title={'Wallet'}
                    func={() => openModal()}
                    icon={<AiOutlineWallet size={'26px'} />}
                    className='p-2'
                />
            </div>
            <div className={`${walletIsEnabled === true ? '' : 'hidden'}`}>
                <Button
                    title={'Wallet'}
                    func={() => openModal()}
                    label={`${walletIsEnabled === true ? balanceInADA() : ''}`}
                    labelProps={'text-base'}
                    className='p-2'
                />
                {walletIcon}
            </div>
            <div>
                <Modal
                    isOpen={showModal}
                    onRequestClose={() => closeModal()}
                    contentLabel="Wallet Modal"
                    ariaHideApp={false} //! only false for testing change to true when done
                >
                    <div>
                        <div className='pb-20 pt-10 text-'>
                            <Title text={'Select Wallet'} size={'text-4xl'} />
                        </div>
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
                        <div className='flex justify-center pt-20 pb-4'>
                            <Button func={() => closeModal()} icon={<MdOutlineCancel />} />
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default WalletConnectV2