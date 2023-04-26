import React from 'react'
import { Header, SidebarV2, Title, Footer } from '../../components'
import Typhon from '../../assets/WalletGuide/Typhon.png'
import TyphonExtension from '../../assets/WalletGuide/TyphonExtension.png'
import DetailsFilled from '../../assets/WalletGuide/DetailsFilled.png'
import CreatedWallet from '../../assets/WalletGuide/CreatedWallet.png'
import LoginButton from '../../assets/WalletGuide/LoginButton.png'
import Success from '../../assets/WalletGuide/Success.png'


/**
 * Page to contain information for user to create a wallet
 */
const WalletInstructions = () => {
    return (
        <>
            <Header page={'home'} />
            <SidebarV2 />
            <div className='flex justify-center mt-20'>
                <Title text={'Wallet Guide'} size={'text-6xl'} hover={true} />
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-20'>
                <div className='mt-5'>
                    This guide will explain how to download and install the Typhon browser extension, giving you access to a Cardano wallet.
                </div>
                <div className='mt-5'>
                    If you'd like to learn more about Cardano you can find information <a href="https://cardano.org">here</a>
                </div>
                <div className='mt-5'>
                    This guide focuses on Typhon wallets as they are easy to use and setup.
                </div>
                <div className='mt-5'>
                    Gaia supports both Typhon and Eternl wallets however other applications supporting the Cardano blockchain may support wallets such as <a href="https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo">Nami</a>, <a href="https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb">Yoroi</a> and <a href="https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe">GeroWallet</a>
                </div>


                <div className='mt-5'>
                    First, download the <a href="https://www.google.com/intl/en_uk/chrome/">Google Chrome</a> browser.
                </div>
                <div className='mt-5'>
                    It is the most stable and supported browser for all web3 apps as it has access to a variety of wallets for many blockchains.
                </div>
                <div className='mt-5'>
                    Navigate to the <a href="https://chrome.google.com/webstore/category/extensions">Chrome Web Store</a> to find the <a href="https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh">Typhon extension</a>
                </div>
            </div>
            <div className='mt-5 flex justify-center'>
                <a href="https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh"><img src={Typhon} width={'500px'} alt={'Typhon extension'} /></a>
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-5'>
                Once the extension has been installed create a wallet
            </div>
            <div className='mt-5 flex justify-center justify-items-center'>
                <div>
                    <img src={TyphonExtension} width={'400px'} alt={'Typhon extension'} />
                </div>
                <div>
                    <img src={DetailsFilled} width={'425px'} alt={'Typhon extension'} />
                </div>
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-5'>
                You'll be given a phrase of 15 words. Write these down as it'll ask for them back.
                <div className='mt-5'>
                    Keep them safe. With this mnemonic anyone can access your wallet.
                </div>
            </div>
            <div className='mt-5 flex justify-center justify-items-center'>
                <img src={CreatedWallet} width={'400px'} alt={'Typhon Wallet'} />
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-5'>
                That's it! You now have a fully functional Cardano wallet!
                <div className='flex justify-center dark:text-white text-center mt-5'>
                    Navigate back to Gaia and click login
                </div>
            </div>
            <div className='mt-5 flex justify-center justify-items-center'>
                <img src={LoginButton} width={'400px'} alt={'Login Button'} />
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-5'>
                Select Cardano and click Typhon
                <div className='flex justify-center dark:text-white text-center'>
                    A pop-up appears from Typhon confirming you want to connect to Gaia
                </div>
            </div>
            <div className='flex justify-center m-auto text-center dark:text-white w-1/2 mt-5'>
                This does not give Gaia access to funds here or in the future.
            </div>
            <div className='flex justify-center dark:text-white text-center mt-5'>
                Funds can only leave your wallet when you confirm you want to tip another user
            </div>
            <div className='mt-5 flex justify-center justify-items-center'>
                <img src={Success} width={'400px'} alt={'Logged In'} />
            </div>
            <div className='flex justify-center dark:text-white text-center mt-5'>
                The wallet logo and a slice of the address showing in the button indicates you are logged in!
            </div>
            <div className='flex justify-center dark:text-white text-center mt-5'>
                Your Gaia account is linked to this wallet. Using another wallet to sign in will not contain the same data
            </div>
            <div className='flex justify-center dark:text-white text-center mt-5 mb-20'>
                <Title text={'Enjoy Gaia!'} size={'text-2xl'}/>
            </div>
        </>
    )
}

export default WalletInstructions