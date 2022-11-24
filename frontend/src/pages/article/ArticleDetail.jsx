import React, { useEffect, useState } from "react";
import { Title, SidebarV2, Header, Button, TagIcon, ProfileArticleBar } from "../../components";
import API from '../../API'
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { ArticleLoading } from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import parser from 'html-react-parser'
import AuthorBar from "../../components/article/AuthorBar";
import { BiLike, BiDislike } from 'react-icons/bi'

/**
 * Displays a single Article in a full page view
 */

/**
 * TODO: Sidebar with details about the author, (wallet address or handle, picture if they have one, otherwise default)
 * TODO: Tip button on the bottom denominating ADA
 * TODO: Fix pub_date to be a 24 hour clock. (Needs to be done in Django)
 * TODO: Link to tags needs implementation
 */

const ArticleDetail = () => {
    const { darkMode, loggedInProfile } = useStateContext()
    const [article, setArticle] = useState('')
    const [notLoaded, setNotLoaded] = useState(false)
    const { id } = useParams()
    let history = useNavigate()

    /**
     * An array of three elements
     * idx 0 - total likes
     * idx 1 - total dislikes
     * idx 3 - likes / likes + dislikes
     */
    const [articleSentiment, setArticleSentiment] = useState([])
    const [noSentiment, setNoSentiment] = useState('')
    const [buttonClick, setButtonClick] = useState(false)
    const [gradient, setGradient] = useState('')

    useEffect(() => {
        const articleDetail = async () => {
            await API.get(`/articles/article/${id}/`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(err => {
                    console.log(err.response.status)
                    setNotLoaded(true)
                })
        }

        const articleSentiment = async () => {
            await API.get(`/articles/sentiment/${id}/`)
                .then((res) => {
                    console.log(res)
                    setArticleSentiment(res.data)
                    if (res.data[2] === 100) {
                        setGradient('from-light-green to-light-green')
                    } else if (res.data[2] === 0) {
                        setGradient('from-light-red to-light-red')
                    } else {
                        setGradient('from-light-red to-light-green')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
        articleDetail()
        articleSentiment()
    }, [id, buttonClick])

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const formatTags = (e) => {
        var tagList = []
        const tagString = e?.split(',')
        tagString?.forEach(tag => tagList.push(tag))

        return (
            tagList.map((tag) =>
                <div key={tag} className='px-2'>
                    <Link>
                        {tag}
                    </Link>
                </div>
            )
        )
    }

    const handleReaction = async (reaction) => {
        try {
            let likeArticle = new FormData()
            likeArticle.append('user_id', loggedInProfile.id)
            likeArticle.append('article_id', article.id)
            likeArticle.append('sentiment', reaction)
            console.log(loggedInProfile.id)
            await API.post(`/articles/reaction/${article.id}/`, likeArticle, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                console.log(res)
                setButtonClick(!buttonClick)
            })
        } catch (err) {
            console.log(err)
            if (err.response.status === 401) {
                alert('You must be logged in')
            }
            if (String(err.response.data.non_field_errors[0]).includes('must make a unique set')) {
                await API.delete(`articles/reaction/delete/${loggedInProfile.id}/`, {
                    headers: {
                        'Authorization': `Token ${loggedInProfile.sessionToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }).then((res => {
                    console.log(res)
                    setButtonClick(!buttonClick)
                }))
            }
        }
    }

    if (article === '') {
        return (
            <>
                <ArticleLoading pageTitle={'Loading'} />
                {
                    notLoaded && (
                        <Navigate to={'not-found'} replace={true} />
                    )
                }
            </>
        )
    }
    else {
        return (
            <>
                <div className='fixed justify-center m-auto left-0 right-0'>
                    <div className="hidden xl:block">
                        <AuthorBar authorID={article.author} />
                    </div>
                    <Header page={'articleDetail'}/>
                    <SidebarV2 />
                    {console.log(article)}
                </div>
                <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
                    <div className='pt-20 justify-center'>
                        {/* <Title text={`${article.title}`} size={'text-6xl'} /> */}
                        <div className='pr-2 sm:pr-0 pl-2 md:pl-10 flex justify-center'>
                            <img src={`${article.preview_image}`} className='rounded-lg' alt="" height={'300px'} width={'300px'} />
                        </div>
                        <div className='flex justify-center flex-row mx-auto'>
                            <div className='pt-5'>
                                <Title text={`${article.title}`} size={'text-6xl'} />
                                <div className='flex text-center justify-center mt-5 xl:hidden'>
                                    <p>Written by <Link to={`/profiles/${article.author}`}> {article.author_profile_name.slice(0, 20) + '...'} </Link></p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-20' />
                        <div className='justify-center content-center text-center text-truncate [w-100px] md:[600px] lg:[750px] xl:[850px]'>
                            {parser(article.content)}
                        </div>
                        <div className='flex justify-center mt-10'>
                            tags: {formatTags(article.tags)}
                            {/* tags: {article.tags} */}
                        </div>
                        <div className='flex justify-center mt-10'>
                            {formatDate(article.pub_date)}
                        </div>
                        <div className='mt-10 flex justify-center space-x-5'>
                            <div>
                                <Button icon={<BiLike size={'26px'} />} func={e => handleReaction(1)} />
                            </div>
                            <div>
                                <Button icon={<BiDislike size={'26px'} />} func={e => handleReaction(2)} />

                            </div>
                        </div>
                        <div className='flex justify-center mt-5'>
                            <div className='grid grid-cols-3'>

                                <div className='text-center flex justify-end pr-5 select-none'>
                                    {articleSentiment[1]}
                                    <div className="px-2">
                                        <BiDislike size={'26px'} />
                                    </div>
                                </div>
                                <div>
                                    <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center`}>{articleSentiment[2]}% of readers liked this</div>
                                </div>
                                <div className='text-center flex justify-start pl-5 select-none'>
                                    {articleSentiment[0]} 
                                    <div className="px-2">
                                        <BiLike size={'26px'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ArticleDetail