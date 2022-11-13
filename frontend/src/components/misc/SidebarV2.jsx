import React from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import { FiInfo } from 'react-icons/fi'
import { BsPen } from 'react-icons/bs'
import { Link } from 'react-router-dom';
import lightLogo from '../../assets/fpngs/tildelogolight.png'
import darkLogo from '../../assets/fpngs/tildelogodark.png'
import { useStateContext } from '../../context/ContextProvider'
import { CgProfile } from 'react-icons/cg'

/**
 * Sidebar component which allows for easy app navigation
 * Adjustments made to behaviour
 *  Sidebar is dynamic and changes size depending on the users screen
 *  Sidebar is static, button to expand sidebar has been removed
 * 
 * @returns {JSX.Element} - Dynamic sidebar
 */

const SidebarV2 = () => {
  const { darkMode, loggedInProfile, sessionToken } = useStateContext();

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
      icon: <CgProfile size={'26px'} />,
    },
    {
      link: 'about',
      display: 'about',
      icon: <FiInfo size={'26px'} />,
    },
  ];

  return (
    <div className='h-full hidden sm:block'>
      <div className='fixed left-0 h-full md:border-r-1 border-light-orange dark:border-dark-orange sm:w-28 lg:w-72 overflow-scroll'>
        <div className='dark:bg-dark-grey-lighter h-full'>
          <div className='justify-center pt-4 mb-2 p-2 hidden lg:block content-center items-center sm:flex'>
            <Link to='/home' style={{ textDecoration: 'none' }} className='flex justify-center'>
              <img src={`${darkMode ? darkLogo : lightLogo }`} alt='Gaia Icon' width='125' className='md:block hidden'/>
            </Link>
          </div>
          <div className='absolute-column justify-end content-center pt-6 mt-20 md:mt-0'>
            {
              sidebarItems.map((item) => (
                <Link 
                to={`/${item.link}`}
                key={item.display}
                style={{ textDecoration: 'none' }}
                className='items-center text-black hover:text-light-white dark:text-light-white flex capitalize rounded-full gap-x-16 p-2 hover:bg-light-orange dark:hover:bg-dark-orange px-7 cursor-pointer overflow-auto'>
                  <span className='font-semibold text-xl flex justify-center'>
                    {item.icon}
                  </span>
                  <span className='hidden lg:block font-semibold text-xl'>
                    {item.display}
                  </span>
                </Link>
              ))
            }
          </div>
        </div>

      </div>

    </div>
  )
}

export default SidebarV2