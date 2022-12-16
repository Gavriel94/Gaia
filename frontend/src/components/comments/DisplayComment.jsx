import React, { useState } from 'react'
import Title from '../misc/Title'
import Button from '../misc/Button'
import { Link } from 'react-router-dom'
import { BsReply } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'
import Modal from 'react-modal'
import '../../walletModal.css'
import { useStateContext } from '../../context/ContextProvider'
import { MdCheck, MdOutlineCancel } from 'react-icons/md'
import InputField from '../misc/InputField'
import API from '../../API'
import LoginAlert from '../alerts/LoginAlert'

const DisplayComment = ({ commentID, userID, userProfileName, userImage, comment, date, replies }) => {
    const { darkMode, loggedInProfile, walletUser, loginAlert, setLoginAlert } = useStateContext()
    const [openReplyModal, setOpenReplyModal] = useState(false)
    const [response, setResponse] = useState('')
    const [responseError, setResponseError] = useState(false)

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const handleResponse = (e) => {
        setResponse(e)
        if (responseError) {
            setResponseError(false)
        }
    }

    const cancelResponse = () => {
        setOpenReplyModal(false)
        if (responseError) {
            setResponseError(false)
        }
    }

    const submitResponse = async () => {
        if(!walletUser) {
            setLoginAlert(true)
            return
        }
        let userResponse = new FormData()
        userResponse.append('comment', commentID)
        userResponse.append('createe', userID)
        userResponse.append('responder', loggedInProfile.id)
        userResponse.append('response', response)
        for (const v of userResponse) {
            console.log(userResponse.keys())
            console.log(v)
        }

        await API.post(`/articles/article/comment/response/${commentID}/`, userResponse, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res)
            setOpenReplyModal(false)
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

    const showReplies = () => {
        if (replies.length === 1) {
            return (
                <div className='mt-2'>
                    <div className='flex justify-center'>
                        1 response.
                    </div>
                    <div className='flex justify-center'>
                        <Link>Continue the conversation</Link>
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
                        <Link>Continue the conversation</Link>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    No replies
                </div>
            )
        }
    }


    Modal.setAppElement("#root")

    return (
        <>
            <div className='border-t-2 border-l-2 border-r-2 border-b-2 border-light-orange dark:border-dark-orange rounded-lg p-3 mt-5'>
                <div>
                    <div className='flex flex-row'>
                        <Link to={`/profiles/${userID}`} style={{ textDecoration: 'none' }}>
                            <div>
                                <Title text={userProfileName} lengthLimit={true} hover={false} size={'text-sm'} />
                            </div>
                        </Link>
                        <div className='flex justify-end'>
                            <img src={userImage} alt={'User profile'} width={80} />
                        </div>
                    </div>
                    <div className='flex justify-center mt-2'>
                        {comment}
                    </div>
                    <div className='flex justify-center mt-2'>
                        {formatDate(date)}
                    </div>
                    <div className='flex flex-row justify-center mt-5 space-x-2'>
                        <Button icon={<BsReply size={'26px'} />} func={() => setOpenReplyModal(true)} />
                        <Button icon={<BiLike size={'26px'} />} func={() => submitSentiment(1)} />
                        <Button icon={<BiDislike size={'26px'} />} func={() => submitSentiment(2)} />
                    </div>
                    <div>
                        {showReplies()}
                    </div>
                </div>
            </div>
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
            <LoginAlert open={loginAlert}/>
        </>
    )
}

export default DisplayComment