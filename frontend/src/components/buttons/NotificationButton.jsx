import React, { useEffect, useState } from 'react'
import Button from '../misc/Button'
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io'
import { useStateContext } from '../../context/ContextProvider'
import { MdOutlineCancel } from 'react-icons/md'
import API from '../../API'
import { BsList, BsEnvelopeOpen, BsEnvelope } from 'react-icons/bs'
import { Link, Navigate } from 'react-router-dom'

/**
 * TODO: Have an icon displaying the total number of unread messages 
 * 
 * @returns {JSX.Element} Button displaying notifications in a dropdown
 */

const NotificationButton = () => {

    const { loggedInProfile } = useStateContext()
    const [open, setOpen] = useState(false)
    const [notificationIcon, setNotificationIcon] = useState(undefined)
    const [notifications, setNotifications] = useState([])
    const [commentID, setCommentID] = useState('')
    const [viewComment, setViewComment] = useState(false)
    const [numberOfNotifications, setNumberOfNotifications] = useState(undefined)

    useEffect(() => {
        const getNotifications = async () => {
            if (loggedInProfile.sessionToken === '') {
                return
            }
            await API.get(`profile/notification/unread/${loggedInProfile.id}/`, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then((res) => {
                setNumberOfNotifications(res.data.length)
                // Only show the 5 latest notifications in the dropdown menu
                setNotifications(res.data.slice(0, 5).reverse())
                if (notifications.length > 0) {
                    setNotificationIcon(
                        <Button icon={<IoMdNotifications size={'26px'} />} func={() => setOpen(!open)} notification={'true'} />
                    )
                } else {
                    setNotificationIcon(
                        <Button icon={<IoMdNotificationsOutline size={'26px'} />} func={() => setOpen(!open)} />
                    )
                }
            }).catch(err => {
                console.log(err)
            })
        }

        getNotifications()
    }, [loggedInProfile.id, loggedInProfile.sessionToken, loggedInProfile, notifications.length, open])

    const sliceComment = (comment) => {
        if (comment.length > 19) {
            return comment.slice(0, 19) + '...'
        }
        else {
            return comment
        }
    }

    const readIcon = (readStatus) => {
        if (readStatus === "0") {
            return (
                <BsEnvelope size={'26px'} />
            )
        } else {
            return <BsEnvelopeOpen size={'26px'} />
        }
    }

    const viewCommentDetail = async (commentID, notificationID) => {
        let readNotif = new FormData()
        readNotif.append('is_read', 1)

        await API.patch(`profile/notification/read/${notificationID}/`, readNotif, {
            headers: {
                'Authorization': `Token ${loggedInProfile.sessionToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            console.log(res)
            setCommentID(commentID)
            setViewComment(true)
            setOpen(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const showNotifications = () => {
        if (notifications.length === 0) {
            return (
                <div className='bg-white dark:bg-dark-grey opacity-100 p-5 mt-4 rounded-lg border-4 border-black dark:border-white'>
                    <div className='flex justify-center text-center dark:text-white'>
                        No new notifications
                    </div>
                    <div className='flex justify-center mt-5 space-x-5'>
                        <Link to={'/profile/notifications'}>
                            <Button icon={<BsList size={'26px'} />} />
                        </Link>
                        <Button icon={<MdOutlineCancel size={'26px'} />} func={() => setOpen(!open)} />
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className='bg-white dark:bg-dark-grey opacity-100 pb-2 relative mt-56 m-auto top-0 rounded-lg border-4 border-black dark:border-white w-full'>
                        <div className='flex text-center justify-center dark:text-white mt-2'>
                            {numberOfNotifications} total notifications
                        </div>
                        {
                            notifications.map((notification) => (
                                <button
                                    className='w-full rounded-xl mt-5'
                                    type="button"
                                    onClick={() => viewCommentDetail(notification.message.id, notification.id)}
                                >
                                    <div key={notification.timestamp} className={`${notification.is_read === "0" ? 'bg-light-orange-hover dark:bg-dark-orange-hover' : 'bg-white dark:bg-dark-grey'} grid grid-cols-3 p-2 border-b-1 border-light-orange dark:border-dark-orange rounded-lg`}>
                                        <div className='ml-10'>
                                            <img src={notification.message.sender.profile_image} width={'50'} alt={'user profile'} />
                                        </div>
                                        <div className='text-black dark:text-white mt-2 text-center'>
                                            {sliceComment(notification.message.comment)}
                                        </div>
                                        <div className='ml-10 mt-2'>
                                            {console.log(notification.is_read)}
                                            {readIcon(notification.is_read)}
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                        <div className='flex justify-center mt-2 space-x-5'>
                            <Link to={'/profile/notifications'}>
                                <Button icon={<BsList size={'26px'} />} />
                            </Link>
                            <Button icon={<MdOutlineCancel size={'26px'} />} func={() => setOpen(!open)} />
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            <div>
                {notificationIcon}
            </div>
            {
                open && (
                    <div>
                        {showNotifications()}
                    </div>
                )
            }
            {
                viewComment && (
                    <Navigate to={`/articles/comments/${commentID}`} replace={true} />
                )
            }
        </>
    )
}

export default NotificationButton