import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom";
import API from '../../API';
import { useStateContext } from '../../context/ContextProvider';
import { Button, Title, Header, SidebarV2, LoginAlert, InputArea, SentimentIndicator } from '../../components';
import { BsReply } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'
import { MdDeleteForever, MdOutlineCancel, MdCheck } from 'react-icons/md'
import Modal from 'react-modal'
import '../../replyModal.css'

/**
 * 
 * Similar to CommentSection except any replies are appended to the top of the page
 */

const CommentThread = () => {
    const { darkMode, loggedInProfile, walletUser, loginAlert, setLoginAlert } = useStateContext()
    const { id } = useParams()
    const [originalPost, setOriginalPost] = useState('')
    const [replies, setReplies] = useState([])
    const [response, setResponse] = useState('')
    const [responseError, setResponseError] = useState(false)
    const [responseSubmitted, setResponseSubmitted] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deletionConfirmed, setDeletionConfirmed] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState('')
    const [openReplyModal, setOpenReplyModal] = useState(false)
    const [commentCreatee, setCommentCreatee] = useState('')
    const [commentUserID, setCommentUserID] = useState('')
    const [replyToResponseSubmitted, setReplyToResponseSubmitted] = useState(false)
    const [respondingTo, setRespondingTo] = useState('')
    const [commentUser, setCommentUser] = useState(undefined)
    const [reactionSubmitted, setReactionSubmitted] = useState(false)


    useEffect(() => {
        const getComment = async () => {
            try {
                await API.get(`/articles/article/comment/detail/${id}`)
                    .then(res => {
                        setOriginalPost(res.data)
                        setReplies(res.data.comment_replies.reverse())
                        if (responseSubmitted) {
                            setResponseSubmitted(false)
                        }
                        if (replyToResponseSubmitted) {
                            setReplyToResponseSubmitted(false)
                        }
                    })
            } catch (err) {
                console.log(err)
            }
        }
        getComment()
    }, [id, responseSubmitted, deletionConfirmed, replyToResponseSubmitted, reactionSubmitted])

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const submitSentiment = async (op_id, comment_id, sentiment) => {
        let reaction = new FormData()
        reaction.append('comment_id', comment_id)
        reaction.append('original_poster_id', op_id)
        reaction.append('reactor_id', loggedInProfile.id)
        reaction.append('sentiment', sentiment)

        try {
            await API.post(`user/comment/reaction/${comment_id}/`, reaction, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                console.log(res)
                setReactionSubmitted(!reactionSubmitted)
            })
        } catch (err) {
            if (err.response.status === 400) {
                await API.delete(`user/comment/reaction/delete/${comment_id}/`, {
                    headers: {
                        'Authorization': `Token ${loggedInProfile.sessionToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }).then((res => {
                    setReactionSubmitted(!reactionSubmitted)
                }))
            }
        }
    }

    const handleResponse = (e) => {
        setResponse(e)
        if (responseError) {
            setResponseError(false)
        }
    }

    const submitResponse = async () => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        let userResponse = new FormData()
        userResponse.append('sender', loggedInProfile.id)
        userResponse.append('comment', response)
        userResponse.append('receiver', originalPost.sender.id)
        userResponse.append('is_reply', '1')
        userResponse.append('article', '')
        userResponse.append('reply', originalPost.id)

        await API.post(`/articles/article/comment/response/${id}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            setResponseSubmitted(true)
            setResponse('')
        }).catch(err => {
            console.log(err)
        })
    }

    const submitReplyToResponse = async () => {
        let userResponse = new FormData()
        userResponse.append('sender', loggedInProfile.id)
        userResponse.append('receiver', commentUserID)
        userResponse.append('comment', response)
        userResponse.append('article', '')
        userResponse.append('reply', commentCreatee)
        userResponse.append('is_reply', '1')
        for (const v of userResponse) {
            console.log(userResponse.keys())
            console.log(v)
        }

        await API.post(`/articles/article/comment/response/${commentUserID}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            setOpenReplyModal(false)
            setReplyToResponseSubmitted(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const openConfirmDelete = (e) => {
        setConfirmDelete(true)
        setCommentToDelete(e)
    }

    const cancelDelete = () => {
        setConfirmDelete(false)
    }

    const handleDelete = async () => {
        await API.delete(`articles/article/comment/delete/${commentToDelete}/`, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res => {
            setConfirmDelete(false)
            setDeletionConfirmed(true)
        })).catch(console.err)
    }

    const initReplyToResponse = (commentUser, commentCreateeID, comment) => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        setCommentUser(commentUser)
        setCommentUserID(commentUser.id)
        setCommentCreatee(commentCreateeID)
        setRespondingTo(comment)
        setOpenReplyModal(true)
    }

    const cancelResponse = () => {
        setCommentUserID('')
        setCommentCreatee('')
        setResponse('')
        setOpenReplyModal(false)
        if (responseError) {
            setResponseError(false)
        }
    }

    const showReplies = (replies, commentID) => {
        if (replies.length === 1) {
            return (
                <div className='mt-2'>
                    <div className='flex justify-center dark:text-white'>
                        1 response.
                    </div>
                    <div className='flex justify-center dark:text-white'>
                        <Link
                            to={`/articles/comments/${commentID}`}
                            style={{ textDecoration: 'none' }}>
                            Continue the conversation
                        </Link>
                    </div>
                </div>
            )
        } else if (replies.length > 1) {
            return (
                <div className='mt-2'>
                    <div className='flex justify-center dark:text-white'>
                        {replies.length} responses.
                    </div>
                    <div className='flex justify-center dark:text-white'>
                        <Link
                            to={`/articles/comments/${commentID}`}
                            style={{ textDecoration: 'none' }}>
                            Continue the conversation
                        </Link>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='mt-2 flex justify-center dark:text-white'>
                    No replies
                </div>
            )
        }
    }

    const displayPosterProfile = () => {
        let name = ''
        if (commentUser?.profile_name?.length > 20) {
            name = commentUser?.profile_name.slice(0, 19) + '...'
        }
        return (
            <div className=''>
                <div className='flex justify-center text-white'>
                    {name}
                </div>
                <div className='flex flex-row space-x-5 mt-2 border-1 border-white rounded-xl p-2 justify-center'>
                    <div>
                        <img src={commentUser?.profile_image} alt={'User profile'} width={40} className='rounded-xl' />
                    </div>
                    <div className='mt-2 text-white text-center'>
                        {respondingTo}
                    </div>
                </div>
            </div>
        )
    }


    return (
        <>
            <Header page={'thread'} />
            <SidebarV2 />
            <div className='flex justify-center'>
                <div className='mt-36 pb-10'>
                    <div className=''>
                        <div className={`${originalPost?.article?.id === undefined ? 'hidden' : 'block'}`}>
                            <Link to={`/articles/${originalPost?.article?.id}`} style={{ textDecoration: 'none' }}>
                                <div className='flex flex-row space-x-5 justify-center'>
                                    <div>
                                        <img src={originalPost?.article?.preview_image} width={'50px'} alt={'Article '} />
                                    </div>
                                    <div>
                                        <Title text={`${originalPost?.article?.title}`} size={'text-3xl'} lengthLimit={true} />
                                    </div>
                                </div>
                            </Link>

                            <div className='mt-5 w-full border-1 border-light-orange dark:border-dark-orange' />
                        </div>
                        <div className='mt-20' />
                        <div className='flex flex-row justify-center space-x-5'>
                            <div>
                                <img src={originalPost?.sender?.profile_image} alt={'User profile'} width={80} />
                            </div>
                            <Link to={`/profiles/${originalPost?.sender?.id}`} style={{ textDecoration: 'none' }}>
                                <div className='mt-5'>
                                    <Title text={originalPost?.sender?.profile_name} lengthLimit={true} hover={false} />
                                </div>
                            </Link>
                        </div>
                        <div className='mt-10 text-center'>
                            {originalPost?.comment}
                        </div>
                        <div className='flex justify-center mt-5 dark:text-white'>
                            {formatDate(originalPost?.date)}
                        </div>
                        <div className='mt-5'>
                            <SentimentIndicator
                                likes={originalPost?.sentiment?.at(0)}
                                dislikes={originalPost?.sentiment?.at(1)}
                                likePercent={originalPost?.sentiment?.at(2)}
                            />
                        </div>
                        <div className='flex-row justify-center mt-5 space-x-2 hidden sm:flex'>
                            <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(originalPost?.sender?.id, originalPost?.id, 1)} />
                            <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(originalPost?.sender?.id, originalPost?.id, 2)} />
                        </div>
                    </div>

                    <div className='space-x-10 mt-20 hidden sm:block'>
                        <div>
                            <InputArea
                                required={true}
                                type='input'
                                placeholder='Reply'
                                defaultValue={''}
                                borderColor={`${responseError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                                onChange={e => handleResponse(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-center mt-10'>
                            <Button label={'Submit'} func={() => submitResponse()} />
                        </div>
                    </div>
                    <div className='mt-5 w-full border-1 border-light-orange dark:border-dark-orange' />
                    <div className='mt-20'>
                        {replies?.map((reply) => (
                            <div key={reply.sender.id + reply.comment} className='mt-2'>
                                <div className='border-light-orange border-b-1 dark:border-dark-orange rounded-lg p-1 mt-2 hover:bg-light-white dark:hover:bg-dark-grey-lighter'>
                                    <div>
                                        <div className='flex flex-row justify-center space-x-5 '>
                                            <div>
                                                <img src={reply?.sender?.profile_image} alt={'User profile'} width={60} />
                                            </div>
                                            <Link to={`/profiles/${reply?.sender.id}`} style={{ textDecoration: 'none' }}>
                                                <div className='mt-5'>
                                                    <Title text={reply?.sender?.profile_name} lengthLimit={true} hover={false} />
                                                </div>
                                            </Link>
                                        </div>
                                        <div className='flex justify-center mt-2 dark:text-white'>
                                            {reply?.comment}
                                        </div>
                                        <div className='flex justify-center mt-2 dark:text-white'>
                                            {formatDate(reply?.date)}
                                        </div>
                                        <div className='sm:flex flex-row justify-center mt-5 space-x-2 hidden'>
                                            {/* <Button icon={<BsReply size={'26px'} />} func={() => initReplyToResponse(reply?.sender?.id, reply?.id)} /> */}
                                            <Button icon={<BsReply size={'26px'} />} func={() => initReplyToResponse(reply?.sender, reply?.id, reply?.comment)} />
                                            <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(reply?.sender?.id, reply?.id, 1)} />
                                            <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(reply?.sender?.id, reply?.id, 2)} />
                                            <div className={`${loggedInProfile.id === reply?.sender?.id ? 'flex justify-center' : 'hidden'}`}>
                                                <Button icon={<MdDeleteForever size={'26px'} />} func={() => openConfirmDelete(reply?.id)} />
                                            </div>
                                        </div>
                                        <Link
                                            to={`/articles/comments/${reply.id}`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className='mt-5'>
                                                <SentimentIndicator
                                                    dislikes={reply?.sentiment[1]}
                                                    likes={reply?.sentiment[0]}
                                                    likePercent={reply?.sentiment[2]}
                                                />
                                            </div>
                                            <div>
                                                {showReplies(reply.comment_replies, reply.id)}
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                        Comments cannot be recovered once deleted
                    </div>
                    <div className='flex flex-row justify-center mt-5 space-x-5'>
                        <Button func={() => cancelDelete()} icon={<MdOutlineCancel size={'26px'} />} />
                        <Button func={() => handleDelete()} icon={<MdCheck size={'26px'} />} />
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={openReplyModal}
                onRequestClose={() => openReplyModal(false)}
                contentLabel="Reply"
                ariaHideApp={false}
                className={`${darkMode ? 'darkReplyModal' : 'lightReplyModal'}`}
                overlayClassName={'overlayModal'}
            >
                <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center m-4'>
                    Reply
                </div>
                <div className='mt-2 mb-2'>
                    {displayPosterProfile()}
                </div>
                <InputArea
                    required={true}
                    type='input'
                    placeholder='Response'
                    defaultValue={''}
                    borderColor={`${responseError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                    onChange={e => handleResponse(e.target.value)}
                />

                <div className='flex flex-row justify-center mt-5 space-x-5'>
                    <Button func={() => submitReplyToResponse()} icon={<MdCheck size={'26px'} />} />
                    <Button func={() => cancelResponse()} icon={<MdOutlineCancel size={'26px'} />} />
                </div>
            </Modal>
            <LoginAlert open={loginAlert} />
        </>
    )
}

export default CommentThread