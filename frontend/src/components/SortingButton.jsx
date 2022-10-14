import React, { useState } from 'react'
import { useStateContext } from '../context/ContextProvider'
import { AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import { TbSun, TbSunrise } from 'react-icons/tb'
import Button from './Button'

const SortingButton = ({ page }) => {
    const { sortBy, setSortBy, } = useStateContext()
    const [sortingIcon, setSortingIcon] = useState(<AiOutlineStar size={'26px'} />) //initial icon because popular is default sort
    function handleUserChoice(choice) {
        if (sortBy === 'new') {
            setSortBy('popular')
            setSortingIcon(<TbSun size={'26px'} />)
        } else {
            setSortBy('new')
            setSortingIcon(<TbSunrise size={'26px'} />)
        }
    }

    return (
        <>
            <div className='py-3 flex flex-row'>
                <Button
                    title={'Sort'}
                    icon={sortingIcon}
                    func={() => handleUserChoice()}
                />
            </div>
            <p className='dark:text-dark-silver text-dark-grey'>Sorting by {sortBy}</p>
        </>
    )
}

export default SortingButton
