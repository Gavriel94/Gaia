import React from 'react'
import { SidebarV2, Header, Title, Footer } from '../../components'

/**
 * Page to contain information about the project and information about creating wallets
 */

const About = () => {
    return (
        <>
            <>
                <div className='fixed justify-center m-auto left-0 right-0 '>
                    <Footer />
                    <Header />
                    <SidebarV2 />
                </div>
                <div className='flex justify-center'>
                    <div className='pt-20'>
                        <Title text={'about'} size={'text-6xl'} />
                        <div className='mt-20 overflow-auto dark:text-white'>
                            Gaia is a new form of social publishing designed by and for the community.
                        </div>
                    </div>
                </div>
            </>

            <div className='flex pt-14' />
        </>
    )
}

export default About