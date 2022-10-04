import React from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineWallet } from 'react-icons/ai'
import { BsSun, BsMoon, BsPen } from 'react-icons/bs'
import { TbSortDescending2 } from 'react-icons/tb'
import { MdOutlineCancel } from 'react-icons/md'
import Button from './Button'
import { useStateContext } from '../context/ContextProvider'

/**
 * Header component to be displayed on Home page
 * Contains a button to sort the articles and a shortcut to Create
 * Contains a button for wallet connectivity and another to switch dark/light mode 
 */

const HomeHeader = () => {
    const {
        darkMode,
        setDarkMode,
        showAlert,
        setShowAlert,
        screenSize,
        sortBy,
        setSortBy,
        openDropdown,
        setOpenDropdown
    } = useStateContext();

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function displayAlert() {
        setShowAlert(true);
        await sleep(2000);
        setShowAlert(false);
    }

    function handleUserChoice(choice) {
        if (choice === 'new') {
            setSortBy('new')
        }
        else {
            setSortBy('popular')
        }
        setOpenDropdown(!openDropdown)
    }

    return (
        <div className={`absolute ${screenSize < 900 ? 'right-0' : 'right-3'} h-16 `}>
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
                <div className={`${openDropdown && 'hidden'} py-3 px-2 flex flex-row`}>
                    <Button
                        title={'Sort'}
                        icon={<TbSortDescending2 />}
                        func={() => setOpenDropdown(!openDropdown)}
                    />
                </div>
                <div className={`${openDropdown === false && 'hidden'}`}>
                    <div className='py-2'>

                        <div className='bg-light-orange dark:bg-dark-orange rounded-3xl w-[150px] h-[120px] text-center'>
                            <div className='text-lg font-bold py-2 text-light-white flex flex-row text-center contents-center'>
                                <div className='flex contents-center pl-5 select-none'>
                                    Sort
                                </div>
                                <div>
                                    <button type='button' >
                                        <MdOutlineCancel className='w-[50px]' onClick={() => setOpenDropdown(false)} />
                                    </button>
                                </div>
                            </div>
                            <div className={`hover:bg-light-orange-hover pb-1 rounded-3xl ${sortBy === 'new' && 'bg-light-orange-hover dark:bg-dark-orange-hover'}`}>
                                <button type='button' onClick={() => handleUserChoice('new')} className={'text-light-white w-full'}>
                                    New
                                </button>
                            </div>
                            <div className='py-1'></div>
                            <div className={`hover:bg-light-orange-hover pb-1 rounded-3xl ${sortBy === 'popular' && 'bg-light-orange-hover dark:bg-dark-orange-hover'}`}>
                                <button type='button' onClick={() => handleUserChoice('popular')} className='text-light-white w-full'>
                                    Popular
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-2 py-3'>
                    <Link to={'/create'}>
                        <Button
                            title={'Create'}
                            icon={<BsPen />}
                            className='p-2'
                        />
                    </Link>
                </div>
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

export default HomeHeader