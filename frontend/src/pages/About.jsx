import React from 'react'
import { Sidebar, Header, Title, Footer } from '../components'

/**
 * Page to contain information about the project and external links such as Twitter
 */

const About = () => {
    return (
        <>
            <>
                <div className='fixed justify-center m-auto left-0 right-0 '>
                    <Sidebar />
                    <Header />
                </div>
                <div className='flex justify-center'>
                    <div className='pt-20'>
                        <Title text={'about'} size={'text-6xl'} />
                        <div className='mt-20 overflow-auto '>
                            content
                        </div>
                    </div>
                </div>
            </>

            <div className='flex pt-14' />
            <Footer />
        </>
    )
}

export default About