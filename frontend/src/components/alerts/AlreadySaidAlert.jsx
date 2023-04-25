import React from 'react'
import Modal from 'react-modal'
import { useStateContext } from '../../context/ContextProvider'
import '../../walletModal.css'
import Button from '../misc/Button'
import { MdOutlineCancel } from 'react-icons/md'

/**
 * 
 * @param {boolean} open - Parent component opens alert
 * @returns {JSX.Element} Modal with message
 */
const AlreadySaidAlert = ({ open }) => {
    
    const { setAlreadySaidAlert, darkMode } = useStateContext()

    return (
        <Modal
            isOpen={open}
            onRequestClose={() => setAlreadySaidAlert(false)}
            contentLabel="Reply"
            ariaHideApp={false}
            className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
            overlayClassName={'overlayModal'}
        >
            <div className='
                text-2xl font-bold 
                text-light-white
                transition-colors duration-500 select-none text-center m-4
            '>
                Already said that!
            </div>
            <div className='flex flex-row justify-center mt-5 space-x-5'>
                <Button func={() => setAlreadySaidAlert(false)} icon={<MdOutlineCancel size={'26px'} />} />
            </div>
        </Modal>
    )
}

export default AlreadySaidAlert