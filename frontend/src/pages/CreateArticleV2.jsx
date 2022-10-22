import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Header, Sidebar, Title, InputField, Button, Editor, LoadingSpinner } from '../components'
import API from '../API'
import { useStateContext } from '../context/ContextProvider'
import { RiQuillPenLine } from 'react-icons/ri'

// Get HTTP response, and load article detail page for new post

const CreateArticleV2 = () => {

  const { darkMode } = useStateContext()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [submit, setSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [IDSet, setIDSet] = useState(false)
  const [ID, setID] = useState('')

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function confirmSubmit() {
    setSubmit(true);
    await sleep(2000);
    setSubmitted(true)
    await sleep(1000);
    setSubmitted(false)
    setSubmit(false);
    loadNew()
  }

  const handleTitle = (e) => {
    setTitle(e)
  }

  const handleTags = (e) => {
    setTags(e)
  }

  async function handleSubmit() {
    const article = {
      title: title,
      content: content,
      tags: tags,
    }
    try {
      var id = await API.post("/create/", { ...article }).then(response => id =response.data.id)
      setID(id)
      confirmSubmit()
    } catch (err) {
      console.log(err.response)
      console.log(err.request)
      console.log(err.message)
    }
  }

  const loadNew = () => {
    setIDSet(true)
  }

  return (
    <>
      {
        IDSet && (
          <>
            <Navigate to={`/articles/${ID}/`} replace={true} />
          </>
        )
      }
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
              <div className={`${!submitted && 'hidden'}`}>
                <Title text={'Submitted!'} size={'text-6xl'} />
              </div>
            </div>

          </>
        )
      }
      <div className={`${submit ? 'hidden' : 'block'}`}>
        <div className='fixed justify-center m-auto left-0 right-0 '>
          <Header />
          <Sidebar />
        </div>
        <div className='flex justify-center'>
          <div className='pt-20'>
            <Title text={'Create'} size={'text-6xl'} />
            <div className='mt-20'>
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
                required={true}
                type='input'
                placeholder='Tags'
                defaultValue={''}
                onChange={e => handleTags(e.target.value)}
              />
              <div className={`${tags === '' ? 'block mt-2' : 'hidden'}`}>
                <p className={`${darkMode && 'text-white'} flex justify-center`}>
                  <RiQuillPenLine size={'26px'} /> <span className='pl-3 select-none'>Please enter tags</span>
                </p>
              </div>
              <div className='py-5' />
              <div className='flex justify-center'>
                <Button label={'Submit'} func={handleSubmit} />
              </div>
              <div className='flex justify-center pb-20 sm:pb-10'>
                <p className='text-center mt-2 text-black dark:text-white select-none'>Unsure how to start? Read the full <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange" style={{ textDecoration: 'none' }}>Article Guide</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateArticleV2