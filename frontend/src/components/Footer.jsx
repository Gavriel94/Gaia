import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiTwitter } from 'react-icons/fi';
import { FaDiscord } from 'react-icons/fa';
import { useStateContext } from '../context/ContextProvider';
import lightLogo from '../assets/fpngs/tildelogolight.png'
import darkLogo from '../assets/fpngs/tildelogodark.png'

/**
 * Footer component to be displayed at the bottom of the page
 * Contains links to external media such as Twitter and Discord
 * Contains the project name and logo
 * 
 * 
 */

const Footer = () => {
    const { darkMode } = useStateContext();

    return (
        <div className='absolute bottom-0 justify-center w-full h-16 flex flex-row dark:bg-dark-grey pt-3'>
            <div className='px-3'>
                <NavLink to={'/coming'}>
                    <FiTwitter
                        size={'30px'}
                        color={darkMode === false ? 'black' : 'white'}
                    />
                </NavLink>
            </div>
            <div className='px-3'>
                <NavLink to={'/coming'}>
                    <FaDiscord
                        size={'30px'}
                        color={darkMode === false ? 'black' : 'white'}
                    />
                </NavLink>
            </div>
            <div className='px-3'>
                <p className='select-none font-semibold dark:text-light-white'>Project Gaia</p>
            </div>
            <div className={darkMode === false ? '' : 'hidden'}>
                <img src={lightLogo} width='40px' alt='Icon' />
            </div>
            <div className={darkMode === false ? 'hidden' : ''}>
                <img src={darkLogo} width='40px' alt='Icon' />
            </div>
        </div>
    );
};

export default Footer;