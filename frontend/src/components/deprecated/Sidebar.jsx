import React, { useEffect, useState } from 'react'
import { AiOutlineMenu, AiOutlineHome } from 'react-icons/ai'
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs'
import { FiInfo } from 'react-icons/fi'
import { BsPen } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import { Link, NavLink } from 'react-router-dom';
import Button from '../misc/Button'
import lightLogo from '../../assets/fpngs/tildelogolight.png'
import darkLogo from '../../assets/fpngs/tildelogodark.png'
import { useStateContext } from '../../context/ContextProvider'
import { CgProfile } from 'react-icons/cg'

//! Deprecated 13/11/2022

/**
 * Sidebar component which allows for easy app navigation
 * Sidebar is expandable when the user screen size is lg showing Gaia logo and button labels
 * 
 * @returns {JSX.Element} - Dynamic sidebar
 */

const Sidebar = () => {
    const { darkMode, sidebarOpen, setSidebarOpen, loggedInProfile, sessionToken, sidebarButton, setSidebarButton } = useStateContext();

    const sidebarItems = [
        {
            link: 'home',
            display: 'home',
            icon: <AiOutlineHome size={'26px'} />,
        },
        {
            link: 'create',
            display: 'write',
            icon: <BsPen size={'26px'} />,
        },
        {
            link: `${sessionToken ? `profiles/${loggedInProfile.id}` : 'login'}`,
            display: 'profile',
            icon: <CgProfile size={'26px'}/>,
        },
        {
            link: 'about',
            display: 'about',
            icon: <FiInfo size={'26px'} />,
        },
    ];

    const handleOpenSidebar = () => {
        if (sidebarOpen) {
            setSidebarOpen(false)
            setSidebarButton(<BsArrowRight size={'26px'} />)
        }
        else {
            setSidebarOpen(true)
            setSidebarButton(<BsArrowLeft size={'26px'} />)
        }
    }

    return (
        <div className={`h-full w-72 fixed bg-opacity-100 hidden md:block`}>
            <div
                className={`absolute left-0 h-full xl:border-r-1 border-light-orange dark:border-dark-orange 
                ${sidebarOpen ? 'w-72 duration-500' : 'w-20 duration-500'}`
                }
            >
                <div className='dark:bg-dark-grey-lighter h-full'>
                    <div className={`absolute -right-3 top-4 w-9 hidden xl:block`}>
                        <Button
                            title={'Menu'}
                            func={() => handleOpenSidebar()}
                            icon={sidebarButton}
                        />
                    </div>
                    <div className='flex justify-center py-0 pt-4 pb-2'>
                        <Link to='/home' style={{ textDecoration: 'none' }}>
                            <img
                                src={`${darkMode === true ? darkLogo : lightLogo}`}
                                className={`${sidebarOpen ? 'w-40 duration-500' : 'w-0 duration-500'} hidden md:block`}
                                alt='icon'
                            />
                        </Link>
                    </div>
                    <div className={`absolute-column justify-right content-center pt-16`}>
                        {sidebarItems.map((item) => (
                            <Link style={{ textDecoration: 'none' }}
                                to={`/${item.link}`}
                                key={item.display}
                                className='items-center text-black hover:text-light-white dark:text-light-white flex capitalize rounded-full
                                gap-x-16 py-2 hover:bg-light-orange dark:hover:bg-dark-orange xl:dark:hover:bg-dark-orange px-7 cursor-pointer mt-2 overflow-auto'
                            >
                                <span className={`${!sidebarOpen && 'duration-500'} ease-in-out duration-500 origin-left font-semibold text-xl`}>
                                    {item.icon}
                                </span>
                                <span className={`${!sidebarOpen && 'hidden'} flex ease-in-out duration-500 origin-left font-semibold text-xl`}>
                                    {item.display}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar