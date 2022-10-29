import React from 'react'


const TagIcon = ({ tag, index, func, tagIcon }) => {
  return (
    <div className='rounded-full py-1 pl-2 content-center border-2 duration-500
      border-light-orange hover:text-white hover:bg-light-orange 
      dark:text-white dark:border-dark-orange dark:hover:bg-dark-orange'
      >
      <div className='flex justify-center select-none'>
        <div>
          {tag}
        </div>
        <button onClick={func} className='px-2'>
          {tagIcon}
        </button>
      </div>
    </div>
  )
}

export default TagIcon