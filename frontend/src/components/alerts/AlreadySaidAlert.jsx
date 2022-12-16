import React from 'react'
import Modal from 'react-modal'
import { useStateContext } from '../../context/ContextProvider'
import '../../walletModal.css'
import Button from '../misc/Button'
import { MdOutlineCancel } from 'react-icons/md'

const AlreadySaidAlert = ({ open }) => {
    const { setAlreadySaid, darkMode } = useStateContext()

    return (
        <Modal
            isOpen={open}
            onRequestClose={() => setAlreadySaid(false)}
            contentLabel="Reply"
            ariaHideApp={false}
            className={`${darkMode ? 'darkWalletModal' : 'lightWalletModal'}`}
            overlayClassName={'overlayModal'}
        >
            <div className='text-2xl font-bold 
        text-light-white
        transition-colors duration-500 select-none text-center m-4'>
                Already said that!
            </div>
            <div className='flex flex-row justify-center mt-5 space-x-5'>
                <Button func={() => setAlreadySaid(false)} icon={<MdOutlineCancel size={'26px'} />} />
            </div>
        </Modal>
    )
}

export default AlreadySaidAlert