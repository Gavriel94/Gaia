import React from 'react'
import Title from '../misc/Title'
import { Link } from 'react-router-dom'

const DisplayComment = ({ userID, userProfileName, userImage, comment, date }) => {

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    return (
        <>
            <div className='border-t-2 border-l-2 border-r-2 border-light-orange dark:border-dark-orange rounded-lg p-3 mt-5'>
                <div>
                    <div className=''>
                        <Link to={`/profiles/${userID}`} style={{ textDecoration: 'none' }}>
                            <div>
                                <Title text={userProfileName} lengthLimit={true} hover={false} size={'text-md'} />
                            </div>
                            <div className='flex justify-end'>
                                <img src={userImage} alt={'User profile'} width={80} />
                            </div>
                        </Link>
                    </div>
                    <div className='flex justify-center mt-2'>
                        {comment}
                    </div>
                    <div className='flex justify-center mt-2'>
                        {formatDate(date)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DisplayComment