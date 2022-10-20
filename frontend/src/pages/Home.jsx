import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendBar, Sidebar, Header, Title, TrendCard, ArticleLoading, ArticleView, TopLoader, SortingButton } from '../components'
import { useStateContext } from '../context/ContextProvider'
import API from '../API'

/**
 * Home page containing autoupdating trends and content for the user to browse
 */

const Home = () => {
    const { articleList, setArticleList, articleLoading, setArticleLoading } = useStateContext()
    const [topLoaderVisible, setTopLoaderVisible] = useState(false)

    useEffect(() => {
        const refreshArticles = () => {
            API.get('/articles/')
                .then((res) => {
                    setArticleList(res.data)
                })
                .catch(console.error)
        }
        refreshArticles()
    }, [setArticleList])

    // shows TopLoader after scrolling down the page
    useEffect(() => {
        window.addEventListener("scroll", listenToScroll)
        return () => window.removeEventListener("scroll", listenToScroll)
    }, [])

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
                <ArticleLoading pageTitle={'Home'} />
                {/* {serverTimeout()} */}
            </>
        )
    }
    else {
        return (
            <>
                <div className='justify-center m-auto left-0 right-0 h-full w-full'>
                    {/* To keep with DRY could use mapping but need votes first */}
                    <TrendBar
                        firstTrend={
                            <Link to={`/articles/${articleList?.[0]?.id}`}>
                                <TrendCard
                                    id={articleList?.[0]?.id}
                                    // image={articles?.[0].image}
                                    // imageAlt={articles?.[0].imageAlt}
                                    title={articleList?.[0]?.title}
                                    tags={articleList?.[0]?.tags}
                                />
                            </Link>
                        }
                        secondTrend={
                            <Link to={`/articles/${articleList?.[1]?.id}`}>
                                <TrendCard
                                    id={articleList?.[1]?.id}
                                    // image={articles?.[1].image}
                                    // imageAlt={articles?.[1].imageAlt}
                                    title={articleList?.[1]?.title}
                                    tags={articleList?.[1]?.tags}
                                />
                            </Link>
                        }
                        thirdTrend={
                            <Link to={`/articles/${articleList?.[2]?.id}`}>
                                <TrendCard
                                    id={articleList?.[2]?.id}
                                    // image={articles?.[2].image}
                                    // imageAlt={articles?.[2].imageAlt}
                                    title={articleList?.[2]?.title}
                                    tags={articleList?.[2]?.tags}
                                />
                            </Link>
                        }
                        fourthTrend={
                            <Link to={`/articles/${articleList?.[3]?.id}`}>
                                <TrendCard
                                    id={articleList?.[3]?.id}
                                    // image={articles?.[3].image}
                                    // imageAlt={articles?.[3].imageAlt}
                                    title={articleList?.[3]?.title}
                                    tags={articleList?.[3]?.tags}
                                />
                            </Link>
                        }
                    />
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
                            <div className='mt-10 overflow-auto flex flex-row'>
                                <ArticleView />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Home