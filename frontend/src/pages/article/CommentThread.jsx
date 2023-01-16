import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import API from '../../API';
import { useStateContext } from '../../context/ContextProvider';
import { Button, InputField, Title, Header, SidebarV2, LoginAlert } from '../../components';
import { BsReply } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'
import { MdDeleteForever, MdOutlineCancel, MdCheck } from 'react-icons/md'
import Modal from 'react-modal'
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

    useEffect(() => {
        const getComment = async () => {
            console.log(id)
            try {
                await API.get(`/articles/article/comment/detail/${id}`)
                    .then(res => {
                        console.log(res)
                        setOriginalPost(res.data)
                        console.log(res.data)
                        setReplies(res.data.comment_replies.reverse())
                        console.log(res.data.comment_replies)
                        if (responseSubmitted) {
                            setResponseSubmitted(false)
                        }
                        if(replyToResponseSubmitted) {
                            setReplyToResponseSubmitted(false)
                        }
                    })
            } catch (err) {
                console.log(err)
            }
        }
        getComment()
    }, [id, responseSubmitted, deletionConfirmed, replyToResponseSubmitted])

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const submitSentiment = (e) => {
        let response = new FormData()
        response.append('comment',)
        response.append('createe')
        response.append('responder')
        response.append('sentiment', e)
    }

    const handleResponse = (e) => {
        setResponse(e)
        if (responseError) {
            setResponseError(false)
        }
    }

    const submitResponse = async () => {
        if(!walletUser) {
            setLoginAlert(true)
            return
        }
        console.log(originalPost)
        let userResponse = new FormData()
        userResponse.append('sender', loggedInProfile.id)
        userResponse.append('comment', response)
        userResponse.append('receiver', originalPost.sender.id)
        userResponse.append('is_reply', '1')
        userResponse.append('article', '')
        userResponse.append('reply', originalPost.id)
        for (const v of userResponse) {
            console.log(userResponse.keys())
            console.log(v)
        }

        await API.post(`/articles/article/comment/response/${id}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res)
            setResponseSubmitted(true)
            setResponse('')
        }).catch(err => {
            console.log(err)

        })
    }

    const submitReplyToResponse = async () => {
        let userResponse = new FormData()
        userResponse.append('sender', loggedInProfile.id)
        userResponse.append('user', loggedInProfile.id)
        userResponse.append('receiver', commentCreatee)
        userResponse.append('comment', response)
        userResponse.append('article', '')
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
            console.log(res)
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

    const initReplyToResponse = (commentID, commentCreateeID) => {
        if(!walletUser) {
            setLoginAlert(true)
            return
        }
        setCommentUserID(commentID)
        setCommentCreatee(commentCreateeID)
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


    return (
        <>
            <Header page={'thread'} />
            <SidebarV2 />
            <div className='flex justify-center'>
                <div className='mt-36 pb-10'>
                    <div className=''>
                        <div className='flex flex-row justify-center'>
                            <Link to={`/profiles/${originalPost?.sender?.id}`} style={{ textDecoration: 'none' }}>
                                <div>
                                    <Title text={originalPost?.sender?.profile_name} lengthLimit={true} hover={false} />
                                </div>
                            </Link>
                            <div className='flex justify-end'>
                                <img src={originalPost?.sender?.profile_image} alt={'User profile'} width={80} />
                            </div>
                        </div>
                        <div className='mt-10'>
                            <Title text={originalPost?.comment} hover={false} />
                        </div>
                        <div className='flex justify-center mt-2 dark:text-white'>
                            {formatDate(originalPost?.date)}
                        </div>
                        <div className='flex flex-row justify-center mt-5 space-x-2'>
                            <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(1)} />
                            <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(2)} />
                        </div>
                    </div>

                    <div className='flex flex-row space-x-10 mt-20'>
                        <div>
                            <InputField
                                required={true}
                                type='input'
                                placeholder='Reply'
                                defaultValue={''}
                                borderColor={`${responseError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                                onChange={e => handleResponse(e.target.value)}
                            />
                        </div>
                        <div>
                            <Button label={'Submit'} func={() => submitResponse()} />
                        </div>
                    </div>
                    <div className='mt-5 w-full border-2 border-light-orange dark:border-dark-orange' />
                    <div className='mt-20'>
                        {replies?.map((reply) => (
                            <div key={reply.sender.id + reply.comment} className='mt-2'>
                                {console.log(reply)}
                                <div className='border-t-2 border-l-2 border-r-2 border-b-2 border-light-orange dark:border-dark-orange rounded-lg p-3 mt-5'>
                                    <div>
                                        <div className='flex'>
                                            <Link to={`/profiles/${reply?.sender.id}`} style={{ textDecoration: 'none' }}>
                                                <div>
                                                    <Title text={reply?.sender?.profile_name} lengthLimit={true} hover={false} />
                                                </div>
                                            </Link>
                                            <div className='ml-auto'>
                                                <img src={reply?.sender?.profile_image} alt={'User profile'} width={60} />
                                            </div>
                                        </div>
                                        <div className='flex justify-center mt-2 dark:text-white'>
                                            {reply?.comment}
                                        </div>
                                        <div className='flex justify-center mt-2 dark:text-white'>
                                            {formatDate(reply?.date)}
                                        </div>
                                        <div className='flex flex-row justify-center mt-5 space-x-2'>
                                            <Button icon={<BsReply size={'26px'} />} func={() => initReplyToResponse(reply?.sender?.id, reply?.id)} />
                                            <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(1)} />
                                            <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(2)} />
                                            <div className={`${loggedInProfile.id === reply?.sender?.id ? 'flex justify-center' : 'hidden'}`}>
                                                <Button icon={<MdDeleteForever size={'26px'} />} func={() => openConfirmDelete(reply?.id)} />
                                            </div>
                                        </div>
                                        <div>
                                            {showReplies(reply.comment_replies, reply.id)}
                                        </div>
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
                    <Button func={() => submitReplyToResponse()} icon={<MdCheck size={'26px'} />} />
                    <Button func={() => cancelResponse()} icon={<MdOutlineCancel size={'26px'} />} />
                </div>
            </Modal>
            <LoginAlert open={loginAlert}/>
        </>
    )
}

export default CommentThread