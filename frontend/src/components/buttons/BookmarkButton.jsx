import React, { useState, useEffect } from 'react'
import { BsBookmarksFill, BsBookmarks } from 'react-icons/bs'
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'
import Button from '../misc/Button'


/**
 * 
 * @param {string} articleID - article to be saved 
 * @param {string} preview_image - image of article
 * @param {string} title - title of article
 * 
 * @returns {JSX.Element} - button to bookmark articles
 */
const BookmarkButton = ({ articleID, preview_image, title }) => {
  const { loggedInProfile, setLoggedInProfile } = useStateContext()
  const [bookmarkIcon, setBookmarkIcon] = useState(<BsBookmarks size={'26px'} />)

  useEffect(() => {
    if (loggedInProfile) {
      for (var i = 0; i < loggedInProfile.bookmarked.length; i++) {
        if (loggedInProfile.bookmarked[i].article.id === articleID) {
          setBookmarkIcon(<BsBookmarksFill size={'26px'} />)
        }
      }
    }
  }, [loggedInProfile.bookmarked, articleID, loggedInProfile])

  const handleBookmark = async () => {
    // if loggedInProfile.bookmarks.contains articleID delete else add
    let bookmarkArticle = new FormData()
    bookmarkArticle.append('user', loggedInProfile.id)
    bookmarkArticle.append('article', articleID)

    await API.post(`/articles/bookmark/${articleID}/`, bookmarkArticle, {
      headers: {
        'Authorization': `Token ${loggedInProfile.sessionToken}`,
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => {
      setBookmarkIcon(<BsBookmarksFill size={'26px'} />)
      // objects are nested as articles in the bookmarked array
      let articleWrapped = {
        article: {
          id: articleID,
          title: title,
          image: preview_image
        }
      }
      let newBookmarkedArray = loggedInProfile.bookmarked
      newBookmarkedArray.push(articleWrapped)
      setLoggedInProfile({
        sessionToken: loggedInProfile.sessionToken,
        id: loggedInProfile.id,
        username: loggedInProfile.username,
        bio: loggedInProfile.bio,
        profile_image: loggedInProfile.profile_image,
        profile_name: loggedInProfile.profile_name,
        authored: loggedInProfile.authored,
        reacted: loggedInProfile.reacted,
        bookmarked: newBookmarkedArray,
        notifications: loggedInProfile.notifications
      })
    }).catch(err => {
      API.delete(`articles/bookmark/delete/${articleID}`, {
        headers: {
          'Authorization': `Token ${loggedInProfile.sessionToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }).then((res => {
        setBookmarkIcon(<BsBookmarks size={'26px'} />)
        var newBookmarkedArray = loggedInProfile.bookmarked
        var index = -1
        for (let i = 0; i < newBookmarkedArray.length; i++) {
          if (newBookmarkedArray[i].article.id === articleID) {
            index = i
          }
        }
        if (index > -1) {
          newBookmarkedArray.splice(index, 1)
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
          bookmarked: newBookmarkedArray,
          notifications: loggedInProfile.notifications
        })
      }))
    })
  }

  return (
    <div>
      <Button icon={bookmarkIcon} func={() => handleBookmark()} />
    </div>
  )
}

export default BookmarkButton