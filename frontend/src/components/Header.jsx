import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsSun, BsMoon } from 'react-icons/bs'
import { useStateContext } from '../context/ContextProvider'
import { BiTrendingUp } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import RefreshArticles from './RefreshArticles'
import { Button, LoginButton, SortingButton } from '../components'
import { AiOutlineHome } from 'react-icons/ai'

/**
 * Header component to be displayed on Home page
 * Contains a button to sort the articles and a shortcut to Create
 * Contains a button for wallet connectivity and another to switch dark/light mode 
 */

const Header = ({ page }) => {
    const { darkMode, setDarkMode, showLogoutAlert, showErrorAlert, sessionToken, loggedInProfile, walletUser } = useStateContext();
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
                <div className='flex min-w-full sm:w-1/2 items-center justify-center bottom-0 sm:left-24 sm:justify-end sm:top-0 sm:h-16 fixed sm:px-20 sm:py-1 opacity-100  sm:dark:bg-opacity-0 bg-white dark:bg-dark-grey'>
                    <div className='flex flex-row pr-10'>
                        <div className={`${page === 'home' ? 'block py-3 px-4' : 'hidden'} ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'}`}>
                            <RefreshArticles />
                        </div>
                        <div className={`${page === 'home' ? 'block pr-2' : 'hidden'} ${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'}`}>
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
                        <div className={`${page === 'landing' && 'hidden'} ${page === 'login' && 'hidden'} ${sessionToken && !walletUser && 'hidden'} pr-2 py-3`}>
                            <LoginButton />
                        </div>
                        <div className={`${sessionToken && !walletUser ? 'block pr-2 py-3' : 'hidden'} ${page === 'user' && 'hidden'}`}>
                            <Link to={`/profiles/${loggedInProfile.id}`}>
                                <Button label={'Profile'} labelProps={'text-sm pt-1 pl-2'} image={loggedInProfile.profile_image} imageHeight={'26px'} imageWidth={'26px'} imageAlt={''}/>
                            </Link>
                            {/* If image/username then display blah blah blah */}
                        </div>
                        {/* <div className={`${page === 'user' ? 'block pr-2 py-3' : 'hidden'}`}>
                            <Link to={'/home'}>
                                <Button label={'Home'} labelProps={'text-sm pt-1 pl-2'} icon={<AiOutlineHome size={'26px'} />} />
                            </Link>
                        </div> */}
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