import React from 'react'
import { Link } from 'react-router-dom'
import { Title } from '../../components'

/**
 * Smaller than the MiniArticle component
 * Designed for the UserProfile page to link to articles related to User
 * 
 * @param {string} id - ID of the article
 * @param {string} title - Title of the article
 * @param {string} image - Preview image
 * @param {string} imageHeight - Adjust height of image
 * @param {string} imageWidth - Adjust width of image
 * 
 * @returns {JSX.Element} Shows a preview of an article 
 */

const ArticlesWritten = ({ id, title, image, imageHeight, imageWidth }) => {
  return (
    <>
      <div className='border-light-orange dark:border-dark-orange border-b-2 mb-2 w-full'>
        <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
          <div>
            <Title text={title} size={'text-2xl'} />
          </div>
          <div className='flex justify-center'>
            <img src={image} alt='Preview' height={imageHeight} width={imageWidth} className='rounded-lg mb-2'/>
          </div>
        </Link>
      </div>
    </>
  )
}

export default ArticlesWritten