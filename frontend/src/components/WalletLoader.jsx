// import React, { useEffect, useState } from 'react'
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
//     const [protocalParams] = useState({
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
//     })

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

//     const handleTabId = (tabID) => {
//         setTabID(tabID)
//     }

//     const walletSelect = (obj) => {
//         const walletSelected = obj.target.value
//         setWhichWallet(walletSelect)
//         refreshData()
//     }

//     const checkForWalletPlugin = () => {
//         const walletKey = whichWallet
//         const walletFound = window?.cardano?.walletKey
//         setWalletFound({walletFound})
//         return walletFound
//     }

//     const checkWalletEnabled = async () => {
//         let walletConnected = false
//         try {
//             const walletName = whichWallet
//             walletConnected = await window.cardano[walletName].isEnabled()
//         } catch (err) {
//             console.log(err)
//         }
//         setWalletEnabled({walletConnected})
//     }

//     const enableWallet = async () => {
//         const walletKey = whichWallet
//         try {
//             API = await window.cardano[walletKey].enable()
//         } catch (err) {
//             console.log(err)
//         }
//         return checkWalletEnabled()
//     }

//     const getAPIVersion = () => {
//         const walletKey = whichWallet
//         const walletAPIVersion = window?.cardano?.[walletKey].apiVersion
//         setWalletAPI({walletAPIVersion})
//         return walletAPIVersion
//     }

//     const getWalletName = () => {
//         const walletKey = whichWallet
//         const name = window?.cardano?.[walletKey].name
//         setWalletName(name)
//     }

//     const getNetworkID = () => {
//         try {
//             const id = API?.getNetworkID()
//             setNetworkID()
//         } catch (err) {
//             console.log(err)
//         }
//     }

//      /**
//      * Generate address from the plutus contract cborhex
//      */
//       const generateScriptAddress = () => {
//         // cborhex of the alwayssucceeds.plutus
//         // const cborhex = "4e4d01000033222220051200120011";
//         // const cbor = Buffer.from(cborhex, "hex");
//         // const blake2bhash = blake.blake2b(cbor, 0, 28);

//         const script = PlutusScript.from_bytes(Buffer.from(this.state.plutusScriptCborHex, "hex"))
//         // const blake2bhash = blake.blake2b(script.to_bytes(), 0, 28);
//         const blake2bhash = "67f33146617a5e61936081db3b2117cbf59bd2123748f58ac9678656";
//         const scripthash = ScriptHash.from_bytes(Buffer.from(blake2bhash,"hex"));

//         const cred = StakeCredential.from_scripthash(scripthash);
//         const networkId = NetworkInfo.testnet().network_id();
//         const baseAddr = EnterpriseAddress.new(networkId, cred);
//         const addr = baseAddr.to_address();
//         const addrBech32 = addr.to_bech32();

//         // hash of the address generated from script
//         console.log(Buffer.from(addr.to_bytes(), "utf8").toString("hex"))

//         // hash of the address generated using cardano-cli
//         const ScriptAddress = Address.from_bech32("addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8");
//         console.log(Buffer.from(ScriptAddress.to_bytes(), "utf8").toString("hex"))


//         console.log(ScriptAddress.to_bech32())
//         console.log(addrBech32)

//     }

//     async function refreshData() {
//         generateScriptAddress()

//         try {
//             const wallet = walletFound.checkForWalletPlugin()
//             if(wallet) {
//                 await getAPIVersion()
//                 await getWalletName()
//                 const enabledWallet = enableWallet()
//                 if(enabledWallet) {
//                     await getNetworkID()
//                     // utxos, balance, collateral, changeAddress, rewardAddress, usedAddresses
//                 } else {
//                     await  setUtxos(null) 
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     async function onLoad() {
//         checkWallets()
//         await refreshData()
//     }

//     useEffect(() => {
//         onLoad()
//     }, [])
        

//   return (
//     <div>WalletLoader</div>
//   )
// }

// export default WalletLoader