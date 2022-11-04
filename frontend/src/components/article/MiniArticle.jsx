import React from "react";
import Title from "../misc/Title";
import { Link } from 'react-router-dom'
import parser from 'html-react-parser'

/**
 * Cards containing article title, preview image and beginning of content
 * Mapped to data and displayed in the ArticleView component
 * 
 * @param {string} id - ID of the article
 * @param {string} title- Title of the article
 * @param {string} content - Article content
 * @param {string} tags - Article tags
 * @param {string} image - Preview image 
 * 
 * @returns {JSX.Element} Preview of an article
 */

/**
 * TODO: Map buttons to tags 
 */

const MiniArticle = ({ id, title, content, tags, image }) => {

    /**
     * Trims the content if it is too long for the preview
     */
    const contentPreview = () => {
        if (content.length > 120) {
            let reducedContent = content.slice(0, 120) + '...'
            return parser(reducedContent)
        }
        return parser(content)
    }

    return (
        <>
            <div>
                <div className='border-light-orange dark:border-dark-orange p-6 mb-3 w-[250px] border-b-1 md:w-[500px] lg:w-[700px] sm:border-1 sm:border-opacity-50 sm:rounded-3xl'>
                    <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
                        <div className='flex'>
                            <div className='w-2/3'>
                                <div>
                                    <Title text={title} size={'text-3xl'} />
                                </div>
                                <div className='mt-10 text-center text-black dark:text-light-white'>
                                    {contentPreview()}
                                </div>
                                <div className='mt-4 text-black dark:text-light-white'>
                                    {tags}
                                </div>
                            </div>
                            <div className='justify-end sm:m-auto pl-5'>
                                <img src={`${image}`} alt="" height={'150'} width={'150'} className='rounded-lg' />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default MiniArticle