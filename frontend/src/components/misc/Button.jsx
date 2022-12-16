import React from 'react'

/**
 * Button component which displays text, images, icons or any combination of them, and can trigger functions
 * 
 * @param {string} label - Text displayed on the button
 * @param {string} labelProps - Changes in text styling if required
 * @param {any} func - Allows the button to perform any function defined in the top level page, usually passed as an arrow function
 * @param {IconType} icon - Displays an icon, usually used with react-icons
 * @param {string} image Displays an image in the button
 * @param {string} imageAlt - Alt text required for images
 * @param {string} imageWidth - Set the image width in px
 * @param {string} imageHeight - Set the image height in px
 * @param {string} notification - Set to show a pusling animation if there is a notification
 * 
 * @returns {JSX.Element} Functional button with the consistent styling of Gaia
 */

const Button = ({ label, labelProps, func, icon, image, imageAlt, imageWidth, imageHeight, notification }) => {
    return (
        <button
            type='button'
            onClick={func}
            className='rounded-full focus:outline-none
        bg-light-orange hover:bg-light-white hover:text-light-orange text-light-white
        dark:bg-dark-orange dark:hover:bg-dark-grey dark:hover:text-dark-orange dark:text-white py-2 px-4 text-xl font-bold transition-color duration-500 cursor-pointer'>
            <div className='flex flex-row text-center justify-center'>
                {<img src={image} alt={imageAlt} height={imageHeight} width={imageWidth} />}
                {icon}
                <div className={`${labelProps}`}>
                    {label}
                </div>
                <div className={`${notification === 'true' ? 'block' : 'hidden'}`}>
                    <div className="animate-ping absolute inline-flex rounded-full h-3 w-3 bg-light-white"></div>
                </div>
            </div>
        </button>
    )
}

export default Button