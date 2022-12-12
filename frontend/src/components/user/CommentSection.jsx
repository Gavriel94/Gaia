import React, { useState, useEffect } from 'react'
import API from '../../API'
import { useStateContext } from '../../context/ContextProvider'
import Editor from '../article/Editor'
import Button from '../misc/Button'
import InputField from '../misc/InputField'
import Title from '../misc/Title'
import DisplayComment from './DisplayComment'
import Modal from 'react-modal'
import { MdDeleteForever, MdCheck, MdOutlineCancel } from 'react-icons/md'
import { GiConsoleController } from 'react-icons/gi'

const CommentSection = ({ articleID, currentComments }) => {
    const { loggedInProfile, darkMode } = useStateContext()
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(false)
    const [commentSubmitted, setCommentSubmitted] = useState(false)
    const [articleComments, setArticleComments] = useState([])
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deletionConfirmed, setDeletionConfirmed] = useState(false)
    const [articleToDelete, setArticleToDelete] = useState('')

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
                })
                .catch(err => {
                    console.log(err)
                })
        }
        refreshComments()
    }, [commentSubmitted, deletionConfirmed, articleID])

    const handleSubmit = async () => {
        let newComment = new FormData()
        newComment.append('user', loggedInProfile.id)
        if (loggedInProfile.profile_name === '') {
            newComment.append('user_profile_name', loggedInProfile.username)
        } else {
            newComment.append('user_profile_name', loggedInProfile.profile_name)
        }
        newComment.append('article', articleID)
        newComment.append('comment', comment)

        for (const v of newComment.values()) {
            console.log(v)
        }

        console.log(articleID)

        try {
            await API.post(`/articles/article/comment/${articleID}/`, newComment, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                console.log(res)
                if (res.status === 201) {
                    setCommentSubmitted(true)
                    setComment('')
                }
            })
        } catch (err) {
            if (err.response.status === 400 && comment.length > 1) {
                alert(`You've already said that!`)
                setCommentError(true)
                return
            }
            if (err.response.status === 400) {
                alert('Comment cannot be empty')
                setCommentError(true)
                return
            }
            if (err.response.status === 401) {
                alert('You must be logged in')
                setCommentError(true)
            }
        }
    }

    const openConfirmDelete = (e) => {
        setConfirmDelete(true)
        setArticleToDelete(e)
    }

    const cancelDelete = () => {
        setConfirmDelete(false)
    }

    const handleDelete = async () => {
        console.log(articleToDelete)
        await API.delete(`articles/article/comment/delete/${articleToDelete}/`, {
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



    return (
        <div className='border-2 border-light-orange dark:border-dark-orange rounded-lg p-10 w-full'>
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
                        <DisplayComment
                            commentID={articleComment.id}
                            userID={articleComment.user.id}
                            userProfileName={articleComment.user.profile_name}
                            userImage={articleComment.user.profile_image}
                            comment={articleComment.comment}
                            date={articleComment.date}
                        />
                        <div className={`${loggedInProfile.id === articleComment.user.id ? 'flex justify-center' : 'hidden'}`}>
                            <Button icon={<MdDeleteForever size={'26px'}/>} func={() => openConfirmDelete(articleComment.id)} />
                        </div>
                    </div>
                ))}
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
        </div>
    )
}

export default CommentSection