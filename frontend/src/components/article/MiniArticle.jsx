import React from "react";
import Title from "../misc/Title";
import { Link } from 'react-router-dom'
import parser from 'html-react-parser'
import SentimentIndicator from "./SentimentIndicator";

/**
 * Cards containing article title, preview image and beginning of content
 * Mapped to data and displayed in the ArticleList component
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

const MiniArticle = ({ id, title, content, image, likes, dislikes, percent }) => {

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
                <div className='border-light-orange dark:border-dark-orange p-4 mb-3 mt-3 w-[250px] border-b-1 md:w-[500px] sm:border-1 sm:border-opacity-50 sm:rounded-3xl hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover duration-500'>
                    <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
                        <div className='flex flex-row'>
                            <div className="justify-start hidden sm:block">
                                <img src={image} alt='Preview' width='120' height='120' className='rounded-lg' />
                            </div>
                            <div className="justify-start sm:hidden">
                                <img src={image} alt='Preview' height={'150px'} width={'150px'} className='rounded-lg' />
                            </div>
                            <div className='m-auto'>
                                <Title text={title} size={'text-3xl'} />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 grid-rows-2 justify-end content-end'>
                            <div className='col-span-2 text-center dark:text-white text-black mt-10'>
                                {contentPreview()}
                            </div>
                            <div className='col-span-2'>
                                <SentimentIndicator
                                    likes={likes}
                                    dislikes={dislikes}
                                    likePercent={percent}
                                    miniArticle={true}
                                />
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default MiniArticle