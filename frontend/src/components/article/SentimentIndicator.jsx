import React from 'react'

/**
 * 
 * @param {string} dislikes - Number of dislikes
 * @param {string} likes - Number of likes
 * @param {string} likePercent - Number of likes / (likes+dislikes)
 * @param {boolean} miniArticle - Hide number of likes if being displayed in MiniArticle
 * @returns {JSX.Element} - Component displaying user sentiment within a gradient
 */

const SentimentIndicator = ({ dislikes, likes, likePercent, miniArticle }) => {

    const calculateIndicatorGradient = () => {
        let gradient = ''
        let text = `${likePercent}% likes`
        if (likePercent > 90) {
            gradient = 'from-emerald-500 to-emerald-500'
        } else if (likePercent === 0 && dislikes > 0) {
            gradient = 'from-red-500 to-red-500'
        } else if (likePercent === 0 && dislikes === 0) {
            text = 'No sentiment'
        }
        else if (likePercent > 0 && likePercent < 11) {
            gradient = 'from-red-500 from-45% via-red-500 via-45% to-emerald-500'
        }
        else if (likePercent > 10 && likePercent < 21) {
            gradient = 'from-red-500 from-40% via-red-500 via-40% to-emerald-500'
        }
        else if (likePercent > 20 && likePercent < 31) {
            gradient = 'from-red-500 from-35% via-red-500 via-35% to-emerald-500'
        }
        else if (likePercent > 30 && likePercent < 41) {
            gradient = 'from-red-500 from-30% via-red-500 via-30% to-emerald-500'
        }
        else if (likePercent > 40 && likePercent < 51) {
            gradient = 'from-red-500 to-emerald-500'
        }
        else if (likePercent > 50 && likePercent < 61) {
            gradient = 'from-red-500 from-20% via-red-500 via-20% to-emerald-500'
        }
        else if (likePercent > 60 && likePercent < 71) {
            gradient = 'from-red-500 from-15% via-red-500 via-15% to-emerald-500'
        }
        else if (likePercent > 70 && likePercent < 81) {
            gradient = 'from-red-500 from-10% via-red-500 via-10% to-emerald-500'
        }
        else if (likePercent > 80 && likePercent < 91) {
            gradient = 'from-red-500 from-5% via-red-500 via-5% to-emerald-500'
        }
        return (
            <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 w-[350px] select-none text-center text-white`}>
                {text}
            </div>
        )
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