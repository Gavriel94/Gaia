import React, { useEffect, useState } from 'react'
import { TrendBar, SidebarV2, Header, Title, ArticleLoading, ArticleList, TopLoader, RefreshPosts } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'

/**
 * Provides an interface for the user to browse articles and see trends
 * Displays an ArticleList component complete with links to each article
 * 
 * @returns {JSX.Element} Home page
 */

/**
 * TODO: TopLoader currently hidden as useEffect causes multiple re-renders 
 * TODO: serverTimeout warning appears when server has not timed out
 */

const Home = () => {
    const { articleList, articleLoading, refreshing, setArticleList } = useStateContext()
    const [topLoaderVisible, setTopLoaderVisible] = useState(false)

    useEffect(() => {
        const refreshArticles = () => {
            API.get('/articles/all/')
                .then((res) => {
                    setArticleList({
                        articles: res.data.reverse(),
                        sortBy: 'newest',
                    })
                })
                .catch(console.error)
        }
        refreshArticles()
    }, [])

    // shows TopLoader after scrolling down the page
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
                <div className='mt-20' />
                <Title text={'home'} size={'text-6xl'} hover={true}/>
                <ArticleLoading pageTitle={'Home'} />
                {/* {serverTimeout()} */}
            </>
        )
    }
    else {
        return (
            <>
                <TrendBar />
                <Header page={'home'} />
                <SidebarV2 />
                <div className='justify-center m-auto left-0 right-0 h-full w-full'>
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
                            <Title text={'home'} size={'text-6xl'} hover={true}/>
                            <div className={`${refreshing ? 'hidden' : 'mt-10 overflow-auto flex flex-row pb-20 sm:pb-10'}`}>
                                <ArticleList />
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