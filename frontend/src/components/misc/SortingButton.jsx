import React, { useState } from 'react'
import { useStateContext } from '../../context/ContextProvider'
import { AiOutlineFire, AiOutlineStar } from 'react-icons/ai'
import { TbSun, TbSunrise } from 'react-icons/tb'
import Button from './Button'

/**
 * 
 * @returns {JSX.Element} - Changes order of MiniArticles in ArticleList component
 */

const SortingButton = () => {
    const { sortBy, setSortBy, showLogoutAlert, showErrorAlert } = useStateContext()
    const [sortingIcon, setSortingIcon] = useState(<TbSunrise size={'26px'} />) //initial icon because new is default sort
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
            <div className={`${showLogoutAlert && 'hidden'} ${showErrorAlert && 'hidden'} py-3`}>
                <Button
                    title={'Sort'}
                    icon={sortingIcon}
                    func={() => handleUserChoice()}
                    label={`Sorting by ${sortBy}`}
                    labelProps={'text-sm pt-1 pl-2'}
                />
            </div>
        </>
    )
}

export default SortingButton
