import React from "react";
import Title from "./Title";
import { RiHeartLine, RiDislikeLine } from 'react-icons/ri'
import Button from './Button'
import { Link } from 'react-router-dom'
import { useStateContext } from "../context/ContextProvider";
import API from '../API'

/**
 * Scrollable cards containing article information.
 * Similar to the trending cards but can display in an order the user desires (new/popular etc)
 */

const MiniArticle = ({ id, title, content, tags }) => {

    const { screenSize } = useStateContext()

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
            <div>
                <div className={`border-light-orange dark:border-dark-orange p-6 mb-3  ${screenSize < 800 ? 'w-[250px] border-b-1' : 'w-[500px] border-1 border-opacity-50 rounded-3xl'}`}>
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
                            </div>
                            <div className='rounded-full'>
                                <Button icon={<RiDislikeLine />} func={() => putDislike()} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MiniArticle