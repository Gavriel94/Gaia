import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'
import { Header, Title, SidebarV2, Button } from '../../components'
import { BsEnvelope, BsEnvelopeOpen } from 'react-icons/bs'
import { MdDeleteForever } from 'react-icons/md'
import { Navigate } from 'react-router-dom'

/**
 * 
 * Page containing a clickable list of all user notifications
 */

const Notifications = () => {

  const { loggedInProfile, darkMode } = useStateContext()
  const [notifications, setNotifications] = useState([])
  const [loggedIn, setLoggedIn] = useState(undefined)
  const [commentID, setCommentID] = useState('')
  const [viewComment, setViewComment] = useState(false)
  const [notificationDeleted, setNotificationDeleted] = useState(false)


  useEffect(() => {
    const getAllNotifications = async () => {

      setNotificationDeleted(false)

      if (loggedInProfile.sessionToken === '') {
        setLoggedIn(false)
        return
      } else {
        setLoggedIn(true)
      }

      await API.get(`profile/notification/all/${loggedInProfile.id}`, {
        headers: {
          'Authorization': `Token ${loggedInProfile.sessionToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        setNotifications(res.data.reverse())
      })
        .catch(err => {
          console.log(err)
        })
    }

    getAllNotifications()
  }, [notificationDeleted])

  const readIcon = (readStatus) => {
    if (readStatus === '0') {
      return (
        <BsEnvelope size={'26px'} color={`${darkMode ? 'white' : 'black'}`} />
      )
    } else {
      return (
        <BsEnvelopeOpen size={'26px'} color={`${darkMode ? 'white' : 'black'}`} />
      )
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
      setCommentID(commentID)
      setViewComment(true)
    }).catch(console.err)
  }

  const deleteNotification = async (notificationID) => {
    await API.delete(`profile/notification/delete/${notificationID}`, {
      headers: {
        'Authorization': `Token ${loggedInProfile.sessionToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      setNotificationDeleted(true)
    }).catch(console.err)
  }

  const displayNotifications = () => {
    if (notifications.length < 1) {
      return (
        <div className='text-center dark:text-white'>
          No notifications
        </div>
      )
    }

    const sliceStr = (string) => {
      if (string.length > 19) {
          return string.slice(0, 19) + '...'
      }
      else {
          return string
      }
  }

    return (
      notifications.map((notification) => (
        <div className='flex flex-row space-x-5'>
          <button
            className='w-full rounded-xl mt-5'
            type="button"
            onClick={() => viewCommentDetail(notification.message.id, notification.id)}
          >
            <div className={`${notification.is_read === "0" ? 'bg-light-orange-hover dark:bg-dark-orange-hover' : 'bg-white dark:bg-dark-grey'} border-light-orange dark:border-dark-orange rounded-lg w-72`}>
              <div className='grid grid-cols-4 gap-6'>
                <div>
                  <img src={notification.message.sender.profile_image} width={'50'} alt={'sender profile'} />
                </div>
                <div className='mt-2 font-bold'>
                  {sliceStr(notification.message.sender.profile_name)}
                </div>
                <div className='mt-2 col-start-3 col-end-6'>
                  {sliceStr(notification.message.comment)}
                </div>
              </div>
            </div>
          </button>
          <div className='mt-10'>
            <Button icon={<MdDeleteForever size={'26px'} />} func={() => deleteNotification(notification.id)} />
          </div>
        </div>

      ))
    )
  }

  return (
    <>
      <div>
        <Header page={'login'} />
        <SidebarV2 />
        <div className='flex justify-center mt-20'>
          <Title text={'Notifications'} size={'text-6xl'} hover={true} />
        </div>
        <div className='justify-center mt-20 m-auto w-[350px]'>
          {displayNotifications()}
        </div>
      </div>
      {
        viewComment && (
          <Navigate to={`/articles/comments/${commentID}`} replace={true} />
        )
      }
    </>
  )
}

export default Notifications