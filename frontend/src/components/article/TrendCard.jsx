import React from 'react'
import { BiTrendingUp } from 'react-icons/bi'

/**
 * Card used to display article previews in the Trending Bar
 * 
 * @param {string} img - Artivle preview image 
 * @param {string} imgAlt - Alt text for article preview image
 * @param {string} header - Header of the article
 * @param {string} tags - Article tags
 * 
 * @returns {JSX.Element} - Card to be displayed in the TrendBar
 */

const TrendCard = ({ image, imageAlt, title, tags, likes }) => {

    function capitalize(word) {
        return word?.charAt(0).toUpperCase() + word?.slice(1)
    }

    const numLikes = (likes) => {
        if (likes === 1) {
            return (
                <div>
                    {likes} like
                </div>
            )
        } else {
            return (
                <div>
                    {likes} likes
                </div>
            )
        }
    }

    return (
        <>
            <div className='flex'>
                <div className='justify-center items-center rounded-3xl border-1 shadow-md 
            py-2 px-4 transition-colors duration-500 cursor-pointer
            w-[300px] h-[175px]
            border-black text-light-white
            bg-light-orange dark:bg-dark-orange
            hover:bg-light-orange-hover dark:hover:bg-dark-orange-hover'>
                    <div className='justify-center grid grid-cols-3 space-x-2'>
                        <img className='rounded-lg'
                            src={image}
                            alt={imageAlt}
                        />
                        <p className='col-span-2 flex-shrink font-medium'>
                            {capitalize(title)}
                        </p>
                        <p className='flex flex-row mt-2 space-x-2'>
                        <div>
                        <BiTrendingUp size={'26px'}/> 
                        </div>
                        <div>
                        {numLikes(likes)}
                        </div>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendCard