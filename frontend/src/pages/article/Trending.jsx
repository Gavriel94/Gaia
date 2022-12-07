import React from 'react'
import { Header, SidebarV2, Title } from '../../components'

/**
 * Page which allows users to see trending topics if they are not using a screen large enough to see the TrendBar
 * 
 * @returns {JSX.Element} - Trending topics
 */

const Trending = () => {
  return (
    <>
        <div className='fixed justify-center m-auto left-0 right-0 '>
            <Header />
            <SidebarV2 />
        </div>
        <div className='flex justify-center'>
            <div className='pt-20'>
                <Title text={'trending'} size={'text-6xl'} hover={true}/>
                <div className='mt-20 overflow-auto '>
                    content
                </div>
            </div>
        </div>
</>
  )
}

export default Trending