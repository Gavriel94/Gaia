import React from 'react'

/**
 * Button component which displays a text label and can perform functions when the prop is passed
 * 
 * @param label Text displayed on the button
 * @param labelProps Changes in text styling if required
 * @param func Allows the button to perform any function defined in the top level page
 * @param icon Displays an icon, usually used with react-icons
 * @param image Displays an image in the button
 * @param imageAlt alt text required for images
 * @param imageWidth 
 * @param imageHeight
 * @returns Functional button with the consistent styling of Gaia
 */

const Button = ({ label, labelProps, func, icon, image, imageAlt, imageWidth, imageHeight }) => {
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
            </div>
        </button>
    )
}

export default Button