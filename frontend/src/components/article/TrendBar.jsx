import React from 'react'
import { useStateContext } from '../../context/ContextProvider'
import Title from '../misc/Title'
import TrendCard from './TrendCard'
import { Link } from 'react-router-dom'

/**
 * Bar designed to auto-update showing trending items in descending order
 * Only displays on large screens
 * 
 * @returns {JSX.Element} Sidebar component which dislays 4 articles
 */

const TrendBar = () => {
    const { articleList } = useStateContext()

    return (
        <div>
            <div className={`flex invisible xl:visible items-end px-10
            }
            flex-col h-full 
            border-light-orange dark:border-dark-orange border-opacity-50`}>
                <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
                    <div className='py-4' />
                    <div className='w-[300px] h-[10px] justify-center py-10'>
                        <Title text={'trending'} size={'text-3xl'} />
                    </div>
                    <div className='pt-4 grid grid-cols-1 gap-y-4'>
                        <Link to={`/articles/${articleList?.[0]?.id}`} style={{ textDecoration: 'none' }}>
                            <TrendCard
                                id={articleList?.[0]?.id}
                                // image={articles?.[0].image}
                                // imageAlt={articles?.[0].imageAlt}
                                title={articleList?.[0]?.title}
                                tags={articleList?.[0]?.tags}
                            />
                        </Link>
                        <Link to={`/articles/${articleList?.[1]?.id}`} style={{ textDecoration: 'none' }}>
                            <TrendCard
                                id={articleList?.[1]?.id}
                                // image={articles?.[3].image}
                                // imageAlt={articles?.[3].imageAlt}
                                title={articleList?.[1]?.title}
                                tags={articleList?.[1]?.tags}
                            />
                        </Link>
                        <Link to={`/articles/${articleList?.[2]?.id}`} style={{ textDecoration: 'none' }}>
                            <TrendCard
                                id={articleList?.[2]?.id}
                                // image={articles?.[3].image}
                                // imageAlt={articles?.[3].imageAlt}
                                title={articleList?.[2]?.title}
                                tags={articleList?.[2]?.tags}
                            />
                        </Link>
                        <Link to={`/articles/${articleList?.[3]?.id}`} style={{ textDecoration: 'none' }}>
                            <TrendCard
                                id={articleList?.[3]?.id}
                                // image={articles?.[3].image}
                                // imageAlt={articles?.[3].imageAlt}
                                title={articleList?.[3]?.title}
                                tags={articleList?.[3]?.tags}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendBar