import React from 'react'
import { Header, Sidebar, Button, Title } from '../../components'
import { useNavigate } from 'react-router-dom'

/**
 * To contain information on how to write a article.
 * How to make it informative and use the Create article page (write after adding complexity to creating a article first)
 */

const ArticleGuide = () => {
    let history = useNavigate()
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
            <div className='flex justify-center pt-5 pb-20 sm:pb-10'>
                <Button label={"Back"}
                    func={() => history(-1)}
                />
            </div>
        </>
    )
}

export default ArticleGuide