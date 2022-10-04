import React from "react";
import Title from "./Title";
import { RiHeartLine, RiDislikeLine } from 'react-icons/ri'
import Button from './Button'
import { Link } from 'react-router-dom'
// import API from '../API'

/**
 * Scrollable cards containing article information.
 * Similar to the trending cards but can display in an order the user desires (new/popular etc)
 */

const MiniArticle = ({ id, title, content, tags }) => {

    // Show snippet of content
    function shortenContent(content) {
        let reducedContent = ''
        if (content.length > 80) {
            reducedContent = content.slice(0, 80) + '...'
        }
        return reducedContent
    }

    const putLike = () => {
        // API.patch(`/articles/${id}/`).catch((error) => {
        //     if (error.response) {
        //         console.log(error.response.data)
        //     }
        // })
        // console.log("like pressed")
    }

    const putDislike = () => {
        // API.put(`/articles/${id}/`).then(response => { console.log(response.data) })
        //     .catch((error) => {
        //         if (error.response) {
        //             console.log(error.response.data)
        //         }
        //     })
    }

    return (
        <>

            <div className='border-light-orange dark:border-dark-orange border-1 border-opacity-50 rounded-3xl p-6 mb-3 w-[500px]'>
                <Link to={`/articles/${id}`}>
                    <Title text={title} size={'text-2xl'} />
                    <div className='mt-10 text-center text-black dark:text-light-white'>
                        {content.length > 80 ? shortenContent(content) : content}
                    </div>
                    <div className='mt-4 text-black dark:text-light-white'>
                        {tags}
                    </div>
                </Link>
                <div>
                    <div className='mt-2 flex flex-row justify-center'>
                        <div className='rounded-full pr-2'>
                            <Button icon={<RiHeartLine />} func={() => putLike()} />
                            <div
                                className='inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 tooltip'
                            >
                                Like
                                <div className='tooltip-arrow' data-popper-arrow></div>
                            </div>
                        </div>
                        <div className='rounded-full'>
                            <Button icon={<RiDislikeLine />} func={() => putDislike()} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MiniArticle