import React from 'react'

const InputField = ({ required, type, placeholder, defaultValue, onChange }) => {
    return (
        <div className='border-2 border-light-orange rounded-lg'>
            <input className='py-3 grid-cols-2 rounded w-full px-4
                focus:outline-none'
                required={required}
                type={type}
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
            />
        </div>
    )
}

export default InputField