import React from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../../context/ContextProvider';
import lightLogo from '../../assets/fpngs/tildelogolight.png'
import darkLogo from '../../assets/fpngs/tildelogodark.png'

/**
 * Footer component to be displayed at the bottom of the page
 * Contains links to external media such as Twitter and Discord
 * Contains the project name and logo
 * 
 * @returns {JSX.Element} Footer component
 */

const Footer = () => {
    const { darkMode } = useStateContext();

    return (
        <div className='hidden sm:flex bottom-0 mt-auto justify-center w-full h-16 flex-row  pt-3'>
            <Link to={'/about'} style={{ textDecoration: 'none' }}>
                <div className='flex flex-row'>
                    <div className='px-3'>
                        <p className='select-none font-semibold dark:text-light-white mt-2'>Gaia</p>
                    </div>
                    <div className={darkMode === false ? '' : 'hidden'}>
                        <img src={lightLogo} width='40px' alt='Icon' />
                    </div>
                    <div className={darkMode === false ? 'hidden' : ''}>
                        <img src={darkLogo} width='40px' alt='Icon' />
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Footer;