import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Header, Sidebar, Title, InputField, Button, Editor, LoadingSpinner, TagIcon, LoginButton } from '../../components'
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
  const [submit, setSubmit] = useState(false)
  const [IDSet, setIDSet] = useState(false)
  const [ID, setID] = useState('')

  const handleTitle = (e) => {
    setTitle(e)
  }

  const writeTag = (e) => {
    const { key } = e
    const trimmedInput = tagInput.trim()

    if (trimmedInput.length < 2) {
      setTagTooShort(true)
      return
    } else {
      setTagTooShort(false)
    }

    if (trimmedInput.length > 9) {
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
  }

  async function handleSubmit() {
    let newArticle = new FormData()
    newArticle.append('title', title)
    newArticle.append('content', content)
    newArticle.append('tags', tags)
    newArticle.append('preview_image', previewImage)
    newArticle.append('author', loggedInProfile.id)
    if(adaHandleDetected) {
      newArticle.append('author_display_name', adaHandleSelected)
    }
    else { 
      newArticle.append('author_display_name', loggedInProfile.username)
    }
    console.log(newArticle)
    console.log(sessionToken)
    console.log(loggedInProfile)
    for (const v of newArticle.values()) {
      console.log(v)
    }
    try {
      setSubmit(true)
      var id = await API.post("articles/article/create/", newArticle, {
        headers: {
          // 'Authorization': `Token ${sessionToken}`,
          'Content-Type': 'multipart/form-data',
        },
      }
      ).then(response => id = response.data.id)
      setID(id)
      setSubmit(false)
      setIDSet(true)
    } catch (err) {
      console.log(err)
      if (err.message.includes('401')) {
        alert('you must login')
      }
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
            {console.log(sessionToken)}
            <Navigate to={`/articles/${ID}/`} replace={true} />
          </>
        )
      }
      {/* {
        IDSet && (
          <>
            <Navigate to={`/articles/${ID}/`} replace={true} />
          </>
        )
      }
      {
        submit && (
          <>
            <LoadingPage />
          </>
  )
} */}
      {
        <div className={`${submit ? 'hidden' : 'block'}`}>
          <div className='fixed justify-center m-auto left-0 right-0 '>
            <Header />
            <Sidebar />
          </div>
          <div>
            <div className={`${!sessionToken ? 'flex justify-center dark:text-white ' : 'hidden'}`}>
              <div className='mt-20'>
                You must login to post an Article
                <div className='flex justify-center mt-20'>
                  <LoginButton />
                </div>
              </div>
            </div>
          </div>
          <div className={`${!sessionToken ? 'hidden' : 'block'}`}>
            <div className='flex justify-center'>
              <div className='pt-20'>
              <Title text={title} size={'text-6xl'} />
                <div className='flex justify-center mt-20'>
                  <div className='rounded-full focus:outline-none
              bg-light-orange hover:bg-light-white  
              text-light-white dark:bg-dark-orange dark:text-white 
                w-[100px] py-2 px-4 text-xl font-bold cursor-pointer z-0 absolute content-center'>
                    <div className='flex justify-center'>
                      <BsCardImage size={'26px'} />
                    </div>
                  </div>
                  <input type='file' className='opacity-0 z-10 w-[100px] h-[50px] cursor-pointer' onChange={handleImageUpload} />
                </div>
                <div className={`${previewImage === undefined ? 'block mt-2' : 'hidden'}`}>
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
                    onChange={e => handleTitle(e.target.value)}
                  />
                  <div className={`${title === '' ? 'block mt-2' : 'hidden'}`}>
                    <p className={`${darkMode && 'text-white'} flex justify-center`}>
                      <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please enter a title</span>
                    </p>
                  </div>
                  <div className='py-5' />
                  <Editor setContent={setContent} />
                  {/* Editor leaves empty <p> tags if content was added then deleted */}
                  <div className={`${content === '' ? 'block mt-2' : content === '<p></p>' ? 'block mt-2' : 'hidden'}`}>
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
                    onChange={(e) => {
                      const { value } = e.target
                      setTagInput(value)
                    }}
                    onKeyDown={(e) => writeTag(e)}
                  />
                  <div className='flex justify-center pt-5'>
                    {tags.map((tag, index) =>
                      <div className='px-2'>
                        <TagIcon tag={tag} index={index} func={() => deleteTag(index)} tagIcon={<MdOutlineCancel />} />
                      </div>)}
                  </div>
                  <div className='flex justify-center dark:text-white pt-5'>
                    <div className={`${tagInput.length > 0 && tagTooShort ? 'block' : tagTooLong ? 'block' : 'hidden'}`}>
                      Tags must be between 3-10 characters
                    </div>
                    <div className={`${tags.length > 0 && !enoughTags ? 'block' : 'hidden'}`}>
                      Add at least 2 tags
                    </div>
                    <div className={`${tooManyTags ? 'block' : 'hidden'}`}>
                      Too many tags!
                    </div>

                  </div>
                  <div className={`${tags.length === 0 ? 'block mt-2' : 'hidden'}`}>
                    <p className={`${darkMode && 'text-white'} flex justify-center`}>
                      <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Add up to 5 tags. Seperate them with a comma.</span>
                    </p>
                  </div>
                  <div className='py-5' />
                  <div className='flex justify-center'>
                    <Button label={'Submit'} func={handleSubmit} />
                  </div>
                  <div className='flex justify-center pb-20 sm:pb-10'>
                    <p className='text-center mt-2 text-black dark:text-white select-none'>Articles must comply with the terms of service. Find out more in the <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange" style={{ textDecoration: 'none' }}>Article Guide</Link>.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default CreateArticleV2 