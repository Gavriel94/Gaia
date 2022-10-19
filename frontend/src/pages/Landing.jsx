import React, { useEffect, useState } from 'react'
import { Header, LandingPageVideo } from '../components'

/**
 * Landing page for instant information for the user to see what the project is about 
 * TODO: change the Flipcards into animations and make the page scrollable with 'enter app' on a fixed header above
 */

const Landing = () => {

    return (
        <div>
            <LandingPageVideo />
            <Header page={'landing'} />
        </div>
    )
}

export default Landing