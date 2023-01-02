import React, { useState } from 'react'
import Button from '../misc/Button'
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io'
import { useStateContext } from '../../context/ContextProvider'
import { MdRefresh, MdOutlineCancel } from 'react-icons/md'
import Title from '../misc/Title'
import { Navigate } from 'react-router-dom'
import API from '../../API'
import LoginAlert from '../alerts/LoginAlert'
import LoadingSpinner from '../misc/LoadingSpinner'


const NotificationsButton = () => {
    const { loggedInProfile, setLoggedInProfile, walletUser, loginAlert, setLoginAlert } = useStateContext()
    const [openNotifications, setOpenNotifications] = useState(false)
    const [openEmpty, setOpenEmpty] = useState(false)
    const [viewComment, setViewComment] = useState(false)
    const [commentID, setCommentID] = useState('')
    const [refreshButton, setRefreshButton] = useState(<MdRefresh size={'26px'} />)

    const handleOpenNotifications = () => {
        setOpenNotifications(!openNotifications)
    }

    const handleOpenEmpty = () => {
        if (!walletUser) {
            setLoginAlert(true)
            return
        }
        setOpenEmpty(!openEmpty)
    }

    const getButton = () => {
        if (loggedInProfile.notifications === undefined) {
            return
        }
        else if (loggedInProfile?.notifications?.length === 0) {
            return (
                <Button icon={<IoMdNotificationsOutline size={'26px'} />} func={() => handleOpenEmpty()} />
            )
        }
        else {
            return (
                <Button icon={<IoMdNotifications size={'26px'} />} notification='true' func={() =>  handleOpenNotifications() } />
            )
        }
    }

    const commentDetail = async (commentID, notificationID) => {
        await API.delete(`profile/notification/delete/${notificationID}`, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            console.log(res)
            setCommentID(commentID)
            // remove article from loggedInProfile.notifications array
            let newNotificationsArray = loggedInProfile.notifications
            console.log(newNotificationsArray)
            let index = -1
            for (let i = 0; i < newNotificationsArray.length; i++) {
                if (newNotificationsArray[i].id === notificationID) {
                    index = i
                }
            }
            if (index > -1) { // item is found
                newNotificationsArray.splice(index, 1)
            }
            setLoggedInProfile({
                sessionToken: loggedInProfile.sessionToken,
                id: loggedInProfile.id,
                username: loggedInProfile.username,
                bio: loggedInProfile.bio,
                profile_image: loggedInProfile.profile_image,
                profile_name: loggedInProfile.profile_name,
                authored: loggedInProfile.authored,
                reacted: loggedInProfile.reacted,
                bookmarked: loggedInProfile.bookmarked,
                notifications: newNotificationsArray
            })
            setViewComment(true)
        }).catch(console.err)
    }

    const refreshNotifications = async () => {
        setRefreshButton(<LoadingSpinner />)

        console.log('pre-refresh', loggedInProfile)

        await API.get(`profile/notification/get/${loggedInProfile.id}`, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            console.log(res)
            setLoggedInProfile({
                sessionToken: loggedInProfile.sessionToken,
                id: loggedInProfile.id,
                username: loggedInProfile.username,
                bio: loggedInProfile.bio,
                profile_image: loggedInProfile.profile_image,
                profile_name: loggedInProfile.profile_name,
                authored: loggedInProfile.authored,
                reacted: loggedInProfile.reacted,
                bookmarked: loggedInProfile.bookmarked,
                notifications: res.data
            })
            setRefreshButton(<MdRefresh size={'26px'} />)
            console.log('post-refresh', loggedInProfile)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            {getButton()}
            {
                viewComment && (
                    <Navigate to={`/articles/comments/${commentID}`} replace={true} />
                )
            }
            {
                openEmpty && (
                    <div className='bg-white dark:bg-dark-grey dark:text-white opacity-100 p-5 mt-20 rounded-lg w-100 h-[200px] border-1 border-black'>
                        <div className='flex justify-center'>
                            <Title text={'No notifications'} size={'text-xl'} />
                        </div>
                        <div className='flex flex-row mt-5 justify-center space-x-2'>
                            <div className=''>
                                <Button icon={refreshButton} func={() => refreshNotifications()} />
                            </div>

                            <div className=''>
                                <Button icon={<MdOutlineCancel size={'26px'} />} func={() => handleOpenEmpty()} />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                openNotifications && (
                    <div className='bg-white dark:bg-dark-grey opacity-100 p-5 mt-40 rounded-lg w-100 h-[300px] overflow-scroll border-1 border-black dark:border-white'>
                        {loggedInProfile.notifications.map((notification) => (
                            <div key={notification.message.id} className='mt-2'>
                                {console.log(notification)}
                                <button
                                    className='w-full border-1 border-light-orange dark:border-dark-orange rounded-xl mt-5'
                                    type="button"
                                    onClick={() => commentDetail(notification.message.id, notification.id)}
                                >
                                    <div className='flex justify-center'>
                                        <div className='dark:text-white text-bold flex justify-center mt-5'>
                                            <Title text={notification.message.user.profile_name} size={'text-xl'} />
                                        </div>
                                        <div className='ml-10'>
                                            <img src={notification.message.user.profile_image} alt={'Responders profile'} width={60} />
                                        </div>
                                    </div>
                                    <div className='dark:text-white flex justify-center mt-2'>
                                        {notification.message.comment}
                                    </div>
                                </button>
                            </div>
                        ))}
                        <div className='flex justify-center'>
                            <Button icon={refreshButton} func={() => refreshNotifications()} />
                        </div>
                        <div className='flex justify-center mt-5'>
                            <Button icon={<MdOutlineCancel size={'26px'} />} func={() => handleOpenNotifications()} />
                        </div>
                    </div>
                )
            }
            <LoginAlert open={loginAlert} />
        </>
    )
}

export default NotificationsButton