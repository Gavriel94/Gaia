import React from "react";
import Title from "./Title";
import { RiHeartLine, RiDislikeLine } from 'react-icons/ri'
import Button from './Button'
import { Link } from 'react-router-dom'
import API from '../API'
import parser from 'html-react-parser'

/**
 * Scrollable cards containing article information.
 * Similar to the trending cards but can display in an order the user desires (new/popular etc)
 */

const MiniArticle = ({ id, title, content, tags, image }) => {

    function shortenContent(content) {
        let reducedContent = ''
        if (content.length > 120) {
            reducedContent = content.slice(0, 120) + '...'
        }
        return reducedContent
    }

    return (
        <>
            <div>
                <div className='border-light-orange dark:border-dark-orange p-6 mb-3 w-[250px] border-b-1 md:w-[500px] lg:w-[700px] sm:border-1 sm:border-opacity-50 sm:rounded-3xl'>
                    <Link to={`/articles/${id}`} style={{ textDecoration: 'none' }}>
                        <Title text={title} size={'text-2xl'} /> <img src ={`${image}`} alt="" height={'80'} width={'80'}/>
                        <div className='mt-10 text-center text-black dark:text-light-white'>
                            {content.length > 80 ? shortenContent(parser(content)) : parser(content)}
                        </div>
                        <div className='mt-4 text-black dark:text-light-white'>
                            {tags}
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default MiniArticle