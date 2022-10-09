import React from 'react'
import Title from '../components/Title'
import { Header, Sidebar } from '../components'

/**
 * To contain information on how to write a article.
 * How to make it informative and use the Create article page (write after adding complexity to creating a article first)
 */

const ArticleGuide = () => {
    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0 '>
                <Header />
                <Sidebar />
            </div>
            <div className='flex justify-center'>
                <div className='pt-20'>
                    <Title text={'3 Steps'} size={'text-3xl'} />
                    <div className='justify-center items-center rounded-3xl border-1 shadow-md 
            py-2 px-4 transition-colors duration-500 cursor-pointer
            w-[300px] h-[300px]
            border-black text-light-white
            bg-light-orange dark:bg-dark-orange
            hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover mt-4'>
                        <p className='text-center mt-4'>
                            Keep the title concise and descriptive. This is the first thing readers see.
                        </p>
                        <p className='mt-4 text-center'>
                            Include data for your sources and claims. Positive community consensus boosts the articles.
                        </p>
                        <p className='mt-4 text-center'>
                            Use tags thoughtfully so more readers can find your information.
                        </p>
                    </div>
                </div>
            </div>
            <div className='absolute right-3 mt-40'>


            </div>
        </>
    )
}

export default ArticleGuide