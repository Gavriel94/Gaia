import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsSun, BsMoon } from 'react-icons/bs'
import { useStateContext } from '../../context/ContextProvider'
import { BiTrendingUp } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import RefreshArticles from '../article/RefreshArticles'
import { Button, LoginButton, SortingButton } from '..'
import { AiOutlineHome } from 'react-icons/ai'
import API from '../../API'

/**
 * Dynamic header component
 * Content changes depending on the page the user is on
 * 
 * @param {string} page Dictates which components the header should display or hide 
 * 
 * @returns {JSX.Element} Header component 
 */

const Header = ({ page }) => {
    const { darkMode, setDarkMode, showLogoutAlert, showErrorAlert, loggedInProfile, walletUser } = useStateContext();
    const [showSkip, setShowSkip] = useState(true)
    let history = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkip(false)
        }, 18000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <div className='flex items-end flex-col'>
                <div className='bg-white dark:bg-dark-grey flex min-w-full sm:w-1/2 items-center justify-center bottom-0 sm:left-24 sm:justify-end sm:top-0 sm:h-16 fixed sm:px-20 sm:py-1 sm:dark:bg-opacity-0'>
                    <div className={`flex flex-row justify-end mr-10 ${page === 'landing' ? 'bg-opacity-0' : 'bg-opacity-100'} w-full`}>
                        <div className={`${page === 'home' ? 'block py-3 px-4' : 'hidden'} ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'}`}>
                            <RefreshArticles />
                        </div>
                        <div className={`${page === 'home' ? 'block pr-2 mt-3' : 'hidden'} ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'}`}>
                            <SortingButton />
                        </div>
                        <div className={`py-3 px-2 xl:hidden ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'} ${page === 'user' && 'hidden'}`}>
                            <Link to={'/trending'}>
                                <Button
                                    title={'Trending'}
                                    icon={<BiTrendingUp size={'26px'} />}
                                    label={'Trending'}
                                    labelProps={'text-sm pt-1 pl-2'}
                                />
                            </Link>
                        </div>
                        <div className={`${page === 'user' ? 'block pr-2 py-3' : page === 'edit' ? 'block pr-2 py-3' : 'hidden'}`}>
                            <Link to={'/home'}>
                                <Button label={'Home'} labelProps={'text-sm pt-1 pl-2'} icon={<AiOutlineHome size={'26px'} />} />
                            </Link>
                        </div>
                        <div className={`${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'} ${page === 'user' && 'hidden'} ${loggedInProfile.sessionToken && !walletUser && 'hidden'} pr-2 py-3`}>
                            <LoginButton />
                        </div>
                        <div className={`${loggedInProfile.sessionToken && !walletUser ? 'block pr-2 py-3' : 'hidden'} ${page === 'user' && 'hidden'}`}>
                            <Link to={`/profiles/${loggedInProfile.id}`}>
                                <Button label={loggedInProfile.username} labelProps={'text-sm pt-1 pl-2'} image={loggedInProfile.profile_image} imageHeight={'22px'} imageWidth={'22px'} imageAlt={''}/>
                            </Link>
                        </div>
                        <div className={`${page !== 'landing' && 'hidden'} py-3 ${!showSkip && 'hidden'}`}>
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
                        <div className={`${page !== 'login' ? 'hidden' : 'block'} py-3 px-2`}>
                            <Button label={"Back"}
                                func={() => history(-1)}
                            />
                        </div>

                        <div className={`${showLogoutAlert && 'hidden'} ${showErrorAlert && 'hidden'} ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'} py-3`}>
                            <Button
                                title={'mode-toggle'}
                                func={() => {
                                    setDarkMode(!darkMode);
                                }}
                                icon={darkMode === false ? <BsMoon size={'26px'} /> : <BsSun size={'26px'} />}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header