import React from 'react'
import { BiLike, BiDislike } from 'react-icons/bi'

const SentimentIndicator = ({ dislikes, likes, likePercent, gradient, miniArticle }) => {

    return (
        <div className='flex justify-center mt-5'>
            <div className='flex flex-row'>

            <div className='text-center flex justify-end select-none px-5'>
                    {dislikes} dislikes
                </div>
                <div>
                    <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center`}>
                        <div className='text-white'>
                        &nbsp; {likePercent}% likes &nbsp;
                        </div>
                    </div> 
                </div>
                <div className='text-center flex px-5 select-none'>
                    {likes} likes
                </div>
            </div>
        </div>
    )
}

export default SentimentIndicator