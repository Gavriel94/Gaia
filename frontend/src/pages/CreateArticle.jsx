import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Header, Title, Button } from '../components'
import { useStateContext } from '../context/ContextProvider'
import API from '../API'

/**
 * Page for creating a article. 
 * id and publication date are automatically added
 * handle functions require unused props for Quill integration
 * TODO: implement method for images and markdown to be included
 * TODO: sanitize html on client and server side
 */

const CreateArticle = () => {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')

    function handleSubmit(e) {
        const article = {
            title: title,
            content: content,
            tags: tags,
        }

        API.post("/create/", { ...article });
    }

    //! ALL INPUT PROPS NEED SANITIZATION

    const handleTitle = (e) => {
        setTitle(e)
    }

    const handleContent = (e) => {
        setContent(e)
    }

    const handleTags = (e) => {
        setTags(e)
    }

    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0'>
                <Sidebar />
                <Header />
                <div className='flex mt-20 justify-center'>
                    <Title text={'Create an Article'} size={'text-6xl'} />
                </div>
            </div>

            <div className='flex pt-14' />
            <div className='grid columns-1 content-center justify-center'>
                <div className='content-center'>
                    <div className='mt-72 grid justify-center w-full'>
                        <label className='block input-dark-grey dark:input-light-white font-bold 
                                mb-1 md:mb-0 pr-4'
                            htmlFor='title'
                        >
                            Title
                        </label>
                        <div className='border-1 border-light-orange dark:border-dark-orange rounded-lg'>
                            <input className='block p-5 grid-cols-2 rounded w-full py-2 px-4 appearance-none leading-tight border-2 
                        bg-light-white border-light-white input-black
                        dark:bg-dark-silver dark:border-dark-silver dark:input-light-white 
                        focus:outline-none focus:bg-light-white focus:border-light-orange'
                                required={true}
                                type='input'
                                placeholder='title'
                                defaultValue={''}
                                onChange={e => handleTitle(e.target.value)}
                            />
                        </div>
                        <div className='mt-8'>
                            <label className='block input-dark-grey dark:input-light-white font-bold mb-1 md:mb-0 pr-4'
                                htmlFor='content'
                            >
                                Content
                            </label>
                            <div className=''>
                                <input className='block p-5 grid-cols-2 rounded w-full py-2 px-4 appearance-none leading-tight border-2 
                        bg-light-white border-light-white input-black
                        dark:bg-dark-silver dark:border-dark-silver dark:input-light-white 
                        focus:outline-none focus:bg-light-white focus:border-light-orange'
                                    required={true}
                                    type='input'
                                    placeholder='Content'
                                    defaultValue={''}
                                    onChange={e => handleContent(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='mt-8 mb-8'>
                            <label className='block input-dark-grey dark:input-light-white font-bold mb-1 md:mb-0 pr-4'
                                htmlFor='tags'
                            >
                                Tags
                            </label>
                            <div className='border-1 border-light-orange dark:border-dark-orange rounded-lg'>
                                <input className='grid-cols-2 rounded w-full py-2 px-4 appearance-none leading-tight border-2 
                        bg-light-white border-light-white input-black
                        dark:bg-dark-silver dark:border-dark-silver dark:input-light-white 
                        focus:outline-none focus:bg-light-white focus:border-light-orange'
                                    required={true}
                                    type='input'
                                    placeholder='Tags'
                                    defaultValue={''}
                                    onChange={e => handleTags(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button label={'Submit'} func={handleSubmit} />
                        <p className="input-center mt-2 input-sm input- input-dark-grey dark:input-light-white">Unsure how to Article? Read the full <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange hover:underline">Article Guide</Link>.</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreateArticle