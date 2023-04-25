import React from 'react'
import { Header, LandingPageVideo } from '../../components'

/**
 * Landing page displaying the video and buttons for the user to enter the app
 * 
 * @returns {JSX.Element} - Landing page
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