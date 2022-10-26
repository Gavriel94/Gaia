import React, { useEffect, useState } from 'react'
import { TrendBar, Sidebar, Header, Title, ArticleLoading, ArticleView, TopLoader, RefreshPosts } from '../components'
import { useStateContext } from '../context/ContextProvider'

/**
 * Home page containing autoupdating trends and content for the user to browse
 */

const Home = () => {
    const { articleList, articleLoading, refreshing } = useStateContext()
    const [topLoaderVisible, setTopLoaderVisible] = useState(false)

    // shows TopLoader after scrolling down the page
    //! Re-renders ArticleView component when reaching top and bottom of page
    // useEffect(() => {
    //     window.addEventListener("scroll", listenToScroll)
    //     return () => window.removeEventListener("scroll", listenToScroll)
    // }, [])

    const listenToScroll = () => {
        let showFrom = 300
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop

        if (windowScroll > showFrom) {
            setTopLoaderVisible(true)
        } else {
            setTopLoaderVisible(false)
        }
    }

    /**
     * Displays a server timeout warning after n seconds
     * TODO: Logic fix to stop alert appearing
     */
    var timer = 0
    const serverTimeout = (e) => {
        if (articleLoading === false) {
            clearTimer(timer)
        }
        timer = setTimeout(() => alert('Server timeout'), 10000)
    }

    const clearTimer = () => {
        clearTimeout(timer)
    }

    if (articleList.length === 0) {
        return (
            <>
                <div className='mt-20'/>
                <Title text={'home'} size={'text-6xl'} />
                <ArticleLoading pageTitle={'Home'} />
                {/* {serverTimeout()} */}
            </>
        )
    }
    else {
        return (
            <>
                <div className='justify-center m-auto left-0 right-0 h-full w-full'>
                    <TrendBar />
                    <Header page={'home'} />
                    <Sidebar />
                    {
                        topLoaderVisible
                        &&
                        <div className='flex sm:justify-end lg:justify-center lg:pl-224 h-full'>
                            <div className='absolute bottom-20 lg:pr-52 hidden sm:block sm:pr-36'>
                                <TopLoader />
                            </div>
                        </div>
                    }

                    <div className='flex justify-center'>
                        <div className='pt-20'>
                            <Title text={'home'} size={'text-6xl'} />
                            <div className={`${refreshing ? 'hidden' : 'mt-10 overflow-auto flex flex-row pb-20 sm:pb-10'}`}>
                                <ArticleView />
                            </div>
                            <div className={`${refreshing ? 'block mt-10 overflow-auto pb-20 sm:pb-10' : 'hidden'}`}>
                                <ArticleLoading />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Home