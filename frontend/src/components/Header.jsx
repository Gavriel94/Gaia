import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineWallet, AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import { BsSun, BsMoon } from 'react-icons/bs'
import Button from './Button'
import { useStateContext } from '../context/ContextProvider'
import { BiTrendingUp } from 'react-icons/bi'
import WalletConnectV2 from './WalletConnectV2'


/**
 * Header component to be displayed on Home page
 * Contains a button to sort the articles and a shortcut to Create
 * Contains a button for wallet connectivity and another to switch dark/light mode 
 */

const Header = ({ page }) => {
    const { sortBy, setSortBy, darkMode, setDarkMode } = useStateContext();
    const [sortingIcon, setSortingIcon] = useState(<AiOutlineStar size={'26px'} />) //initial icon because popular is default sort

    function handleUserChoice(choice) {
        if (sortBy === 'new') {
            setSortBy('popular')
            setSortingIcon(<AiOutlineStar size={'26px'} />)
        } else {
            setSortBy('new')
            setSortingIcon(<AiOutlineFire size={'26px'} />)
        }
    }

    return (
        <div>
            <div className='flex items-end flex-col'>
                <div className='flex min-w-full sm:w-1/2 items-center justify-center bottom-0 sm:right-3 sm:justify-end sm:top-0 sm:h-16 fixed sm:px-20 sm:py-1 bg-white dark:bg-dark-grey opacity-100 sm:bg-opacity-0'>
                    <div className='flex flex-row'>
                        <div className={`py-3 px-2 flex flex-row ${page !== 'home' && 'hidden'}`} title={`${sortBy === 'new' ? 'Popular' : 'New'}`}>
                            <Button
                                title={'Sort'}
                                icon={sortingIcon}
                                func={() => handleUserChoice()}
                            />
                        </div>
                        <div className='px-2 py-3'>
                            <WalletConnectV2 />
                        </div>
                        <div className={`py-3 px-2 sm:hidden`}>
                            <Link to={'/trending'}>
                                <Button
                                    title={'Trending'}
                                    icon={<BiTrendingUp size={'26px'} />}
                                />
                            </Link>
                        </div>
                        <div className='py-3 pl-2'>
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