import React from 'react'

const SentimentIndicator = ({ dislikes, likes, likePercent, miniArticle }) => {

    const calculateIndicatorGradient = () => {
        if (likePercent === 100) {
            const gradient = 'from-light-green to-light-green'
            return (
                <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center text-white`}>
                    100% likes
                </div>
            )
        } else if (likePercent === 0 && dislikes > 0) {
            const gradient = 'from-light-red to-light-red'
            return (
                <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center text-white`}>
                    100% dislikes
                </div>
            )
        } else if (likePercent === 0 && dislikes === 0) {
            return (
                <div className='text-black dark:text-white'>
                    No sentiment
                </div>
            )
        } else {
            const gradient = 'from-light-red to-light-green'
            return (
                <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center text-white`}>
                    {likePercent}% likes
                </div>
            )
        }
    }

    return (
        <div className='flex justify-center mt-5'>
            <div className={`${miniArticle ? 'hidden' : 'flex flex-row'}`}>
                <div className={`${dislikes === 1 ? 'text-center flex px-5 select-none text-black dark:text-white' : 'hidden'}`}>
                    {dislikes} dislike
                </div>
                <div className={`${dislikes !== 1 ? 'text-center flex px-5 select-none text-black dark:text-white' : 'hidden'}`}>
                    {dislikes} dislikes
                </div>
                <div>
                    {calculateIndicatorGradient()}
                </div>
                <div className={`${likes === 1 ? 'text-center flex px-5 select-none text-black dark:text-white' : 'hidden'}`}>
                    {likes} like
                </div>
                <div className={`${likes !== 1 ? 'text-center flex px-5 select-none text-black dark:text-white' : 'hidden'}`}>
                    {likes} likes
                </div>
            </div>
            <div className={`${miniArticle ? 'block' : 'hidden'}`}>
                <div>
                    {calculateIndicatorGradient()}
                </div>
            </div>
        </div>

    )
}

export default SentimentIndicator