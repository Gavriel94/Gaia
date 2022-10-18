import React, { useState } from 'react'
import GaiaAnim from '../assets/GaiaAnimPrototype.mp4'

const LandingPageVideo = () => {
    const [playing] = useState(true)

  return (
    <>
        <video controls autoPlay muted src={GaiaAnim}/>
    </>
  )
}

export default LandingPageVideo