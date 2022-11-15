import React, { useState } from 'react'
import { Title, ProfileArticle, Button } from '../../components'
import { Link } from 'react-router-dom'
import { BsPen } from 'react-icons/bs'
import { BiLike, BiDislike } from 'react-icons/bi'

/**
 * Allows users to see which articles have been authored, liked and disliked on a profile page
 * 
 * @returns {JSX.Element} Sidebar for the UserProfile page
 */
const ProfileArticleBar = ({ header, articles }) => {

    return (
        <div>
            <div className={`flex invisible xl:visible items-end px-10 flex-col h-full`}>
                <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
                    <div className='py-4' />
                    <div className='w-[300px] h-[10px] justify-center py-10'>
                        <Title text={header} size={'text-3xl'} />
                    </div>
                    <div className='pt-4 grid grid-cols-1 gap-y-4'>
                        {articles.map((article) => (
                            <Link to={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
                                <ProfileArticle
                                    id={article.id}
                                    title={article.title}
                                    image={article.preview_image}
                                    imageHeight={80}
                                    imageWidth={80}
                                />
                            </Link>
                        ))}
                        <div className='flex justify-center space-x-2'>
                            <Button icon={<BsPen size={'26px'} />} />
                            <Button icon={<BiLike size={'26px'}/>}/>
                            <Button icon={<BiDislike size={'26px'}/>}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileArticleBar