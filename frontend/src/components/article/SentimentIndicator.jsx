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

    const indicatorLabel = () => {
        let likesLabel = 'Likes'
        let dislikesLabel = 'Dislikes'

        if (likes === 1) {
            likesLabel = 'Like'
        }

        if (dislikes === 1) {
            dislikesLabel = 'Dislike'
        }

        const likesOutput = likesLabel + ': ' + likes
        const dislikesOutput = dislikesLabel + ': ' + dislikes

        return (
            <div className='mt-5'>
                <div className='dark:text-white text-black text-center'>
                    {likesOutput}
                </div>
                <div className='dark:text-white text-black text-center'>
                    {dislikesOutput}
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center mt-5'>
            <div className={`${miniArticle ? 'hidden' : ''}`}>

                <div>
                    {calculateIndicatorGradient()}
                    {indicatorLabel()}
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