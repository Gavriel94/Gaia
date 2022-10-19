import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Editor } from '../components'
import { Header, Sidebar, Title, InputField, Button } from '../components'
import API from '../API'

const CreateArticleV2 = () => {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const handleTitle = (e) => {
    setTitle(e)
  }

  const handleTags = (e) => {
    setTags(e)
  }

  function handleSubmit(e) {
    if(content.length === 0) {
      console.log('content is empty')
    }
    const article = {
      title: title,
      content: content,
      tags: tags,
    }

    API.post("/create/", { ...article });
  }

  // write a condition, if content is empty don't submit

  return (
    <>
      <div className='fixed justify-center m-auto left-0 right-0'>
        <Header />
        <Sidebar />
        <div className='flex mt-20 justify-center'>
          <Title text={'Create an Article'} size={'text-6xl'} />
        </div>
      </div>

      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className=''>
          <InputField
            required={true}
            type='input'
            placeholder='Title'
            defaultValue={''}
            onChange={e => handleTitle(e.target.value)}
          />
        </div>
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
          <p className="input-center mt-2 input-sm input- input-dark-grey dark:input-light-white">Unsure how to start? Read the full <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange hover:underline">Article Guide</Link>.</p>
        </div>
      </div>
    </>
  )
}

export default CreateArticleV2