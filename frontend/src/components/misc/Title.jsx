import React from 'react'

/**
 * Simple title component to enable consistent headers throughout the app
 * 
 * @param {string} text - text to be displayed as the title
 * @param {string} size - size of the text displayed. Must be a complete Tailwind value e.g 'text-2xl'
 * 
 * @returns {JSX.Element} - Title component
 */

const Title = ({ text, size }) => {

    function capitalize(word) {
        return word?.charAt(0).toUpperCase() + word?.slice(1)
    }


    return (
        <div className={`${size} font-bold 
        text-black dark:text-light-white
        hover:text-light-orange
        dark:hover:text-dark-orange
        transition-colors duration-500 select-none text-center`}>
            {capitalize(text)}
        </div>
    )
}

export default Title