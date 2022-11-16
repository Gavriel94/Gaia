import React from 'react'
import Title from '../misc/Title'
import { Link } from 'react-router-dom'

const AuthorBar = ({ authorID }) => {
  return (
    <div>
    <div className={`flex invisible xl:visible items-end px-10 flex-col h-full`}>
        <div className='duration-300 h-screen bg-opacity-5 dark:bg-opacity-5 overflow-scroll fixed'>
            <div className='py-4' />
            <div className='w-[300px] h-[10px] justify-center py-10'>
                <Title text={'Author'} size={'text-3xl'} />
            </div>
            <div className='pt-4 grid grid-cols-1 gap-y-4'>
                    <Link to={`/articles/${authorID}`} style={{ textDecoration: 'none' }}>
                        
                    </Link>
            </div>
        </div>
    </div>
</div>
  )
}

export default AuthorBar

