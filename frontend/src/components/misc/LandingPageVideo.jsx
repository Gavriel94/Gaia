import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GaiaAnim from '../../assets/NewLandingVideo.mp4'
import '../../video.css'
import { CgEnter } from 'react-icons/cg'

/**
 * Autoplays the landing page video
 * 
 * @returns {JSX.Element} - Introduction video
 */

const LandingPageVideo = () => {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 21000);
    return () => clearTimeout(timer);
  }, [showButton]);

  return (
    <>

      <div className='video-container'>
        <video autoPlay muted src={GaiaAnim} />
      </div>
      <div className={`${showButton ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'hidden'}`}>
        <Link to={'/home'}>
          <button
            type='button'
            className='rounded-full
          bg-black text-light-white dark:hover:text-dark-orange dark:text-white py-2 px-4 text-xl font-bold transition-color duration-500 cursor-pointer'>
            <div className='flex flex-row text-center justify-center'>
              <div>Enter</div>
            </div>
          </button>
        </Link>
      </div>
    </>
  )
}

export default LandingPageVideo