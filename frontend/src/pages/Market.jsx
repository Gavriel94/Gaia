import React from 'react'
import { Sidebar, Header, Title } from '../components'

/**
 * Page for implementing a market API such as CoinMarketCap
 */

const Market = () => {
    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0 '>
                <Sidebar />
                <Header />
            </div>
            <div className='flex justify-center'>
                <div className='pt-20'>
                    <Title text={'market'} size={'text-6xl'} />
                    <div className='mt-20 overflow-auto '>
                        content
                    </div>
                </div>
            </div>
        </>
    )
}

export default Market