import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineWallet, AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import { BsSun, BsMoon } from 'react-icons/bs'
import Button from './Button'
import { useStateContext } from '../context/ContextProvider'
import { BiTrendingUp } from 'react-icons/bi'

/**
 * Header component to be displayed on Home page
 * Contains a button to sort the articles and a shortcut to Create
 * Contains a button for wallet connectivity and another to switch dark/light mode 
 */

const Header = ( { page } ) => {
    const {
        darkMode,
        setDarkMode,
        showAlert,
        setShowAlert,
        sortBy,
        setSortBy,
    } = useStateContext();
    const [sortingIcon, setSortingIcon] = useState(<AiOutlineFire size={'26px'}/>)

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function displayAlert() {
        setShowAlert(true);
        await sleep(2000);
        setShowAlert(false);
    }

    function handleUserChoice(choice) {
        if(sortBy === 'new') {
            setSortBy('popular')
            setSortingIcon(<AiOutlineFire size={'26px'}/>)
        } else{
            setSortBy('new')
            setSortingIcon(<AiOutlineStar size={'26px'}/>)
        }
    }

    function capitalize(word) {
        return word?.charAt(0).toUpperCase() + word?.slice(1)
    }

    return (
        <div>
            <div className='flex items-end flex-col'>
            <div className='flex min-w-full sm:w-1/2 items-center justify-center bottom-0 sm:right-3 sm:justify-end sm:top-0 sm:h-16 fixed sm:px-20 sm:py-1 bg-white dark:bg-dark-grey opacity-100 sm:bg-opacity-0'>
                    {
                        showAlert && (
                            <div className='duration-900 transition-shadow opacity-100 animate-bounce
                    mt-5 bg-light-orange dark:bg-dark-orange border-black border-1 text-light-white rounded-lg'>
                                <div className='p-2'>
                                    <p>Wallet connectivity coming soon.</p>
                                </div>
                            </div>
                        )
                    }
                    <div className={`flex flex-row ${showAlert && 'hidden'}`}>
                        <div className={`py-3 px-2 flex flex-row ${page !== 'home' && 'hidden'} tooltip tooltip-bottom`} data-tip={`${capitalize(sortBy)}`}>
                            <Button 
                                title={'Sort'}
                                icon={sortingIcon}
                                func={() => handleUserChoice()}
                            />
                        </div>
                        <div className='px-2 py-3'>
                            <Button
                                title={'Wallet'}
                                func={() => {
                                    displayAlert();
                                }}
                                icon={<AiOutlineWallet size={'26px'}/>}
                                className='p-2'
                            />
                        </div>
                        <div className={`py-3 px-2 sm:hidden`}>
                            <Link to={'/trending'}>
                                <Button
                                    title={'Trending'}
                                    icon={<BiTrendingUp size={'26px'}/>}
                                />
                            </Link>
                        </div>
                        <div className='py-3 pl-2'>
                            <Button
                                title={'mode-toggle'}
                                func={() => {
                                    setDarkMode(!darkMode);
                                }}
                                icon={darkMode === false ? <BsSun size={'26px'}/> : <BsMoon size={'26px'}/>}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header