import React from 'react'
import { SidebarV2, Header, Title, Footer } from '../../components'

/**
 * Page to contain information about the project and information about creating wallets
 */

const About = () => {
    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0 '>
                <Header />
                <SidebarV2 />
            </div>
            <div className='flex justify-center h-screen'>
                <div className='pt-20'>
                    <Title text={'about'} size={'text-6xl'} hover={true} />
                    <div className='mt-20 overflow-auto text-center dark:text-white'>
                        {/* <Title text={'Ethos'} size={'text-3xl'} hover={true} /> */}
                        <div className='overflow-auto text-center dark:text-white'>
                            Gaia is a social publishing platform developed with a mission to promote informative and responsible content sharing.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            Built with the Cardano blockchain at its foundation, Gaia ensures a secure, reliable and environmentally-friendly solution for users.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            Use your Cardano wallet to login.
                            <br />
                            Wallet logins ensure user privacy while encouraging open and honest discussions on various topics.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            By utilising advanced artificial intelligence, Gaia actively combats hate speech and illegal material creating a safe and inclusive space for users of all ages.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            Use the Sentiment Indicator for an at-a-glance way to see how the community feel about an article.
                            <br />
                            Express your feelings towards articles by using the 'Like' or 'Dislike' buttons and help shape the platform.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            Topics are a quick and easy way for you to find your interests and have discussions.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            As you're logged in with your wallet you can send tips in ADA to other users if you like their articles!
                            <br />
                            Cardano's transaction system ensures you are not charged if a transaction fails.
                        </div>
                        <div className='overflow-auto text-center dark:text-white'>
                            Join Gaia to be part of an innovative community that values information sharing in a balanced ecosystem.
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default About