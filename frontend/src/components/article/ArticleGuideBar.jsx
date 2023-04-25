import React from 'react'
import Title from '../misc/Title'
import { BiPencil } from 'react-icons/bi'
import { BsCheck2Circle } from 'react-icons/bs'
import { Link } from 'react-router-dom'

/**
 * This is a bar which floats next to the article creation portal
 * The icons change from a quill to a tick when the user fills the appropriate input
 * The bar also contains a link to the full article guide which entails the ToS
 * 
 * @param {string} title
 * @param {string} content
 * @param {string} tags
 * @param {string} previewImage
 * @returns {JSX.Element} Floating bar indicating which elements need to be filled
 */

const ArticleGuideBar = ({ title, content, tags, previewImage }) => {
  return (
    <div>
      <div className={`flex invisible xl:visible items-end px-10 flex-col h-full`}>
        <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-auto fixed'>
          <div className='py-4' />
          <div className='w-[300px] h-[10px] justify-center py-10'>
            <Title text={'Article Guide'} size={'text-3xl'} hover={true} />
          </div>
          <div className='pt-4 gap-y-4 space-x-2 grid grid-cols-1 justify-center dark:text-white'>
            <div className='flex justify-center space-x-2'>
            <div className={`${previewImage === undefined ? 'block' : 'hidden'}`}>
                <BiPencil size={'26px'} />
              </div>
              <div className={`${previewImage === undefined ? 'hidden' : 'block'}`}>
                <BsCheck2Circle size={'26px'}/>
              </div>
              <span className='select-none'>Cover image</span>
            </div>
            <div className={'mt-2 flex justify-center space-x-2'}>
              <div className={`${title === '' ? 'block' : 'hidden'}`}>
                <BiPencil size={'26px'} />
              </div>
              <div className={`${title !== '' ? 'block' : 'hidden'}`}>
                <BsCheck2Circle size={'26px'}/>
              </div>
              <span className='select-none'>Title</span>
            </div>
            <div className='flex justify-center space-x-2'>
            <div className={`${content === '' ? 'block' : content === '<p></p>' ? 'block' : content === '<p></p> ' ? 'block' : 'hidden'}`}>
                <BiPencil size={'26px'} />
              </div>
              <div className={`${content === '' ? 'hidden' : content === '<p></p>' ? 'hidden' : content === '<p></p> ' ? 'hidden' : 'block'}`}>
                <BsCheck2Circle size={'26px'}/>
              </div>
              <span className='select-none'>Content</span>
            </div>
            <div className='flex justify-center space-x-2'>
            <div className={`${tags.length <=1 ? 'block' : 'hidden'}`}>
                <BiPencil size={'26px'} />
              </div>
              <div className={`${tags.length > 1 ? 'block' : 'hidden'}`}>
                <BsCheck2Circle size={'26px'}/>
              </div>
              <span className='select-none'>Tags</span>
            </div>
            <div className='text-center justify-center place-self-center w-[150px]'>
            <div className='mt-2 text-black dark:text-white justify-center text-center select-none'>Articles must comply with the terms of service. Find out more in the <Link to="/articleguide" className="font-medium text-light-orange dark:text-dark-orange" style={{ textDecoration: 'none' }}>Article Guide</Link>.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleGuideBar