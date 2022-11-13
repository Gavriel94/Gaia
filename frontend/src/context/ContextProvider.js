import React, { createContext, useContext, useEffect, useState } from 'react';
import API from '../API'
import { BsArrowRight } from 'react-icons/bs'

/**
 * State context provider allowing variables to be passed across components
 */

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
    const [article, setArticle] = useState(null)
    const [articleList, setArticleList] = useState([])
    const [articleLoading, setArticleLoading] = useState(true)
    const [sortBy, setSortBy] = useState('new')
    const [showLogoutAlert, setshowLogoutAlert] = useState(false)
    const [showErrorAlert, setShowErrorAlert] = useState(false)
    const [displayAdaHandle, setDisplayAdaHandle] = useState(false)
    const [adaHandleSelected, setAdaHandleSelected] = useState('')

    const [adaHandleDetected, setadaHandleDetected] = useState(false)
    const [adaHandleName, setadaHandleName] = useState([])

    const [refreshing, setRefreshing] = useState(false)
    const [sessionToken, setSessionToken] = useState('')
    const [walletUser, setWalletUser] = useState(false) //True if user uses wallet login
    const [submitted, setSubmitted] = useState(false) //Used for displaying loading pages

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

    const [loggedInProfile, setLoggedInProfile] = useState({
        sessionToken: '',
        id: '',
        email: '',
        username: '',
        bio: '',
        profile_image: '',
        display_name: '',
    })

    useEffect(() => {
        if(darkMode) {
            document.body.classList.toggle('dark')
        }else {
            document.body.classList.remove('dark')
        }
    })

    /**
     * Does an initial fetch of articles and save to state context
     * Only runs once
     */
    useEffect(() => {
        const refreshArticles = () => {
            API.get('/articles/all/')
                .then((res) => {
                    setArticleList(res.data)
                })
                .catch(console.error)
        }
        refreshArticles()
    }, [])

    return (
        <StateContext.Provider
            value={{
                darkMode, setDarkMode,
                article, setArticle,
                articleList, setArticleList,
                articleLoading, setArticleLoading,
                sortBy, setSortBy,
                connectedWallet, setConnectedWallet,
                protocolParams, setProtocolParams,
                showLogoutAlert, setshowLogoutAlert,
                showErrorAlert, setShowErrorAlert,
                displayAdaHandle, setDisplayAdaHandle,
                adaHandleSelected, setAdaHandleSelected,
                refreshing, setRefreshing,
                sessionToken, setSessionToken,
                loggedInProfile, setLoggedInProfile,
                walletUser, setWalletUser,
                adaHandleDetected, setadaHandleDetected,
                adaHandleName, setadaHandleName,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);