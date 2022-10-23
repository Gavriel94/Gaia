import React from 'react'
import Title from './Title'

/**
 * Pulsing image to display while posts are loading
 * Taken directly from the Tailwind documentation - https://tailwindcss.com/docs/animation
 */

const ArticleLoading = ({ pageTitle }) => {
    return (
        <div>
            <div className='flex justify-center'>
                <div className='flex pt-14' />
            </div>
            <div className='grid columns-1 content-center justify-center mt-20'>
                <div className="border border-light-orange dark:border-dark-orange bshadow p-4 max-w-sm mx-auto rounded-lg w-[200px]">
                    <div className="animate-pulse flex space-x-4">
                        <div className="rounded-full bg-light-orange dark:bg-dark-orange h-10 w-10"></div>
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 bg-light-orange dark:bg-dark-orange rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-light-orange dark:bg-dark-orange rounded col-span-2"></div>
                                    <div className="h-2 bg-light-orange dark:bg-dark-orange rounded col-span-1"></div>
                                </div>
                                <div className="h-2 bg-light-orange dark:bg-dark-orange rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArticleLoading