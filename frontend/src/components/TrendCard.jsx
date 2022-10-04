import React from 'react'

/**
 * Card used to display items in the Trending Bar
 * @param img
 * @param imgAlt
 * @param header
 * @param tags
 * @returns 
 */

const TrendCard = ({ image, imageAlt, title, tags }) => {

    function capitalize(word) {
        return word?.charAt(0).toUpperCase() + word?.slice(1)
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
                    <div className='justify-center grid grid-cols-3'>
                        <img className='rounded-t-lg'
                            src={image}
                            alt={imageAlt}

                        />
                        <p className='col-span-2 flex-shrink font-medium'>
                            {capitalize(title)}
                        </p>
                        <p className='col-span-2 font-light italic py-10'>
                            {tags}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TrendCard