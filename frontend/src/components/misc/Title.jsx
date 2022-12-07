import React, { useEffect, useState } from 'react'

/**
 * Simple title component to enable consistent headers throughout the app
 * 
 * @param {string} text - text to be displayed as the title
 * @param {string} size - size of the text displayed. Must be a complete Tailwind value e.g 'text-2xl'
 * @param {bool} lengthLimit - will slice and resize text if it's too long
 * 
 * @returns {JSX.Element} - Title component
 */

const Title = ({ text, size, lengthLimit, hover }) => {
    const [dynamicSize, setDynamicSize] = useState(size)
    const [dynamicText, setDynamicText] = useState(text)
    function capitalize(word) {
        return word?.charAt(0).toUpperCase() + word?.slice(1)
    }



    useEffect(() => {
        setDynamicText(text)
        if (lengthLimit && text?.length > 20) {
            setDynamicSize('text-6xl')
            setDynamicText(text?.slice(0, 20) + '...')
        }
        if (lengthLimit && text?.length > 40) {
            setDynamicSize('text-4xl')
        }
    }, [lengthLimit, text])



    return (
        <div className={`${dynamicSize} font-bold 
        text-black dark:text-light-white
        ${hover && 'hover:text-light-orange dark:hover:text-dark-orange'}
        transition-colors duration-500 select-none text-center`}>
            {capitalize(dynamicText)}
        </div>
    )
}

export default Title