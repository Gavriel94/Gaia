import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineWallet } from 'react-icons/ai'
import { BsSun, BsMoon, BsPen } from 'react-icons/bs'
import Button from './Button'
import { useStateContext } from '../context/ContextProvider'

/**
 * Header component to be displayed on each page
 * Contains a button for wallet connectivity and another to switch dark/light mode 
 */

const Header = () => {
    const { darkMode, setDarkMode, showAlert, setShowAlert, screenSize } = useStateContext();

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function displayAlert() {
        setShowAlert(true);
        await sleep(2000);
        setShowAlert(false);
    }

    return (
        <div className={`absolute ${screenSize < 900 ? 'right-0' : 'right-3'} h-16 px-10`}>
            {
                showAlert && (
                    <div className='transition-opacity ease-in duration-700 opacity-100 animate-bounce
                    mt-5 bg-light-orange dark:bg-dark-orange border-black border-1 text-light-white rounded-lg'>
                        <div className='p-2'>
                            <p>Wallet connectivity coming soon.</p>
                        </div>
                    </div>
                )
            }
            <div className={`flex flex-row ${showAlert && 'hidden'}`}>
                <div className='px-2 py-3'>
                    <Button
                        title={'Wallet'}
                        func={() => {
                            displayAlert();
                        }}
                        icon={<AiOutlineWallet />}
                        className='p-2'
                    />
                </div>
                <div className='py-3'>
                    <Button
                        title={'mode-toggle'}
                        func={() => {
                            setDarkMode(!darkMode);
                        }}
                        icon={darkMode === false ? <BsSun /> : <BsMoon />}
                    />
                </div>
            </div>
        </div>
    )
}

export default Header