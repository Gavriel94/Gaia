import React from 'react'
import { InputField, Button, Title, LoginAlert } from '..'
import {
    TransactionOutput,
    TransactionBuilder,
    TransactionBuilderConfigBuilder,
    LinearFee,
    BigNum,
    TransactionWitnessSet,
    Transaction,
    Value,
    TransactionUnspentOutputs,
    Address,
    TransactionBuilderConfig,
} from "@emurgo/cardano-serialization-lib-asmjs"
import { useStateContext } from '../../context/ContextProvider'
import Modal from 'react-modal'
import { useState } from 'react'
import '../../walletModal.css'
import { MdCheck, MdOutlineCancel } from 'react-icons/md'
let Buffer = require('buffer/').Buffer

/**
 * Functional tip button which allows a logged in user to send ADA to an authors wallet
 * 
 * @param {String} authorUsername - username of tip recipient
 * @param {String} amountInAda - amount to tip author (must be >=1₳) 
 * 
 * @returns {JSX.Element} - button for user to execute tipping feature
 */

const TipButton = ({ authorUsername }) => {

    const { connectedWallet, darkMode, walletUser, loginAlert, setLoginAlert } = useStateContext()
    const [openModal, setOpenModal] = useState(false)
    const [tipAmount, setTipAmount] = useState('')
    const [amountError, setAmountError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [tipSuccessful, setTipSuccessful] = useState(false)

    const getTxUnspentOutputs = async () => {
        let outputs = TransactionUnspentOutputs.new()
        for (const utxo of connectedWallet.Utxos) {
            outputs.add(utxo.TransactionUnspentOutput)
        }
        return outputs
    }

    const printAll = (
            linearFee, 
            txBuilderCfg, 
            txBuilder, 
            shelleyOutputAddress, 
            shelleyChangeAddress, 
            strAmountInLovelace, 
            txUnspentOutputs, 
            txBody, 
            transactionWitnessSet, 
            tx, 
            txVkeyWitnesses, 
            signedTx,
            submittedTxHash
        ) => {
        console.log('linearFee', linearFee)
        console.log('txBuilderCfg', txBuilderCfg)
        console.log('txBuilder', txBuilder)
        console.log('shelleyOutputAddress', shelleyOutputAddress)
        console.log('shelleyChangeAddress', shelleyChangeAddress)
        console.log('strAmountInLovelace', strAmountInLovelace)
        console.log('txBuilder post build', txBuilder)
        console.log('txUnspentOutputs', txUnspentOutputs)
        console.log('txBody', txBody)
        console.log('transactionWitnessSet', transactionWitnessSet)
        console.log('tx', tx)
        console.log('txVkeyWitnesses', txVkeyWitnesses)
        console.log('signedTx', signedTx)
        console.log('submittedTxHash', submittedTxHash)
    }

    const buildADATransaction = async (amountInADA) => {
        try {
            const protocol_params = {
                linearFee: {
                    minFeeA: '44',
                    minFeeB: '155381'
                },
                minUtxo: '34482',
                poolDeposit: '500000000',
                keyDeposit: '2000000',
                maxValSize: 5000,
                maxTxSize: 16384,
                priceMem: 0.0577,
                priceStep: 0.0000721,
                coinsPerUtxoWord: '34482',
            }

            const txBuilder = TransactionBuilder.new(
                TransactionBuilderConfigBuilder.new()
                .fee_algo(
                    LinearFee.new(
                        BigNum.from_str(protocol_params.linearFee.minFeeA),
                        BigNum.from_str(protocol_params.linearFee.minFeeB)
                    )
                )
                .pool_deposit(BigNum.from_str(protocol_params.poolDeposit))
                .key_deposit(BigNum.from_str(protocol_params.keyDeposit))
                .coins_per_utxo_word(BigNum.from_str(protocol_params.coinsPerUtxoWord))
                .max_value_size(protocol_params.maxValSize)
                .max_tx_size(protocol_params.maxTxSize)
                .prefer_pure_change(true)
                .build()        
            )

            // tip recipient address
            const shelleyOutputAddress = Address.from_bech32(authorUsername);
            // tip sender address (receives change)
            const shelleyChangeAddress = Address.from_bech32(connectedWallet.changeAddress);

            // 1 ADA = 1,000,000 Lovelace
            const strAmountInLovelace = (amountInADA * 1000000).toString()

            // Use available UTxOs to converge funds for transaction
            const txUnspentOutputs = await getTxUnspentOutputs();
            txBuilder.add_inputs_from(txUnspentOutputs, 3)

            // add output to the tx
            txBuilder.add_output(
                TransactionOutput.new(
                    shelleyOutputAddress,
                    Value.new(BigNum.from_str(strAmountInLovelace))
                ),
            );

            // Calculate min-fee and register change address
            txBuilder.add_change_if_needed(shelleyChangeAddress)

            // Build transaction with no witnesses
            const txBody = txBuilder.build();


            // Tx witness
            const transactionWitnessSet = TransactionWitnessSet.new();

            const tx = Transaction.new(
                txBody,
                TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
            )

            let txVkeyWitnesses = await connectedWallet.walletAPI.signTx(Buffer.from(tx.to_bytes(), "utf8").toString("hex"), true);
            txVkeyWitnesses = TransactionWitnessSet.from_bytes(Buffer.from(txVkeyWitnesses, "hex"));

            transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

            const signedTx = Transaction.new(
                tx.body(),
                transactionWitnessSet
            );


            const submittedTxHash = await connectedWallet.walletAPI.submitTx(Buffer.from(signedTx.to_bytes(), "utf8").toString("hex"));

            setOpenModal(false)
            setTipSuccessful(true)
 
        } catch (err) {
            console.log(err)
            if (err === 'UTxO Balance Insufficient') {
                setAmountError(true)
                setErrorMessage('Insufficient balance')
            }
            if (err === 'Value 0 less than the minimum UTXO value 969750') {
                setAmountError(true)
                setErrorMessage('Tip must be at least 1₳')
            }
        }
    }

    const createTip = () => {
        if(!walletUser) {
            setLoginAlert(true)
            return
        }
        setOpenModal(true)
        if (tipSuccessful) {
            setTipSuccessful(false)
        }
    }

    const cancelTip = () => {
        setOpenModal(false)
        document.body.style.overflow = 'unset';
    }

    const handleTipAmount = (e) => {
        setTipAmount(e)
        if (amountError) {
            setAmountError(false)
            setErrorMessage('')
        }
    }

    const confirmSuccess = () => {
        setTipSuccessful(false)
        document.body.style.overflow = 'unset';
    }

    const displayBalance = () => {
        if(walletUser) {
            return (
                <div>
                    Wallet balance: {connectedWallet.balance / 1000000}₳
                </div>
            )
        } else {
            return (
                <div>
                    Login to view your balance
                </div>
            )
        }
    }

    Modal.setAppElement("#root")

    return (
        <>
            <div className='mt-5'>
                {/* <Button label={'Tip ₳'} func={() => buildADATransaction()} /> */}
                <Button label={'Tip ₳'} func={() => createTip()} />
            </div>
            <Modal
                isOpen={tipSuccessful}
                onRequestClose={() => setTipSuccessful(false)}
                contentLabel="Tip Success"
                ariaHideApp={false}
                className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                overlayClassName={'overlayModal'}
            >
                <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                    Tip Success
                </div>
                <div className='font-bold text-light-white transition-colors duration-500 select-none text-center mt-5'>
                    {tipAmount}₳ sent to {authorUsername?.slice(0, 12) + '...'}
                </div>
                <div className='flex flex-row justify-center mt-5 space-x-5'>
                    <Button func={() => confirmSuccess()} icon={<MdOutlineCancel size={'26px'} />} />
                </div>
            </Modal>

            <Modal
                isOpen={openModal}
                onRequestClose={() => setOpenModal(false)}
                contentLabel="Tip Modal"
                ariaHideApp={false}
                className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                overlayClassName={'overlayModal'}
            >
                <div>
                    <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                        Tip
                    </div>
                    <div className='flex flex-row mt-5'>
                        <InputField
                            required={true}
                            type='input'
                            placeholder='Value in ADA'
                            defaultValue={''}
                            borderColor={`${amountError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                            onChange={e => handleTipAmount(e.target.value)}
                        />
                        <div className='text-4xl font-bold mt-2 pl-2
                    text-light-white
                    transition-colors duration-500 select-none text-center'>
                            ₳
                        </div>
                    </div>
                    <div className='text-sm text-light-white transition-colors duration-500 select-none text-center mt-5'>
                        {displayBalance()}
                    </div>
                    <div className={`${amountError ? 'hidden' : 'font-bold text-light-white transition-colors duration-500 select-none text-center mt-5'}`}>
                        <div>
                            Tips cannot be less than 1₳
                        </div>
                        <div>
                            Each tip requires a wallet signature
                        </div>
                    </div>
                    <div className={`${amountError ? 'block font-bold text-light-white transition-colors duration-500 select-none text-center mt-5' : 'hidden'}`}>
                        {errorMessage}
                    </div>
                    <div className='flex flex-row justify-center mt-5 space-x-5'>
                        <Button func={() => buildADATransaction(tipAmount)} icon={<MdCheck size={'26px'} />} />
                        <Button func={() => cancelTip()} icon={<MdOutlineCancel size={'26px'} />} />
                    </div>
                </div>
            </Modal>
            <LoginAlert open={loginAlert}/>
        </>
    )
}

export default TipButton