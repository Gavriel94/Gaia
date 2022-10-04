import React, { useEffect } from 'react'
import { AiOutlineMenu, AiOutlineHome, AiOutlineLineChart } from 'react-icons/ai'
import { FiInfo } from 'react-icons/fi'
import { BsPen } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom';
import Button from './Button'
import lightLogo from '../assets/fpngs/tildelogolight.png'
import darkLogo from '../assets/fpngs/tildelogodark.png'
import { useStateContext } from '../context/ContextProvider'

/**
 * Sidebar Component which allows for easy app navigation
 * Contains icons and shows text when expanded
 * Displays the app logo
 * 
 * ? change sidebar behaviour so the bar vanishes when the screen is small but the button remains.
 * ? onclick the button should bring out the min width sidebar for nav
 */


const Sidebar = () => {
    const { screenSize, setScreenSize, sidebarOpen, setSidebarOpen, currentMode } = useStateContext();
    const sidebarItems = [
        {
            name: 'home',
            icon: <AiOutlineHome />,
        },
        {
            name: 'create',
            icon: <BsPen />,
        },
        {
            name: 'market',
            icon: <AiOutlineLineChart />,
        },
        {
            name: 'about',
            icon: <FiInfo />,
        },
    ];

    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [setScreenSize]);

    //! Causes glitchy effect when screen size < 900 instead of closing cleanly
    // useEffect(() => {
    //     if (screenSize <= 900) {
    //         setSidebarOpen(!sidebarOpen);
    //     }
    // }, [screenSize, setSidebarOpen, sidebarOpen]);

    return (
        <div className='h-full w-72 fixed'>
            <div
                className={`absolute left-0 ${sidebarOpen ? 'w-72' : 'w-20'} 
                h-full border-r-1 border-light-orange dark:border-dark-orange border-opacity-50 bg-white
                ${screenSize < 900 ? 'w-20' : sidebarOpen}`}
            >
                <div className='dark:bg-dark-grey h-full'>
                    <div className={`absolute -right-3 top-4 w-9 ${screenSize < 900 ? 'invisible' : 'visible'}`}>
                        <Button
                            title={'Menu'}
                            func={() => {
                                setSidebarOpen(!sidebarOpen);
                            }}
                            icon={<AiOutlineMenu />}
                        />
                    </div>
                    <div className='flex justify-center py-0 pt-4 pb-2'>
                        <Link to='/home'>
                            <img
                                src={`${currentMode === 'dark' ? darkLogo : lightLogo}`}
                                className={`${sidebarOpen ? 'w-40' : 'w-0'}`}
                                alt='icon'
                            />
                        </Link>
                    </div>
                    <div className={`absolute-column justify-right content-center mt-10`}>
                        {sidebarItems.map((item) => (
                            <NavLink
                                to={`/${item.name}`}
                                key={item.name}
                                className='text-xl items-center text-black hover:text-light-white dark:text-light-white flex capitalize rounded-full
                  gap-x-16 py-2 hover:bg-light-orange dark:hover:bg-dark-orange px-7 cursor-default ease-in-out mt-2 overflow-auto'
                            >
                                {item.icon}
                                <span
                                    className={`${!sidebarOpen && 'hidden'} origin-left `}
                                >
                                    {item.name}
                                </span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar