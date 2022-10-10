import React from 'react'
import Button from './Button'
import { BsFillArrowUpCircleFill } from 'react-icons/bs'

const TopLoader = () => {
  return (
    <div className='fixed'>
        <Button 
            icon={<BsFillArrowUpCircleFill size={'26px'}/>} 
            func={() => {
                window.scrollTo({top: 0, left:0, behavior:'smooth'})
            }}
        />
    </div>
  )
}

export default TopLoader