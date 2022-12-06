import React from 'react'
import { BiLike, BiDislike } from 'react-icons/bi'

const SentimentIndicator = ({ dislikes, likes, likePercent, gradient, miniArticle }) => {

    return (
        <div className='flex justify-center mt-5'>
            <div className='grid grid-cols-3'>

            <div className='text-center flex justify-end pr-5 select-none'>
                    {dislikes}
                    <div className='px-2'>
                        <BiDislike size={'26px'} />
                    </div>
                </div>
                <div>
                    <div className={`bg-gradient-to-r ${gradient} rounded-lg px-5 select-none text-center`}>
                        <div className='text-white'>
                        &nbsp; {likePercent}% likes &nbsp;
                        </div>
                    </div> 
                </div>
                <div className='text-center flex justify-end pr-5 select-none'>
                    {likes}
                    <div className='px-2'>
                        <BiLike size={'26px'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SentimentIndicator