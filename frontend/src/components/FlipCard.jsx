import React from 'react'

// TODO: Have to look into resizing on screens < md
//! Has a bug where the front of the Card is not opaque when flipped while using Firefox
//! Text overflow

/**
 * Card which displays an image and text on the front and rotates to show more text on the back
 * 
 * @param img image displayed on the card
 * @param imgAlt alt text required for the image
 * @param header header text of the card
 * @param text main text on front of card
 * @param backText additional information on the back of the card
 */

const FlipCard = ({ image, imgAlt, header, text, backText }) => {
    return (
        <div className='flex w-[400px] h-[150px] bg-transparent cursor-default group perspective rounded-lg'>
            <div className='relative group-hover:rotate-y-180 w-full h-full duration-1000 rounded-lg shadow-md bg-light-orange text-light-white dark:bg-dark-orange dark:text-dark-grey preserve'>
                <div className='absolute w-full h-full hide-back rounded-lg border-2 border-black'>
                    <div className='grid grid-cols-2'>
                        <img src={image} alt={imgAlt} className='col-span-1 px-10 py-10' />
                        <div className='flex flex-col justify-center leading-normal px-1'>
                            <h5 className='mb-1 text-xl font-bold'>{header}</h5>
                            <div>{text}</div>
                        </div>
                    </div>
                </div>
                <div className='absolute hide-back rotate-y-180 w-full h-full bg-gray-100 border-2 border-black rounded-lg'>
                    <div>
                        <div className='flex justify-center leading-normal'>
                            <span className='font-semibold text-center'>{backText}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FlipCard