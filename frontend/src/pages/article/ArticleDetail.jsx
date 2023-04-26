import React, { useEffect, useState } from "react";
import { Title, SidebarV2, Header, Button, SentimentIndicator, CommentSection, LoginAlert, BookmarkButton } from "../../components";
import API from '../../API'
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { ArticleLoading } from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import parser from 'html-react-parser'
import AuthorBar from "../../components/article/AuthorBar";
import { BiLike, BiDislike } from 'react-icons/bi'
import { MdDeleteForever, MdCheck, MdOutlineCancel } from "react-icons/md";
import Modal from 'react-modal'

/**
 * Displays a single Article in a full page view
 */

const ArticleDetail = () => {
    const { darkMode, loggedInProfile, walletUser, loginAlert, setLoginAlert } = useStateContext()
    const [article, setArticle] = useState('')
    const [notLoaded, setNotLoaded] = useState(false)
    const [tagToLoad, setTagToLoad] = useState('')
    const [loadTag, setLoadTag] = useState(false)
    const { id } = useParams()
    let history = useNavigate()

    /**
     * articleSentiment is an array of three elements
     * idx 0 - total likes
     * idx 1 - total dislikes
     * idx 2 - (likes / likes + dislikes) * 100
     */
    const [buttonClick, setButtonClick] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deletionConfirmed, setDeletionConfirmed] = useState(false)

    useEffect(() => {
        const articleDetail = async () => {
            await API.get(`/articles/article/${id}/`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(err => {
                    setNotLoaded(true)
                })
        }

        articleDetail()

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

    const handleReaction = async (reaction) => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        let userReaction = new FormData()
        userReaction.append('user_id', loggedInProfile.id)
        userReaction.append('article_id', article.id)
        userReaction.append('sentiment', reaction)
        try {
            await API.post(`/articles/reaction/${article.id}/`, userReaction, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                setButtonClick(!buttonClick)
            })
        } catch (err) {
            if (err.response.status === 400) {
                await API.delete(`articles/reaction/delete/${loggedInProfile.id}/`, {
                    headers: {
                        'Authorization': `Token ${loggedInProfile.sessionToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }).then((res => {
                    setButtonClick(!buttonClick)
                }))
            }
        }
    }

    const handleDelete = async () => {
        await API.delete(`articles/article/delete/${id}/`, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res => {
            setConfirmDelete(false)
            setDeletionConfirmed(true)
        }))
    }

    const openConfirmDelete = () => {
        setConfirmDelete(true)
    }

    const cancelDelete = () => {
        setConfirmDelete(false)
    }

    /**
     * Users cannot tip themselves
     */
    const showTipButton = () => {
        if (article.author_username === loggedInProfile.username) {
            return false
        }
        return true
    }

    const navigateToTab = (tag) => {
        setTagToLoad(tag)
        setLoadTag(true)
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
                {
                    loadTag && (
                        <Navigate to={`/articles/tags/${tagToLoad}`} replace={true} />
                    )
                }
                {
                    deletionConfirmed && (
                        <Navigate to={`/home/`} replace={true} />
                    )
                }
                <div className='fixed justify-center m-auto left-0 right-0'>
                    <div className="hidden xl:block">
                        <AuthorBar authorID={article.author} showTipButton={showTipButton()} />
                    </div>
                    <Header page={'articleDetail'} />
                    <SidebarV2 />
                </div>
                <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
                    <div className='pt-20 justify-center'>
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
                        <div className={`${loggedInProfile.sessionToken === '' ? 'hidden' : 'flex justify-center space-x-5 mt-5'}`}>
                            <BookmarkButton articleID={article.id} preview_image={article.preview_image} title={article.title} />
                            <div className={`${article.author_username === loggedInProfile.username ? 'block' : 'hidden'}`}>
                                <Button icon={<MdDeleteForever size={'26px'} />} func={() => openConfirmDelete()} />
                            </div>
                        </div>
                        <div className='mt-20' />
                        <div className='justify-center m-auto text-center dark:text-white w-auto sm:w-1/2 mt-20'>
                        {/* <div className='justify-center text-center pl-36 w-[300px] sm:w-[350px] sm:pl-10 md:w-[500px] lg:w-[600px] xl:w-[850px]'> */}
                            {parser(article.content)}
                        </div>
                        <div className='flex justify-center mt-10'>
                            <Title text={'Topics'} size={'text-2xl'} />
                        </div>
                        <div className='hidden flex-row justify-center mt-2 sm:flex'>
                            {article.article_tags.map((tag) =>
                                <div key={tag.tag} className='px-2'>
                                    <Button label={tag.tag} func={() => navigateToTab(tag.tag)} />
                                </div>)
                            }
                        </div>
                        <div className='flex flex-row justify-center mt-2 sm:hidden'>
                            {article.article_tags.map((tag) =>
                                <div key={tag.tag} className='px-2'>
                                    <Link to={`/articles/tags/${tag.tag}`}>{tag.tag}</Link>
                                </div>)
                            }
                        </div>
                        <div className='flex justify-center mt-10 overflow-auto'>
                            {formatDate(article.pub_date)}
                        </div>
                        <div className='hidden sm:block mt-10 justify-center space-x-5'>
                        </div>
                        <div className='hidden sm:flex flex-row justify-center space-x-5'>
                            <div className='mt-3'>
                                <Button icon={<BiLike size={'26px'} />} func={e => handleReaction(1)} />
                            </div>
                            <div className='mt-3'>
                                <Button icon={<BiDislike size={'26px'} />} func={e => handleReaction(2)} />
                            </div>
                        </div>
                        <SentimentIndicator
                            dislikes={article.sentiment[1]}
                            likes={article.sentiment[0]}
                            likePercent={article.sentiment[2]}
                        />
                        <div className='flex justify-center w-1/2 mt-10 mb-10'>
                            <CommentSection articleID={article.id} articleAuthor={article.author} />
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={confirmDelete}
                    onRequestClose={() => setConfirmDelete(false)}
                    contentLabel="Confirm Delete Modal"
                    ariaHideApp={false}
                    className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                    overlayClassName={'overlayModal'}
                >
                    <div>
                        <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                            Confirm Delete
                        </div>
                        <div className='text-light-white
                    transition-colors duration-500 select-none text-center mt-2'>
                            Articles cannot be recovered once deleted
                        </div>
                        <div className='flex flex-row justify-center mt-5 space-x-5'>
                            <Button func={() => cancelDelete()} icon={<MdOutlineCancel size={'26px'} />} />
                            <Button func={() => handleDelete()} icon={<MdCheck size={'26px'} />} />
                        </div>
                    </div>
                </Modal>
                <LoginAlert open={loginAlert} />
            </>
        )
    }
}

export default ArticleDetail