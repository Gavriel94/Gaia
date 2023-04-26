import React, { useState, useEffect } from 'react'
import API from '../../API'
import { useStateContext } from '../../context/ContextProvider'
import { BsReply } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Modal from 'react-modal'
import '../../replyModal.css'
import { MdDeleteForever, MdCheck, MdOutlineCancel } from 'react-icons/md'
import { Button, Title, InputField, LoginAlert, AlreadySaidAlert, EmptyFieldAlert, SentimentIndicator, ExceedsLengthAlert, InputArea } from '..'

/**
 * 
 * @param {String} articleID - ID of the parent article
 * @param {String} articleAuthor - ID of the writer of the article
 *  
 * @returns {JSX.Element} Comment section to be displayed underneath an article, shows all top level comments
 */

const CommentSection = ({ articleID, articleAuthor }) => {
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
        exceedsLengthAlert,
        setExceedsLengthAlert,
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

    // Variables used to direct a response
    const [createe, setCreatee] = useState('') // Createe of comment user is responding to
    const [commentUserID, setCommentUserID] = useState('')
    const [respondingTo, setRespondingTo] = useState('')

    const [replySubmitted, setReplySubmitted] = useState(false)
    const [reactionSubmitted, setReactionSubmitted] = useState(false)

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
    }, [commentSubmitted, deletionConfirmed, articleID, replySubmitted, reactionSubmitted])

    const handleSubmit = async () => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }

        let newComment = new FormData()
        newComment.append('user', loggedInProfile.id)
        newComment.append('sender', loggedInProfile.id)
        newComment.append('receiver', articleAuthor)
        newComment.append('article', articleID)
        newComment.append('comment', comment)
        newComment.append('is_reply', '0')

        try {
            await API.post(`/articles/article/comment/${articleID}/`, newComment, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                setCommentSubmitted(true)
                setComment('')
            })
        } catch (err) {
            if (comment.length > 250) {
                setExceedsLengthAlert(true)
                setCommentError(true)
                return
            }
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
                    {/* <div className='flex justify-center'>
                        1 response.
                    </div> */}
                    <div className='flex justify-center'>
                        <Link
                            to={`/articles/comments/${commentID}`}
                            style={{ textDecoration: 'none' }}>
                            1 response
                        </Link>
                    </div>
                </div>
            )
        } else if (replies.length > 1) {
            return (
                <div className='mt-2'>
                    {/* <div className='flex justify-center'>
                        {replies.length} responses.
                    </div> */}
                    <div className='flex justify-center'>
                        <Link
                            to={`/articles/comments/${commentID}`}
                            style={{ textDecoration: 'none' }}>
                            {replies.length} responses.
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

    const initReply = (createe, commentID, comment) => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        setCommentUserID(commentID)
        setCreatee(createe)
        setRespondingTo(comment)
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
        userResponse.append('sender', loggedInProfile.id)
        userResponse.append('receiver', articleAuthor)
        userResponse.append('reply', commentUserID)
        userResponse.append('comment', response)
        userResponse.append('article', articleID)
        userResponse.append('is_reply', '1')

        await API.post(`/articles/article/comment/response/${commentUserID}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            setOpenReplyModal(false)
            setReplySubmitted(true)
        }).catch(err => {
            setEmptyFieldAlert(true)
        })
    }

    const handleReaction = async (op_id, comment_id, sentiment) => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        let reaction = new FormData()
        reaction.append('original_poster_id', op_id)
        reaction.append('reactor_id', loggedInProfile.id)
        reaction.append('comment_id', comment_id)
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
            console.log(err)
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

    const handleCommentLength = (comment, commentID) => {
        if (comment.length > 80) {
            let reducedComment = comment.slice(0, 79) + '...'
            return (
                <Link
                    to={`articles/comments/${commentID}`}
                    style={{ textDecoration: 'none' }}
                >
                    {reducedComment}
                </Link>
            )
        }
        else {
            return (
                <div>
                    {comment}
                </div>
            )
        }

    }

    const displayPosterProfile = () => {
        let name = ''
        if (createe?.profile_name?.length > 20) {
            name = createe?.profile_name.slice(0, 19) + '...'
        }
        return (
            <div className=''>
                <div className='flex justify-center text-white'>
                    {name}
                </div>
                <div className='flex flex-row space-x-5 mt-2 border-1 border-white rounded-xl p-2 justify-center'>
                    <div>
                        <img src={createe?.profile_image} alt={'User profile'} width={40} className='rounded-xl' />
                    </div>
                    <div className='mt-2 text-white text-center'>
                        {respondingTo}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='border-2 border-light-orange dark:border-dark-orange rounded-lg p-10 w-1/2'>
            <div>
                <Title text={'Comments'} hover={true} size={'text-xl'} />
            </div>
            <div className='hidden sm:block mt-10'>
                <div>
                    <InputArea
                        required={true}
                        type='input'
                        placeholder='Comment'
                        defaultValue={''}
                        borderColor={`${commentError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                        onChange={e => handleComment(e.target.value)}
                    />
                    <div className='flex justify-end mt-2'>
                        {comment.length}/250
                    </div>
                </div>
                <div className='flex justify-center mt-5'>
                    <Button label={'Submit'} func={handleSubmit} />
                </div>
            </div>
            <div className='mt-5 w-full border-1 border-light-orange dark:border-dark-orange' />
            <div className='overflow-auto'>
                {articleComments?.map((articleComment) => (
                    <div key={articleComment.sender + articleComment.comment} className='mt-2'>
                        <div className='border-light-orange border-b-1 dark:border-dark-orange rounded-lg p-1 mt-2 hover:bg-light-white dark:hover:bg-dark-grey-lighter'>
                            <div>
                                <Link to={`/profiles/${articleComment.sender.id}`} style={{ textDecoration: 'none' }}>
                                    <div className='flex flex-row'>
                                        <div className='m-auto'>
                                            <Title text={articleComment.sender.profile_name} lengthLimit={true} hover={false} />
                                        </div>
                                        <div className='m-auto'>
                                            <img src={articleComment.sender.profile_image} alt={'User profile'} width={60} />
                                        </div>
                                    </div>
                                </Link>
                                <div className='flex justify-center mt-2 text-black dark:text-white'>
                                    {handleCommentLength(articleComment.comment, articleComment.id)}
                                </div>
                                <div className='flex justify-center mt-2 text-black dark:text-white'>
                                    {formatDate(articleComment.date)}
                                </div>
                                <div className='hidden sm:flex flex-row justify-center mt-5 space-x-2'>
                                    <Button icon={<BsReply size={'26px'} />} func={() => initReply(articleComment.sender, articleComment.id, articleComment.comment)} />
                                    <Button icon={<BiLike size={'26px'} />} func={() => handleReaction(articleComment.sender.id, articleComment.id, 1)} />
                                    <Button icon={<BiDislike size={'26px'} />} func={() => handleReaction(articleComment.sender.id, articleComment.id, 2)} />
                                    <div className={`${loggedInProfile.id === articleComment.sender.id ? 'flex justify-center' : 'hidden'}`}>
                                        <Button icon={<MdDeleteForever size={'26px'} />} func={() => openConfirmDelete(articleComment.id)} />
                                    </div>
                                </div>
                                <Link
                                    to={`/articles/comments/${articleComment.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div className='mt-5'>
                                        <SentimentIndicator
                                            dislikes={articleComment.sentiment[1]}
                                            likes={articleComment.sentiment[0]}
                                            likePercent={articleComment.sentiment[2]}
                                        />
                                    </div>
                                    <div className='text-black dark:text-white'>
                                        {showReplies(articleComment.comment_replies, articleComment.id)}
                                    </div>
                                </Link>
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

                <div className='flex flex-row justify-center mt-5 space-x-5 align-bottom'>
                    <Button func={() => submitResponse()} icon={<MdCheck size={'26px'} />} />
                    <Button func={() => cancelResponse()} icon={<MdOutlineCancel size={'26px'} />} />
                </div>
            </Modal>
            <LoginAlert open={loginAlert} />
            <AlreadySaidAlert open={alreadySaidAlert} />
            <EmptyFieldAlert open={emptyFieldAlert} />
            <ExceedsLengthAlert open={exceedsLengthAlert} />
        </div>
    )
}

export default CommentSection