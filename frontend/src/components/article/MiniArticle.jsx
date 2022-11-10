import React from "react";
import Title from "../misc/Title";
import { Link } from 'react-router-dom'
import parser from 'html-react-parser'

/**
 * Cards containing article title, preview image and beginning of content
 * Mapped to data and displayed in the ArticleView component
 * 
 * @param {string} id - ID of the article
 * @param {string} title - Title of the article
 * @param {string} content - Article content
 * @param {string} tags - Article tags
 * @param {string} image - Preview image 
 * @param {string} imageHeight - Adjust height of image
 * @param {string} imageWidth - Adjust width of image
 * 
 * @returns {JSX.Element} Preview of an article
 */

/**
 * TODO: Map buttons to tags 
 */

const MiniArticle = ({ id, title, content, tags, image, imageHeight, imageWidth }) => {

    /**
     * Trims the content if it is too long for the preview
     */
    const contentPreview = () => {
        if (content.length > 120) {
            let reducedContent = content.slice(0, 119) + '...'
            return parser(reducedContent)
        }
        return parser(content)
    }

    return (
        <>
            <div>
                <div className='border-light-orange dark:border-dark-orange p-6 mb-3 w-[250px] border-b-1 md:w-[500px] lg:w-[700px] sm:border-1 sm:border-opacity-50 sm:rounded-3xl'>
                    <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
                        <div className='grid grid-cols-2 grid-rows-2 justify-end content-end'>
                            <div className=''>
                                <Title text={title} size={'text-3xl'} />
                            </div>
                            <div className="justify-end pl-20 hidden sm:block">
                                <img src={`${image}`} alt='Preview' height={imageHeight} width={imageWidth} className='rounded-lg' />
                            </div>
                            <div className="justify-end pl-5 sm:hidden grid-cols-1">
                                <img src={`${image}`} alt='Preview' height={'150'} width={'150'} className='rounded-lg' />
                            </div>
                            <div className='col-span-2 text-center dark:text-white text-black mt-10'>
                                {contentPreview()}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default MiniArticle