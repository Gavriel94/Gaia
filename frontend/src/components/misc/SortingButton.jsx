import React, { useState, useEffect } from 'react'
import { useStateContext } from '../../context/ContextProvider'
import { TbSun, TbSunrise } from 'react-icons/tb'
import Button from './Button'
import API from '../../API'
import { GiNightSleep } from 'react-icons/gi'
import { BiLike, BiDislike } from 'react-icons/bi'

/**
 * 
 * @returns {JSX.Element} - Changes order of MiniArticles in ArticleList component
 */

const SortingButton = () => {
    const { articleList, setArticleList } = useStateContext()
    const [sortingIcon, setSortingIcon] = useState(<TbSunrise size={'26px'} />) //initial sun icon because new is default sort
    const [open, setOpen] = useState(false)

    /**
     * This function minimises API calls by only making an API call if the current articleList is sorted by popularity
     * 
     * @param {String} orderBy - desired order
     * @returns 
     */
    const refreshNew = (orderBy) => {
        if (orderBy === 'newest' && articleList.sortBy === 'newest') {
            setOpen(!open)
            return
        } else if (orderBy === 'oldest' && articleList.sortBy === 'newest') {
            setArticleList({
                articles: articleList.articles.reverse(),
                sortBy: 'oldest'
            })
            setOpen(!open)
            setSortingIcon(<GiNightSleep size={'26px'} />)
            return
        } 
        else if(orderBy === 'newest' && articleList.sortBy === 'oldest') {
            setArticleList({
                articles: articleList.articles.reverse(),
                sortBy: 'newest'
            })
            setOpen(!open)
            setSortingIcon(<TbSunrise size={'26px'} />)
        }
        else if (orderBy === 'oldest' && articleList.sortBy === 'oldest') {
            setOpen(!open)
            return
        } 
        
        else if (orderBy === 'newest') {
            API.get('/articles/all/')
                .then((res) => {
                    setArticleList({
                        articles: res.data.reverse(),
                        sortBy: 'newest'
                    })
                    setOpen(!open)
                    setSortingIcon(<TbSunrise size={'26px'} />)
                })
                .catch(console.error)
                console.log(articleList.sortBy)
                return
        } else if (orderBy === 'oldest') {
            console.log('API call')
            API.get('/articles/all/')
                .then((res) => {
                    setArticleList({
                        articles: res.data,
                        sortBy: 'oldest'
                    })
                    setOpen(!open)
                    setSortingIcon(<GiNightSleep size={'26px'} />)
                })
                .catch(console.error)
                console.log(articleList.sortBy)
                return
        }
    }

        /**
     * This function minimises API calls by only making an API call if the current articleList is sorted by publishing date
     * 
     * @param {String} orderBy - desired order
     * @returns 
     */
    const refreshPopular = (orderBy) => {
        if (orderBy === 'mostPopular' && articleList.sortBy === 'most popular') {
            console.log('no API call')
            console.log(articleList.sortBy)
            setOpen(!open)
            return
        } else if (orderBy === 'leastPopular' && articleList.sortBy === 'most popular') {
            console.log('no API call')
            setArticleList({
                articles: articleList.articles.reverse(),
                sortBy: 'least popular'
            })
            setOpen(!open)
            setSortingIcon(<BiDislike size={'26px'} />)
            console.log(articleList.sortBy)
            return
        } 
        else if(orderBy === 'mostPopular' && articleList.sortBy === 'least popular') {
            setArticleList({
                articles: articleList.articles.reverse(),
                sortBy: 'most popular'
            })
            setOpen(!open)
            setSortingIcon(<BiLike size={'26px'} />)
        }
        else if (orderBy === 'leastPopular' && articleList.sortBy === 'least popular') {
            console.log('no API call')
            console.log(articleList.sortBy)
            setOpen(!open)
            return
        } 
        
        else if (orderBy === 'mostPopular') {
            console.log('API call')
            API.get('/articles/popular/')
                .then((res) => {
                    setArticleList({
                        articles: res.data,
                        sortBy: 'most popular'
                    })
                    setOpen(!open)
                    setSortingIcon(<BiLike size={'26px'} />)
                })
                .catch(console.error)
                console.log(articleList.sortBy)
                return
        } else if (orderBy === 'leastPopular') {
            console.log('API call')
            API.get('/articles/popular/')
                .then((res) => {
                    setArticleList({
                        articles: res.data.reverse(),
                        sortBy: 'least popular'
                    })
                    setOpen(!open)
                    setSortingIcon(<BiDislike size={'26px'} />)
                })
                .catch(console.error)
                console.log(articleList.sortBy)
                return
        }
    }

    const handleOpen = () => {
        setOpen(!open)
    }

    const menu = [
        {
            option: 'Newest',
            button:
                <Button label={'Newest'}
                    func={() => refreshNew('newest')}
                    icon={<TbSunrise size={'26px'} />}
                    labelProps={'text-sm pt-1 pl-2'}
                />
        },
        {
            option: 'Most Popular',
            button:
                <Button label={'Most Popular'}
                    func={() => refreshPopular('mostPopular')}
                    icon={<BiLike size={'26px'} />}
                    labelProps={'text-sm pt-1 pl-2'}
                />
        },
        {
            option: 'Oldest',
            button:
                <Button label={'Oldest'}
                    func={() => refreshNew('oldest')}
                    icon={<GiNightSleep size={'26px'} />}
                    labelProps={'text-sm pt-1 pl-2'}
                />
        },
        {
            option: 'Least Popular',
            button:
                <Button label={'Least Popular'}
                    func={() => refreshPopular('leastPopular')}
                    icon={<BiDislike size={'26px'} />}
                    labelProps={'text-sm pt-1 pl-2'}
                />
        }
    ]

    return (
        <>

            <div>
                <Button
                    title={'Sort'}
                    icon={sortingIcon}
                    func={() => handleOpen()}
                    label={`Sorting by ${articleList.sortBy}`}
                    labelProps={'text-sm pt-1 pl-2'}
                />
            </div>
            <div>
                {open ? (
                    <div className='bg-white dark:bg-dark-grey opacity-100 p-5 mt-20 rounded-lg'>
                        {menu.map((item) => (
                            <div key={item.option} className='flex justify-center pt-2'>
                                {item.button}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default SortingButton
