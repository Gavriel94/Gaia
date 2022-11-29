import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/ContextProvider'
import Title from '../misc/Title'
import TrendCard from './TrendCard'
import { Link } from 'react-router-dom'
import API from '../../API'

/**
 * Bar designed to auto-update showing trending items in descending order
 * Only displays on large screens
 * 
 * @returns {JSX.Element} Sidebar component which dislays 4 articles
 */

const TrendBar = () => {
    const [mostPopular, setMostPopular] = useState([])

    useEffect(() => {
        const getTrending = async () => {
            await API.get('/articles/trending/')
                .then((res) => {
                    setMostPopular(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
        }

        getTrending()
    }, [])

    return (
        <div>
            <div className={`flex invisible xl:visible items-end px-10
            flex-col h-full 
            border-light-orange dark:border-dark-orange border-opacity-50`}>
                <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
                    <div className='py-4' />
                    <div className='w-[300px] h-[10px] justify-center py-10'>
                        <Title text={'trending'} size={'text-3xl'} />
                    </div>
                    <div className='pt-4 grid grid-cols-1 gap-y-4'>
                        {mostPopular.map((article) => (
                            <div className='pt-4 grid grid-cols-1 gap-y-4' key={article.id}>
                                <Link to={`/articles/${article.id}`} style={{textDecoration: 'none'}}>
                                    <TrendCard
                                        id={article.id}
                                        title={article.title}
                                        tags={article.tags}
                                        image={article.preview_image}
                                    />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrendBar