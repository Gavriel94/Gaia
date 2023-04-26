import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  Header,
  SidebarV2,
  Title,
  InputField,
  Button,
  Editor,
  LoadingSpinner,
  TagIcon,
  LoginButton,
  ArticleGuideBar,
} from '../../components'
import API from '../../API'
import { useStateContext } from '../../context/ContextProvider'
import { RiQuillPenLine } from 'react-icons/ri'
import { BsCardImage } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'
import Modal from 'react-modal'

/**
 * Provides an interface for the user to write an article and submit it to the database
 * 
 * @returns {JSX.Element} - Input fields for article creation
 */

const CreateArticleV2 = () => {

  const {
    darkMode,
    loggedInProfile,
    submitted,
  } = useStateContext()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [topics, setTopics] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tagTooShort, setTagTooShort] = useState(undefined)
  const [tagTooLong, setTagTooLong] = useState(undefined)
  const [uniqueTag, setUniqueTag] = useState(undefined)
  const [enoughTopics, setEnoughTopics] = useState(false)
  const [tooManyTopics, setTooManyTopics] = useState(false)

  const [previewImage, setPreviewImage] = useState(undefined)
  const [showPreview, setShowPreview] = useState(undefined)
  const [submit, setSubmit] = useState(false)
  const [IDSet, setIDSet] = useState(false)
  const [ID, setID] = useState('')

  const [imageError, setImageError] = useState(false)
  const [imageErrorMessage, setImageErrorMessage] = useState('')
  const [titleError, setTitleError] = useState(false)
  const [contentError, setContentError] = useState(false)
  const [topicsError, setTopicsError] = useState(false)

  const [openErrorAlert, setOpenErrorAlert] = useState(false)
  const [errors, setErrors] = useState([])
  const [backendResponse, setBackendResponse] = useState('')

  useEffect(() => {
    if (contentError) {
      if (content.length > 1 && content !== '<p></p>') {
        setContentError(false)
      }
    }
  }, [content, contentError])

  const sanitiseInput = (input) => {
    // Only alphanumeric and some punctuation 
    const allowedCharacters = /[^a-zA-Z0-9\s.,!?@'-]+/g;
    // Remove characters which don't match regex
    const sanitizedString = input.replace(allowedCharacters, '');
    return sanitizedString;
  }

  const handleTitle = (e) => {
    setTitle(e)
    if (titleError) {
      setTitleError(false)
    }
  }

  const writeTag = (e) => {
    const { key } = e

    const removePunct = tagInput.replace(/[.,-/#!$%^&*;:{}=\-_`~()@+?><[\]+]/g, '')
    let trimmedInput = removePunct.replace(/\s{2,}/g, ' ');
    trimmedInput = trimmedInput.toLowerCase()

    if (trimmedInput.length < 2) {
      setTagTooShort(true)
      return
    } else {
      setTagTooShort(false)
    }

    if (trimmedInput.length > 14) {
      setTagTooLong(true)
      return
    } else {
      setTagTooLong(false)
    }

    if (topics.includes(trimmedInput)) {
      setUniqueTag(false)
      return
    } else {
      setUniqueTag(true)
    }

    if (topics.length < 1) {
      setEnoughTopics(false)
    } else {
      setEnoughTopics(true)
    }

    if (topics.length > 4) {
      setTooManyTopics(true)

    } else {
      setTooManyTopics(false)
    }

    if (trimmedInput.includes(',')) {
      return
    }

    if (key === ',') {
      e.preventDefault()
      setTopics(prevState => [...prevState, trimmedInput])
      setTagInput('')
      if (topics.length >= 1) {
        setTopicsError(false)
      }
    }
  }

  const deleteTag = (index) => {
    setTopics(prevState => prevState.filter((tag, i) => i !== index))
  }

  const handleImageUpload = async e => {
    setShowPreview(undefined)
    setImageError(false)
    setImageErrorMessage('')
    let image = e.target.files[0]

    if (image.size > 800000) {
      setImageError(true)
      setImageErrorMessage('Image must be smaller than 8MB')
      return
    }

    let imageRegEx = /(\.gif|\.jpg|\.png|\.bmp)$/
    let imageValid = imageRegEx.test(image.name)
    if (!imageValid) {
      setImageError(true)
      setImageErrorMessage('File must end with .gif / .jpg / .png / .bmp.')
      return
    }

    setPreviewImage(image)
    setShowPreview(URL.createObjectURL(image))
  }

  const submissionChecklist = (newArticle) => {
    let errors = []

    for (const v of newArticle) {
      if (v[1] === '') {
        if (v[0] === 'tags') {
          errors.push('topics')
        } else {
          errors.push(v[0])
        }
      }
    }
    setErrors(errors)
  }

  const handleSubmit = async () => {
    let newArticle = new FormData()
    newArticle.append('title', sanitiseInput(title))
    if (content === '<p></p>' || content === '<p></p> ') {
      setContent('')
      setContentError(true)
      return
    }
    newArticle.append('content', content)
    newArticle.append('tags', topics)
    if (previewImage) {
      newArticle.append('preview_image', previewImage)
    }
    newArticle.append('author', loggedInProfile.id)
    newArticle.append('author_username', loggedInProfile.username)
    if (loggedInProfile.profile_name === '') {
      newArticle.append('author_profile_name', loggedInProfile.username)
    } else {
      newArticle.append('author_profile_name', loggedInProfile.profile_name)
    }

    submissionChecklist(newArticle)

    for (const v in newArticle.values()) {
      console.log(v)
    }

    try {
      setSubmit(true)
      setImageError(false)
      setTitleError(false)
      setContentError(false)
      setTopicsError(false)
      var articleID = await API.post("articles/article/create/", newArticle, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        articleID = res.data
        setSubmit(false)
        setID(articleID)
        setIDSet(true)
      })
    } catch (err) {
      setBackendResponse(err.response.data)
      setOpenErrorAlert(true)
      setSubmit(false)
    }
  }

  const displayErrors = () => {
    if (errors.length > 0) {
      return (
        <div>
          Please add:
          <br />
          {
            errors.map((error) => (
              <div className='mt-2'>
                {error.charAt(0).toUpperCase() + error.slice(1)}
              </div>
            ))}
        </div>
      )
    } else {
      return (
        <div>
          {backendResponse}
        </div>
      )
    }
  }

  return (
    <>
      {
        submit && (
          <>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-40'>
              <div className={`${submitted && 'hidden'}`}>
                <LoadingSpinner />
              </div>
              <div className={`${submitted && 'hidden'} mt-10`}>
                <Title text={'Submitting'} size={'text-3xl'} hover={true} />
              </div>
            </div>
          </>
        )
      }
      {
        IDSet && (
          <>
            <Navigate to={`/articles/${ID}/`} replace={true} />
          </>
        )
      }
      {
        <>
          <div className={`${submit ? 'hidden' : 'block'}`}>
            <div className='fixed justify-center m-auto left-0 right-0 '>
              <div className={`${loggedInProfile?.sessionToken ? 'block' : 'hidden'}`}>
                <ArticleGuideBar title={title} content={content} tags={topics} previewImage={previewImage} />
              </div>
            </div>
            <Header />
            <SidebarV2 />
            <div>
              <div className={`${!loggedInProfile?.sessionToken ? 'flex justify-center dark:text-white ' : 'hidden'}`}>
                <div className='hidden sm:block mt-20'>
                  You must login to post an Article
                  <div className='flex justify-center mt-20'>
                    <LoginButton />
                  </div>
                </div>
                <div className='sm:hidden block mt-20'>
                  Articles can only be written on desktop devices for now
                </div>
              </div>
            </div>
            <div className={`${!loggedInProfile?.sessionToken ? 'hidden' : 'block'}`}>
              <div className='flex justify-center'>
                <div className='pt-20'>
                  <div>
                    <Title text={title} size={'text-6xl'} hover={true} lengthLimit={true} />
                  </div>
                  <div className={`${previewImage === undefined ? 'hidden' : 'flex justify-center mt-10'}`}>
                    <img src={showPreview} alt='preview' width={120} className='rounded-lg' />
                  </div>

                  <div className='flex flex-row'>
                    <div className='cursor-pointer flex'>
                      <input type='file' className='opacity-0 w-[100px] h-[45px] cursor-pointer absolute' onChange={handleImageUpload} />
                      <div className={`rounded-full focus:outline-none hover:bg-light-white  
                    ${imageError ? 'bg-light-red' : 'bg-light-orange dark:bg-dark-orange'}
                     w-[100px] py-2 px-4 text-xl font-bold cursor-pointer content-center justify-center`}>
                        <div className='flex justify-center cursor-pointer'>
                          <BsCardImage size={'26px'} color={'white'} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${previewImage === undefined ? 'flex text-center justify-center mt-2 ml-5 dark:text-white' : 'hidden'}`}>
                    Add an image
                  </div>
                  <div className='dark:text-white text-black flex justify-center'>
                  Gaia only accepts image files which end in .gif / .jpg / .png / .bmp.
                  </div>
                  <div className={`${imageError ? 'flex justify-center dark:text-white mt-5' : 'hidden'}`}>
                    {imageErrorMessage}
                  </div>
                  <div className={`${previewImage === undefined ? 'block mt-2 xl:hidden' : 'hidden'}`}>
                    <p className={`${darkMode && 'text-white'} flex justify-center`}>
                      <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please upload a cover image</span>
                    </p>
                  </div>
                  <div className='py-5'>
                    <InputField
                      required={true}
                      type='input'
                      placeholder='Title'
                      defaultValue={''}
                      borderColor={`${titleError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                      onChange={e => handleTitle(e.target.value)}
                    />
                    <div className={`${title === '' ? 'block mt-2 xl:hidden' : 'hidden'}`}>
                      <p className={`${darkMode && 'text-white'} flex justify-center`}>
                        <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please enter a title</span>
                      </p>
                    </div>
                    <div className='py-5' />
                    <Editor
                      setContent={setContent}
                      borderColor={`${contentError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                    />
                    {/* Editor leaves empty <p> topics if content was added then deleted */}
                    <div className={`${content === '' ? 'block mt-2 xl:hidden' : content === '<p></p>' ? 'xl:hidden block mt-2' : 'hidden'}`}>
                      <p className={`${darkMode && 'text-white'} flex justify-center`}>
                        <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please enter content</span>
                      </p>
                    </div>
                    <div className='py-5' />
                    <div className='text-center dark:text-white'>
                      Topics are seperate with a comma
                    </div>
                    <div className='text-center dark:text-white mb-2'>
                      Add up to 5 topics
                    </div>
                    <InputField
                      id='tag field'
                      required={true}
                      type='input'
                      placeholder='Topics'
                      value={tagInput}
                      borderColor={`${topicsError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                      onChange={(e) => {
                        const { value } = e.target
                        setTagInput(value)
                      }}
                      onKeyDown={(e) => writeTag(e)}
                    />
                    <div className='flex justify-center pt-5'>
                      {topics.map((tag, index) =>
                        <div key={tag} className='px-2'>
                          <TagIcon tag={tag} index={index} func={() => deleteTag(index)} tagIcon={<MdOutlineCancel />} />
                        </div>)}
                    </div>
                    <div className='flex justify-center dark:text-white pt-5'>
                      <div className={`${tagInput.length > 0 && tagTooShort ? 'block' : tagTooLong ? 'block' : 'hidden'}`}>
                        Topics must be between 3-15 characters
                      </div>
                      <div className={`${topics.length > 0 && !enoughTopics ? 'block' : 'hidden'}`}>
                        Add at least 2 topics
                      </div>
                      <div className={`${tooManyTopics ? 'block' : 'hidden'}`}>
                        Too many topics!
                      </div>

                    </div>
                    <div className={`${topics.length === 0 ? 'block mt-2 xl:hidden' : 'hidden'}`}>
                      <p className={`${darkMode && 'text-white'} flex justify-center`}>
                        <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Add up to 5 tags. Seperate them with a comma.</span>
                      </p>
                    </div>
                    <div className='py-5' />
                    <div className='flex justify-center'>
                      <Button label={'Submit'} func={handleSubmit} />
                    </div>
                    <div className='flex justify-center pb-20 sm:pb-10 xl:hidden'>
                      <p className='text-center mt-2 text-black dark:text-white select-none'>Articles must comply with the terms of service. Find out more in the <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange" style={{ textDecoration: 'none' }}>Article Guide</Link>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      <Modal
        isOpen={openErrorAlert}
        onRequestClose={() => setOpenErrorAlert(false)}
        contentLabel="Reply"
        ariaHideApp={false}
        className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
        overlayClassName={'overlayModal'}
      >
        <div className='text-2xl font-bold 
        text-light-white
        transition-colors duration-500 select-none text-center m-4'>
          {displayErrors()}
        </div>
        <div className='flex flex-row justify-center mt-5 space-x-5'>
          <Button func={() => setOpenErrorAlert(false)} icon={<MdOutlineCancel size={'26px'} />} />
        </div>
      </Modal>
    </>
  )
}

export default CreateArticleV2 