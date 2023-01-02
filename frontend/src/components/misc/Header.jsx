import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsSun, BsMoon } from 'react-icons/bs'
import { useStateContext } from '../../context/ContextProvider'
import { BiTrendingUp } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import RefreshArticles from '../article/RefreshArticles'
import { Button, LoginButton, SortingButton, NotificationsButton } from '..'
import { IoArrowBack } from 'react-icons/io5'

/**
 * Dynamic header component
 * Content changes depending on the page the user is on
 * 
 * @param {string} page Dictates which components the header should display or hide 
 * 
 * @returns {JSX.Element} Header component 
 */

const Header = ({ page }) => {
    const { darkMode, setDarkMode, showErrorAlert, walletUser } = useStateContext();
    const [showSkipButton, setShowSkipButton] = useState(true)
    let history = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkipButton(false)
        }, 18000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <div className='flex items-end flex-col'>
                <div className={`flex min-w-full sm:w-1/2 items-center justify-center bottom-0 sm:left-24 sm:justify-end sm:top-0 sm:h-16 fixed sm:px-20 sm:py-1 border-b-1 border-light-orange dark:border-dark-orange dark:bg-dark-grey-lighter bg-white ${page === 'landing' && 'bg-opacity-0'}`}>
                    <div className={`flex flex-row justify-end pr-10 w-full`}>
                        <div className={`${page !== 'home' ? 'hidden' : 'block py-3 pr-2'}`}>
                            <RefreshArticles />
                        </div>
                        <div className={`${page !== 'home' ? 'hidden' : 'block py-3 pr-2'}`}>
                            <SortingButton />
                        </div>
                        <div className={`${page === 'landing' ? 'hidden' : page === 'login' ? 'hidden' : page === 'user' ? 'hidden' : 'py-3 pr-2 xl:hidden'}`}>
                            <Link to={'/trending'}>
                                <Button
                                    title={'Trending'}
                                    icon={<BiTrendingUp size={'26px'} />}
                                    label={'Trending'}
                                    labelProps={'text-sm pt-1 pl-2'}
                                />
                            </Link>
                        </div>
                        <div className={`${page === 'edit' ? 'block pr-2 py-3' : page === 'articleDetail' ? 'block pr-2 py-3' : page === 'login' ? 'block pr-2 py-3' : page === 'thread' ? 'block pr-2 py-3' : 'hidden'}`}>
                            <Button label={'Back'} labelProps={'text-sm pt-1 pl-2'} icon={<IoArrowBack size={'26px'} />} func={() => history(-1)} />
                        </div>
                        <div className={`${page === 'landing' ? 'hidden' : page === 'login' ? 'hidden' : page === 'user' ? 'hidden' : 'py-3 pr-2'}`}>
                            <LoginButton />
                        </div>
                        <div className={`${page === 'landing' ? 'hidden' : page === 'login' ? 'hidden' : walletUser === false ? 'hidden' : 'block pr-2 py-3'}`}>
                            <NotificationsButton />
                        </div>
                        <div className={`${showErrorAlert ? 'hidden' : page === 'landing' ? 'hidden' : page === 'login' ? 'hidden' : 'py-3'}`}>
                            <Button
                                title={'mode-toggle'}
                                func={() => {
                                    setDarkMode(!darkMode);
                                }}
                                icon={darkMode === false ? <BsMoon size={'26px'} /> : <BsSun size={'26px'} />}
                            />
                        </div>
                        <div className={`${page !== 'landing' && 'hidden'} py-3 ${!showSkipButton && 'hidden'}`}>
                            <Link to={'/home'}>
                                <button
                                    type='button'
                                    className='rounded-full
                                        bg-black text-light-white dark:hover:text-dark-orange dark:text-white py-2 px-4 text-xl font-bold transition-color duration-500 cursor-pointer'>
                                    <div className='flex flex-row text-center justify-center'>
                                        <div>Skip</div>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header