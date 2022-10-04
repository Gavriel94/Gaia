import React from 'react'

/**
 * Button component which displays a text label and can perform functions when the prop is passed
 * 
 * @param label - Text displayed on the button
 * @param func - Allows the button to perform any function defined in the top level page
 * @param icon - Displays an icon, usually used with react-icons
 * @returns Functional button with the consistent styling of Project Gaia
 */

const Button = ({ label, func, icon }) => {
    return (
        <button
            type='button'
            onClick={func}
            className='relative text-xl rounded-full
        bg-light-orange hover:bg-light-white hover:text-light-orange text-light-white
        dark:bg-dark-orange dark:hover:bg-dark-grey dark:hover:text-dark-orange dark:text-white
        font-bold py-2 px-4 transition-color duration-500 cursor-pointer'>
            {label}
            {icon}
        </button>
    )
}

export default Button