import React from 'react'

/**
 * Custom input field 
 * borderColor must be defined as the whole Tailwind class string 'border-x'
 */

const InputField = ({ required, type, placeholder, defaultValue, onChange, borderColor, autoComplete, onKeyDown, onKeyUp, value }) => {
    return (

        <div className={`border-4 ${borderColor === undefined ? 'border-light-orange' : borderColor} rounded-lg`}>
            <input className='py-3 grid-cols-2 rounded w-full px-4
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