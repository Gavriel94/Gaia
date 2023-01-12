import React, { useState, useEffect } from 'react'
import API from '../../API'
import { useStateContext } from '../../context/ContextProvider'
import { BsReply } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import '../../walletModal.css'
import { MdDeleteForever, MdCheck, MdOutlineCancel } from 'react-icons/md'
import { Button, Title, InputField, LoginAlert, AlreadySaidAlert, EmptyFieldAlert } from '..'

/**
 * 
 * @param {String} articleID - ID of the parent article
 *  
 * @returns Comment section with ability to -----
 */

const CommentSection = ({ articleID }) => {
    const {
        loggedInProfile,
        darkMode,
        walletUser,
        loginAlert,
        setLoginAlert,
        alreadySaidAlert,
        setAlreadySaidAlert,
        emptyFieldAlert,
        setEmptyFieldAlert,
    } = useStateContext()

    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [commentSubmitted, setCommentSubmitted] = useState(false)
    const [articleComments, setArticleComments] = useState([])
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deletionConfirmed, setDeletionConfirmed] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState('')
    const [openReplyModal, setOpenReplyModal] = useState(false)
    const [response, setResponse] = useState('')
    const [responseError, setResponseError] = useState(false)

    const [createe, setCreatee] = useState('')
    const [commentUserID, setCommentUserID] = useState('')

    const [replySubmitted, setReplySubmitted] = useState(false)

    const handleComment = (e) => {
        setComment(e)
        if (commentError) {
            setCommentError(false)
        }
    }

    useEffect(() => {
        const refreshComments = async () => {
            await API.get(`articles/article/comments/${articleID}/`)
                .then((res) => {
                    setArticleComments(res.data.reverse())
                    if (commentSubmitted) {
                        setCommentSubmitted(false)
                    }
                    if (deletionConfirmed) {
                        setDeletionConfirmed(false)
                    }
                    if (replySubmitted) {
                        setReplySubmitted(false)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        refreshComments()
    }, [commentSubmitted, deletionConfirmed, articleID, replySubmitted])

    const handleSubmit = async () => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        let newComment = new FormData()
        newComment.append('user', loggedInProfile.id)
        newComment.append('article', articleID)
        newComment.append('comment', comment)
        newComment.append('is_reply', '0')

        for (const v of newComment.values()) {
            console.log(newComment.keys(), v)
        }

        try {
            await API.post(`/articles/article/comment/${articleID}/`, newComment, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                console.log(res)
                // if (res.status === 201) {
                //     setCommentSubmitted(true)
                //     setComment('')
                // }
                setCommentSubmitted(true)
            })
        } catch (err) {
            if (err.response.status === 400 && comment.length > 1) {
                setAlreadySaidAlert(true)
                setCommentError(true)
                return
            }
            if (err.response.status === 400) {
                setEmptyFieldAlert(true)
                setCommentError(true)
                return
            }
        }
    }

    const openConfirmDelete = (e) => {
        setConfirmDelete(true)
        setCommentToDelete(e)
    }

    const cancelDelete = () => {
        setConfirmDelete(false)
    }

    const handleDelete = async () => {
        console.log(commentToDelete)
        await API.delete(`articles/article/comment/delete/${commentToDelete}/`, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res => {
            console.log(res)
            setConfirmDelete(false)
            setDeletionConfirmed(true)
        })).catch(console.err)
    }

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const showReplies = (replies, commentID) => {
        if (replies.length === 1) {
            return (
                <div className='mt-2'>
                    <div className='flex justify-center'>
                        1 response.
                    </div>
                    <div className='flex justify-center'>
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
                    <div className='flex justify-center'>
                        {replies.length} responses.
                    </div>
                    <div className='flex justify-center'>
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
                <div className='mt-2 flex justify-center'>
                    No replies
                </div>
            )
        }
    }

    const initReply = (createeID, commentID) => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        setCommentUserID(commentID)
        setCreatee(createeID)
        setOpenReplyModal(true)
    }

    const handleResponse = (e) => {
        setResponse(e)
        if (responseError) {
            setResponseError(false)
        }
    }

    const cancelResponse = () => {
        setCommentUserID('')
        setCreatee('')
        setResponse('')
        setOpenReplyModal(false)
        if (responseError) {
            setResponseError(false)
        }
    }

    const submitResponse = async () => {
        let userResponse = new FormData()
        userResponse.append('user', loggedInProfile.id)
        userResponse.append('reply', commentUserID)
        userResponse.append('comment', response)
        userResponse.append('article', articleID)
        userResponse.append('is_reply', '1')

        for (const v of userResponse.values()) {
            console.log(v)
        }

        await API.post(`/articles/article/comment/response/${commentUserID}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res)
            setOpenReplyModal(false)
            setReplySubmitted(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const submitSentiment = (e) => {
        let response = new FormData()
        response.append('comment',)
        response.append('createe')
        response.append('responder')
        response.append('sentiment', e)
    }

    return (
        <div className='border-2 border-light-orange dark:border-dark-orange rounded-lg p-10 w-full'>
            {/* <div className='overflow-scroll'> */}
            <div>
                <Title text={'Comments'} hover={true} size={'text-xl'} />
            </div>
            <div className='mt-10'>
                <div>
                    <InputField
                        required={true}
                        type='input'
                        placeholder='Comment'
                        defaultValue={''}
                        borderColor={`${commentError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                        onChange={e => handleComment(e.target.value)}
                    />
                </div>
                <div className='flex justify-center mt-5'>
                    <Button label={'Submit'} func={handleSubmit} />
                </div>
            </div>
            <div className='mt-5 w-full border-2 border-light-orange dark:border-dark-orange' />
            <div className='overflow-scroll'>
                {articleComments?.map((articleComment) => (
                    <div key={articleComment.user + articleComment.comment} className='mt-2'>
                        <div className='border-t-2 border-l-2 border-r-2 border-b-2 border-light-orange dark:border-dark-orange rounded-lg p-3 mt-5'>
                            <div>
                                <Link to={`/profiles/${articleComment.user.id}`} style={{ textDecoration: 'none' }}>
                                    <div className='flex flex-row'>
                                        <div className='m-auto'>
                                            <Title text={articleComment.user.profile_name} lengthLimit={true} hover={false} />
                                        </div>
                                        <div className='m-auto'>
                                            <img src={articleComment.user.profile_image} alt={'User profile'} width={60} />
                                        </div>
                                    </div>
                                </Link>
                                <div className='flex justify-center mt-2'>
                                    {articleComment.comment}
                                </div>
                                <div className='flex justify-center mt-2'>
                                    {formatDate(articleComment.date)}
                                </div>
                                <div className='flex flex-row justify-center mt-5 space-x-2'>
                                    <Button icon={<BsReply size={'26px'} />} func={() => initReply(articleComment.user.id, articleComment.id)} />
                                    <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(1)} />
                                    <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(2)} />
                                    <div className={`${loggedInProfile.id === articleComment.user.id ? 'flex justify-center' : 'hidden'}`}>
                                        <Button icon={<MdDeleteForever size={'26px'} />} func={() => openConfirmDelete(articleComment.id)} />
                                    </div>
                                </div>
                                <div>
                                    {showReplies(articleComment.comment_replies, articleComment.id)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* </div> */}
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
                className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
                overlayClassName={'overlayModal'}
            >
                <div className='text-4xl font-bold 
                    text-light-white
                    transition-colors duration-500 select-none text-center m-4'>
                    Reply
                </div>
                <InputField
                    required={true}
                    type='input'
                    placeholder='Response'
                    defaultValue={''}
                    borderColor={`${responseError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                    onChange={e => handleResponse(e.target.value)}
                />

                <div className='flex flex-row justify-center mt-5 space-x-5'>
                    <Button func={() => submitResponse()} icon={<MdCheck size={'26px'} />} />
                    <Button func={() => cancelResponse()} icon={<MdOutlineCancel size={'26px'} />} />
                </div>
            </Modal>
            <LoginAlert open={loginAlert} />
            <AlreadySaidAlert open={alreadySaidAlert} />
            <EmptyFieldAlert open={emptyFieldAlert} />
        </div>
    )
}

export default CommentSection