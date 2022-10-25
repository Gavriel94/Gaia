import React from 'react'
import { Header, Sidebar, Title } from '../components'

const Trending = () => {
  return (
    <>
        <div className='fixed justify-center m-auto left-0 right-0 '>
            <Header />
            <Sidebar />
        </div>
        <div className='flex justify-center'>
            <div className='pt-20'>
                <Title text={'trending'} size={'text-6xl'} />
                <div className='mt-20 overflow-auto '>
                    content
                </div>
            </div>
        </div>
</>
  )
}

export default Trending