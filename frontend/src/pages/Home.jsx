import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TrendBar, Sidebar, HomeHeader, Title, TrendCard, ArticleLoading, ArticleView, Footer } from '../components'
import { useStateContext } from '../context/ContextProvider'
// import API from '../API'

/**
 * Home page containing autoupdating trends and content for the user to browse
 */

const Home = () => {
    const { articleList, setArticleList, articleLoading, setArticleLoading } = useStateContext()

    // useEffect(() => {
    //     const refreshArticles = () => {
    //         API.get('/articles/')
    //             .then((res) => {
    //                 setArticleList(res.data)
    //             })
    //             .catch(console.error)
    //     }
    //     refreshArticles()
    // }, [setArticleList])

    // var timer = 0
    // const serverTimeout = (e) => {
    //     if (articleLoading === false) {
    //         clearTimer(timer)
    //     }
    //     timer = setTimeout(() => alert('Server timeout'), 10000)
    // }

    // const clearTimer = () => {
    //     clearTimeout(timer)
    // }

    // if (articleList.length === 0) {
    //     return (
    //         <>
    //             <ArticleLoading pageTitle={'Home'} />
    //             {/* {serverTimeout()} */}
    //         </>
    //     )
    // }
    // else {
        return (
            <>
                <div className='justify-center m-auto left-0 right-0 h-full w-full dark:bg-dark-grey'>
                    <Sidebar />
                    {/* To keep with DRY could use mapping but need votes and sorting first */}
                    {/* <TrendBar
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
                            <Link to={`/article/${articleList?.[1]?.id}`}>
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
                    /> */}
                    <HomeHeader />
                    <div className='flex justify-center overflow-auto'>
                        <div className='pt-20'>
                            <Title text={'home'} size={'text-6xl'} />
                            <div className='mt-20 overflow-auto'>
                                <ArticleView />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
// }

export default Home