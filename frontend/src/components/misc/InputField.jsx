import React from 'react'

/**
 * Custom input field 
 * 
 * @param {boolean} required - Set true to make field mandatory
 * @param {string} type - Set field as password/radio/button etc
 * @param {string} placeholder - Placeholder text displayed in the field 
 * @param {string} defaultValue - Value passed to state if user ignores field
 * @param {any} onChange - Event handler, used for passing field content to state, usually by arrow function
 * @param {string} borderColor - Allow further customisation. Must be defined as the whole Tailwind class string eg:'border-x'
 * @param {string} autoComplete - Autocomplete mode such as 'email'
 * @param {any} onKeyDown - Event handler for advanced settings
 * @param {any} onKeyUp - Event handler for advanced settings
 * @param {string} value - Specifies value/default text depending on field type
 * 
 * @returns {JSX.Element} - Input field
 */

const InputField = ({ required, type, placeholder, defaultValue, onChange, borderColor, autoComplete, onKeyDown, onKeyUp, value }) => {
    return (

        <div className={`border-4 ${borderColor === undefined ? 'border-light-orange dark:border-dark-orange' : borderColor} rounded-lg`}>
            <input className='py-3 grid-cols-2 rounded w-full px-4 text-black
                focus:outline-none'
                required={required}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                autoComplete={autoComplete}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                value={value}
            />
        </div>
    )
}

export default InputField