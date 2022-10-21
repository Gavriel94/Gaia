import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header, Sidebar, Title, InputField, Button, Editor, LoadingSpinner } from '../components'
import API from '../API'

const CreateArticleV2 = () => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [submit, setSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
  }

  const handleTitle = (e) => {
    setTitle(e)
  }

  const handleTags = (e) => {
    setTags(e)
  }

  function handleSubmit(e) {
    if (content.length === 0) {
      console.log('content is empty')
    }
    const article = {
      title: title,
      content: content,
      tags: tags,
    }
    try {
      API.post("/create/", { ...article });
      confirmSubmit()
    } catch (err) {
      console.log(err)
    }
  }

  // write a condition, if content is empty don't submit
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
              <div className='py-5' />
              <Editor setContent={setContent} />
              <div className='py-5' />
              <InputField
                required={true}
                type='input'
                placeholder='Tags'
                defaultValue={''}
                onChange={e => handleTags(e.target.value)}
              />
              <div className='py-5' />
              <div className='flex justify-center'>
                <Button label={'Submit'} func={handleSubmit} />
              </div>
              <div className='flex justify-center'>
                <p className='text-center mt-2 text-black dark:text-white'>Unsure how to start? Read the full <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange" style={{ textDecoration: 'none' }}>Article Guide</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateArticleV2