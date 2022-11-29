import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Header, SidebarV2, Title, InputField, Button, Editor, LoadingSpinner, TagIcon, LoginButton, ArticleGuideBar } from '../../components'
import API from '../../API'
import { useStateContext } from '../../context/ContextProvider'
import { RiQuillPenLine } from 'react-icons/ri'
import { BsCardImage } from 'react-icons/bs'
import { MdOutlineCancel } from 'react-icons/md'

/**
 * Provides an interface for the user to write an article and submit it to the database
 * 
 * @returns {JSX.Element} - Input fields for article creation
 */

/**
 * TODO: Create a checkbox for users to have to comply with ToS
 */

const CreateArticleV2 = () => {

  const { darkMode, loggedInProfile, sessionToken, submitted, adaHandleDetected, adaHandleSelected } = useStateContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [tagTooShort, setTagTooShort] = useState(undefined)
  const [tagTooLong, setTagTooLong] = useState(undefined)
  const [uniqueTag, setUniqueTag] = useState(undefined)
  const [enoughTags, setEnoughTags] = useState(false)
  const [tooManyTags, setTooManyTags] = useState(false)

  const [previewImage, setPreviewImage] = useState(undefined)
  const [showPreview, setShowPreview] = useState(undefined)
  const [submit, setSubmit] = useState(false)
  const [IDSet, setIDSet] = useState(false)
  const [ID, setID] = useState('')

  const [imageError, setImageError] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const [contentError, setContentError] = useState(false)
  const [tagsError, setTagsError] = useState(false)

  const handleTitle = (e) => {
    setTitle(e)
    if (titleError) {
      setTitleError(false)
    }
  }

  useEffect(() => {
    if (contentError) {
      if (content.length > 1 && content !== '<p></p>') {
        setContentError(false)
      }
    }
  }, [content, contentError])

  const writeTag = (e) => {
    const { key } = e
    const trimmedInput = tagInput.trim()

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

    if (tags.includes(trimmedInput)) {
      setUniqueTag(false)
      return
    } else {
      setUniqueTag(true)
    }

    if (tags.length < 1) {
    } else {
      setEnoughTags(true)
    }

    if (tags.length > 4) {
      return
    } else {
      setTooManyTags(false)
    }

    if (trimmedInput.includes(',')) {
      return
    }

    if (key === ',') {
      e.preventDefault()
      setTags(prevState => [...prevState, trimmedInput])
      setTagInput('')
      if (tags.length >= 1) {
        setTagsError(false)
      }
    }
  }

  const deleteTag = (index) => {
    setTags(prevState => prevState.filter((tag, i) => i !== index))
  }

  const handleImageUpload = e => {
    if (e.target.files[0].size > 800000) {
      alert('Image must be less than 8MB')
      return
    }
    setPreviewImage(e.target.files[0])
    setShowPreview(URL.createObjectURL(e.target.files[0]))
    if (imageError) {
      setImageError(false)
    }
  }

  const handleSubmit = async () => {
    let newArticle = new FormData()
    newArticle.append('title', title)
    if (content === '<p></p>') {
      setContent('')
      setContentError(true)
      return
    } 
    newArticle.append('content', content)
    newArticle.append('tags', tags)
    newArticle.append('preview_image', previewImage)
    newArticle.append('author', loggedInProfile.id)
    if (loggedInProfile.profile_name !== null) {
      newArticle.append('author_profile_name', loggedInProfile.profile_name)
    } else {
      newArticle.append('author_profile_name', loggedInProfile.username)
    }

    for (const v of newArticle.values()) {
      console.log('values', v)
    }

    try {
      setSubmit(true)
      setImageError(false)
      setTitleError(false)
      setContentError(false)
      setTagsError(false)
      var articleID = await API.post("articles/article/create/", newArticle, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => {
        articleID = res.data.id
        setSubmit(false)
        setID(articleID)
        setIDSet(true)
      })
    } catch (err) {
      console.log(err.response.data)
      for (let v in err.response.data) {
        if (v === 'preview_image') {
          setImageError(true)
          console.log('Image error')
        }
        if (v === 'title') {
          setTitleError(true)
          console.log('Title error')
        }
        if (v === 'content') {
          setContentError(true)
          console.log('Content error')
        }
        if (v === 'tags') {
          setTagsError(true)
          console.log('Tags error')
        }
      }
      setSubmit(false)
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
                <Title text={'Submitting'} size={'text-3xl'} />
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
        <Header />
        <SidebarV2 />
        <div className={`${submit ? 'hidden' : 'block'}`}>
          <div className='fixed justify-center m-auto left-0 right-0 '>
            <div className={`${loggedInProfile?.sessionToken ? 'block' : 'hidden'}`}>
              <ArticleGuideBar title={title} content={content} tags={tags} previewImage={previewImage} />
            </div>
          </div>
          <div>
            <div className={`${!loggedInProfile?.sessionToken ? 'flex justify-center dark:text-white ' : 'hidden'}`}>
              <div className='mt-20'>
                You must login to post an Article
                <div className='flex justify-center mt-20'>
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
          <div className={`${!loggedInProfile?.sessionToken ? 'hidden' : 'block'}`}>
            <div className='flex justify-center'>
              <div className='pt-20'>
                <Title text={title} size={'text-6xl'} />
                <div className={`${previewImage === undefined ? 'hidden' : 'flex justify-center mt-10'}`}>
                  <img src={showPreview} alt='preview' width={120} className='rounded-lg' />
                </div>
                <div className='flex justify-center mt-20'>
                  <div className={`rounded-full focus:outline-none hover:bg-light-white  
                    ${imageError ? 'bg-light-red' : 'bg-light-orange dark:bg-dark-orange'}
                  text-light-white dark:text-white 
                     w-[100px] py-2 px-4 text-xl font-bold cursor-pointer z-0 absolute content-center`}>
                    <div className='flex justify-center'>
                      <BsCardImage size={'26px'} />
                    </div>
                  </div>
                  <input type='file' className='opacity-0 z-10 w-[100px] h-[50px] cursor-pointer' onChange={handleImageUpload} />
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
                  {/* Editor leaves empty <p> tags if content was added then deleted */}
                  <div className={`${content === '' ? 'block mt-2 xl:hidden' : content === '<p></p>' ? 'xl:hidden block mt-2' : 'hidden'}`}>
                    <p className={`${darkMode && 'text-white'} flex justify-center`}>
                      <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please enter content</span>
                    </p>
                  </div>
                  <div className='py-5' />
                  <InputField
                    id='tag field'
                    required={true}
                    type='input'
                    placeholder='Tags'
                    value={tagInput}
                    borderColor={`${tagsError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                    onChange={(e) => {
                      const { value } = e.target
                      setTagInput(value)
                    }}
                    onKeyDown={(e) => writeTag(e)}
                  />
                  <div className='flex justify-center pt-5'>
                    {tags.map((tag, index) =>
                      <div key={tag} className='px-2'>
                        <TagIcon tag={tag} index={index} func={() => deleteTag(index)} tagIcon={<MdOutlineCancel />} />
                      </div>)}
                  </div>
                  <div className='flex justify-center dark:text-white pt-5'>
                    <div className={`${tagInput.length > 0 && tagTooShort ? 'block' : tagTooLong ? 'block' : 'hidden'}`}>
                      Tags must be between 3-15 characters
                    </div>
                    <div className={`${tags.length > 0 && !enoughTags ? 'block' : 'hidden'}`}>
                      Add at least 2 tags
                    </div>
                    <div className={`${tooManyTags ? 'block' : 'hidden'}`}>
                      Too many tags!
                    </div>

                  </div>
                  <div className={`${tags.length === 0 ? 'block mt-2 xl:hidden' : 'hidden'}`}>
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
    </>
  )
}

export default CreateArticleV2 