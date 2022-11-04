import React from 'react'
import { Sidebar, Header, Title } from '../../components'

/**
 * Page for implementing a market API such as CoinMarketCap
 * 
 * ? Currently hidden from user, unsure if it will be implemented 
 */

const Market = () => {
    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0 '>
                <Header />
                <Sidebar />
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