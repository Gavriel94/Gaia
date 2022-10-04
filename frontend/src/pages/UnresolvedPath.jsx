import React from 'react'
import { Title, Button } from '../components'
import { Link } from 'react-router-dom'

/**
 * Page displayed when route not found
 * Button to link home as placeholder
 * TODO: link button to users previous page instead of Home
 */

const UnresolvedPath = () => {

    return (
        <div className='w-full h-full dark:bg-dark-grey'>
            <div className='flex justify-center'>
                <div className='mt-60'>
                    <Title text={`Oops looks like this page doesn't exist`} size={'text-6xl'} />
                </div>
                <div className='flex pt-14' />
            </div>
            <div className='grid columns-1 content-center justify-center mt-20 dark:bg-dark-grey'>
                <Link to={'/home'}>
                    <Button label={'Home'} />
                </Link>

            </div>
        </div>
    )
}

export default UnresolvedPath