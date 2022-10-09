import React from 'react'
import Title from './Title'

/**
 * Sidebar designed to auto-update showing trending items in descending order
 * 
 * @param firstTrend
 * @param secondTrend
 * @param thirdTrend
 * @param fourthTrend
 */

const TrendBar = ({ firstTrend, secondTrend, thirdTrend, fourthTrend }) => {

    return (
        <div className=''>
            <div className={`flex invisible lg:visible items-end px-10
            }
            flex-col h-full 
            border-light-orange dark:border-dark-orange border-opacity-50`}>
                <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
                    <div className='py-4' />
                    <div className='w-[300px] h-[10px] justify-center py-10'>
                        <Title text={'trending'} size={'text-3xl'} />
                    </div>
                    <div className='pt-4 grid grid-cols-1 gap-y-4'>
                        {firstTrend}
                        {secondTrend}
                        {thirdTrend}
                        {fourthTrend}
                    </div>
                    <div className='flex justify-center p-3'>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendBar