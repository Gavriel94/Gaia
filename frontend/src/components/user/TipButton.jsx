import React from 'react'
import Button from '../misc/Button'
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
} from "@emurgo/cardano-serialization-lib-asmjs"
import { useStateContext } from '../../context/ContextProvider'
let Buffer = require('buffer/').Buffer

/**
 * Functional tip button which allows a logged in user to send ADA to an authors wallet
 * 
 * @param {String} authorUsername - username of tip recipient
 * @param {String} amountInAda - Amount to tip author (must be >=1₳) 
 * @returns 
 */

/**
 * TODO: Input field for amount of ADA
 * ! Amount cannot be less than 1 ADA 
 * Mention how fees are included automatically
 * Produce visual feedback for sucessful transaction
 * Error handle empty wallet, attempts of <1 ADA and transaction cancelled flows
 * 
 */

const TipButton = ({ authorUsername, amountInADA }) => {

    const { connectedWallet } = useStateContext()

    const getTxUnspentOutputs = async () => {
        let outputs = TransactionUnspentOutputs.new()
        console.log(connectedWallet.Utxos)
        for (const utxo of connectedWallet.Utxos) {
            outputs.add(utxo.TransactionUnspentOutput)
        }
        return outputs
    }

    const buildADATransaction = async () => {
        // Protocol parameters set by IOG
        const linearFee = LinearFee.new(
            BigNum.from_str('44'),
            BigNum.from_str('155381')
        );
        const txBuilderCfg = TransactionBuilderConfigBuilder.new()
            .fee_algo(linearFee)
            .pool_deposit(BigNum.from_str('500000000'))
            .key_deposit(BigNum.from_str('2000000'))
            .max_value_size(4000)
            .max_tx_size(8000)
            .coins_per_utxo_word(BigNum.from_str('34482'))
            .build();

        const txBuilder = TransactionBuilder.new(txBuilderCfg);

        // recipient address
        const shelleyOutputAddress = Address.from_bech32(authorUsername);
        // sender address
        const shelleyChangeAddress = Address.from_bech32(connectedWallet.changeAddress);

        // 1 ADA = 1,000,000 Lovelace
        const strAmountInLovelace = (amountInADA * 1000000).toString()
        
        console.log('strAmountInLovelace', strAmountInLovelace)

        // add output to the tx
        txBuilder.add_output(
            TransactionOutput.new(
                shelleyOutputAddress,
                Value.new(BigNum.from_str(strAmountInLovelace))
            ),
        );

        // Use available UTxOs to converge funds for transaction
        const txUnspentOutputs = await getTxUnspentOutputs();
        txBuilder.add_inputs_from(txUnspentOutputs, 1)

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
        console.log(submittedTxHash)
        console.log('Transaction successful')
    }

    return (
        <div className='mt-5'>
            <Button label={'Tip ₳'} func={() => buildADATransaction()} />
        </div>
    )
}

export default TipButton