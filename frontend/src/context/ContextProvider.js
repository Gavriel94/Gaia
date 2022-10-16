import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {


    /**
     * Gets the theme of the users system 
     * Uses light by default if no data is found
     */
    const getInitialTheme = () => {
        if (typeof window !== 'undefined' &&
            window.localStorage) {

            const storedPrefs =
                window.localStorage.getItem('color-theme')
            if (typeof storedPrefs === 'string') {
                return storedPrefs
            }

            const userMedia =
                window.matchMedia('(prefers-color-scheme: dark)')
            if (userMedia.matches) {
                return true
            }
        }
        return false
    }

    /**
     * General state variables 
     */
    const [darkMode, setDarkMode] = useState(getInitialTheme())
    const [screenSize, setScreenSize] = useState(undefined);
    const [article, setArticle] = useState(null)
    const [articleList, setArticleList] = useState([])
    const [articleLoading, setArticleLoading] = useState(true)
    const [sortBy, setSortBy] = useState('popular')
    const [sidebarOpen, setSidebarOpen] = useState(false);

    /**
     * State variables for connecting a wallet
     * When the wallet connects it returns a connector written to the API variable
     * All further operations on the wallet at performed using this variable
     */
    const [connectedWallet, setConnectedWallet] = useState({
        whichWalletSelected: '',
        walletFound: undefined,
        walletIsEnabled: undefined,
        walletName: undefined,
        walletIcon: [],
        walletAPIVersion: undefined,
        wallets: [],
        networkId: undefined,
        Utxos: undefined,
        collatUtxos: undefined,
        balance: undefined,
        changeAddress: undefined,
        rewardAddress: undefined,
        usedAddress: undefined,
        txBody: undefined,
        txBodyCborHex_unsigned: '',
        txBodyCborHex_signed: '',
        submittedTxHash: '',
        walletAPI: undefined
    })

    /**
     * Static protocol parameters set by Input Output Global (creators of Cardano)
     */
    const [protocolParams, setProtocolParams] = useState({
        linearFee: {
            minFeeA: "44",
            minFeeB: "155381",
        },
        minUtxo: "34482",
        poolDeposit: "500000000",
        keyDeposit: "2000000",
        maxValSize: 5000,
        maxTxSize: 16384,
        priceMem: 0.0577,
        priceStep: 0.0000721,
        coinsPerUtxoWord: "34482",
    })

    return (
        <StateContext.Provider
            value={{
                darkMode, setDarkMode,
                screenSize, setScreenSize,
                article, setArticle,
                articleList, setArticleList,
                articleLoading, setArticleLoading,
                sortBy, setSortBy,
                sidebarOpen, setSidebarOpen,
                // whichWalletSelected, setWhichWalletSelected,
                // walletFound, setWalletFound,
                // walletIsEnabled, setWalletIsEnabled,
                // walletName, setWalletName,
                // walletIcon, setWalletIcon,
                // walletAPIVersion, setWalletAPIVerison,
                // wallets, setWallets,
                // networkId, setNetworkId,
                // Utxos, setUtxos,
                // collatUtxos, setCollatUtxos,
                // balance, setBalance,
                // changeAddress, setChangeAddress,
                // rewardAddress, setRewardAddress,
                // usedAddress, setUsedAddress,
                // txBody, setTxBody,
                // txBodyCborHex_unsigned, setTxBodyCborHex_unsigned,
                // txBodyCborHex_signed, setTxBodyCborHex_signed,
                // submittedTxHash, setSubmittedTxHash,
                // API, setAPI,
                connectedWallet, setConnectedWallet,
                protocolParams, setProtocolParams,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);