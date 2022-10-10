// import React, { useState } from 'react'
// import {
//     Address,
//     BaseAddress,
//     MultiAsset,
//     Assets,
//     ScriptHash,
//     Costmdls,
//     Language,
//     CostModel,
//     AssetName,
//     TransactionUnspentOutput,
//     TransactionUnspentOutputs,
//     TransactionOutput,
//     Value,
//     TransactionBuilder,
//     TransactionBuilderConfigBuilder,
//     TransactionOutputBuilder,
//     LinearFee,
//     BigNum,
//     BigInt,
//     TransactionHash,
//     TransactionInputs,
//     TransactionInput,
//     TransactionWitnessSet,
//     Transaction,
//     PlutusData,
//     PlutusScripts,
//     PlutusScript,
//     PlutusList,
//     Redeemers,
//     Redeemer,
//     RedeemerTag,
//     Ed25519KeyHashes,
//     ConstrPlutusData,
//     ExUnits,
//     Int,
//     NetworkInfo,
//     EnterpriseAddress,
//     TransactionOutputs,
//     hash_transaction,
//     hash_script_data,
//     hash_plutus_data,
//     ScriptDataHash, Ed25519KeyHash, NativeScript, StakeCredential
// } from "@emurgo/cardano-serialization-lib-asmjs"
// // let Buffer = require('buffer/').Buffer

// const WalletLoader = () => {

//     const [tabID, setTabID] = useState('1')
//     const [whichWallet, setWhichWallet] = useState(undefined)
//     const [walletFound, setWalletFound] = useState(false)
//     const [walletEnabled, setWalletEnabled] = useState(false)
//     const [walletName, setWalletName] = useState(undefined)
//     const [walletIcon, setWalletIcon] = useState(undefined)
//     const [walletAPI, setWalletAPI] = useState(undefined)
//     const [wallets, setWallets] = useState([])

//     const [networkID, setNetworkID] = useState(undefined)
//     const [utxos, setUtxos]  = useState(undefined)
//     const [collatUtxos, setCollatUtxos] = useState(undefined)
//     const [balance, setBalance] = useState(undefined)
//     const [changeAddress, setChangeAddress] = useState(undefined)
//     const [rewardAddress, setRewardAddress] = useState(undefined)
//     const [usedAddress, setUsedAddress] = useState(undefined)

//     const [txBody, setTxBody] = useState(undefined)
//     const [txBodyCborHex_unsigned, setTxBodyCborHex_unsigned] = useState('')
//     const [txBodyCborHex_signed, setTxBodyCborHex_signed] = useState('')
//     const [submittedTxHash, setSubmittedTxHash] = useState('')

//     /**
//      * Connected wallet returns a connector, which is written to this variable.
//      * All subsequent operations run using this object
//      */
//     const [API, setAPI] = useState(undefined)

//     /**
//      * Static protocol parameters defined by Cardano
//      */
//     const protocalParams = {
//         linearFee: {
//             minFeeA: "44",
//             minFeeB: "155381",
//         },
//         minUtxo: "34482",
//         poolDeposit: "500000000",
//         keyDeposit: "2000000",
//         maxValSize: 5000,
//         maxTxSize: 16384,
//         priceMem: 0.0577,
//         priceStep: 0.0000721,
//         coinsPerUtxoWord: "34482",
//     }

//     /**
//      * Checks the browser for wallet plugins
//      * Runs three times in case the browser window loads before the plugins do
//      * 
//      * @param count try count 
//      */
//     const checkWallets = (count = 0) => {
//         const walletCheck = []
//         for(const key in window.cardano) {
//             if(window.cardano[key].enable && wallets.indexOf(key) === -1) {
//                 wallets.push(key)
//             }
//         }
//         if(wallets.length === 0 && count < 3) {
//             setTimeout(() => {
//                 checkWallets(count+1)
//             }, 1000)
//             return
//         }
//         setWallets(walletCheck)
//         setWhichWallet(walletCheck[0])
//     }
        

//   return (
//     <div>WalletLoader</div>
//   )
// }

// export default WalletLoader