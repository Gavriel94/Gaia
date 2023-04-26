import React from 'react'
import { SidebarV2, Header, Title, Footer } from '../../components'
import { Link } from 'react-router-dom'

/**
 * Page to contain information about the project and information about creating wallets
 */

const About = () => {
    return (
        <>
            <Header />
            <SidebarV2 />
            <div className='flex justify-center'>
                <Title text={'About Gaia'} size={'text-6xl'} />
            </div>
            <div className='justify-center m-auto text-center dark:text-white w-1/2 mt-20 mb-20'>
                <div className='mt-5'>
                    Gaia is a social publishing platform developed with a mission to promote informative and responsible content sharing.
                </div>
                <div className='mt-5'>
                    Built with the <a href="https://cardano.org">Cardano</a> blockchain at its foundation, Gaia ensures a secure, reliable and environmentally-friendly platform for users.
                </div>
                <div className='mt-5'>
                    Use your Cardano wallet to login or learn how to create one <Link to='/walletinstructions' style={{
                        textDec
                            : 'none'
                    }}>here</Link>
                </div>
                <div className='mt-5'>
                    Wallet logins ensure user privacy while encouraging open and honest discussions on various topics.
                </div>
                <div className='mt-5'>
                    By utilising advanced artificial intelligence, Gaia actively combats hate speech and illegal material creating a safe and inclusive space for users of all ages.
                </div>
                <div className='mt-5'>
                    Use the Sentiment Indicator for an at-a-glance way to see how the community feel about an article
                </div>
                <div className='mt-5'>
                    Express your feelings towards articles by using the 'Like' or 'Dislike' buttons and help shape the platform.
                </div>
                <div className='mt-5'>
                    Topics are a quick and easy way for you to find your interests and have discussions. Find what you're looking for in the search page or create it if it doesn't exist!
                </div>
                <div className='mt-5'>
                    As you're logged in with your wallet you can send tips in ADA to other users if you like their articles
                </div>
                <div className='mt-5'>
                    Cardano's transaction system ensures you are not charged if a transaction fails.
                </div>
                <div className='mt-5'>
                    Gaia has no access to your funds at any time and never takes a fee
                </div>
                <div className='mt-5 mb-40 sm:mb-0'>
                    Join Gaia to be part of an innovative community that values information sharing in a balanced ecosystem.
                </div>
            </div>
        </>
    )
}

export default About