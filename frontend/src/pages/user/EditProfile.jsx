import React, { useState } from 'react'
import API from '../../API'
import { Header, Sidebar, Title, InputField, Button, Editor } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Navigate } from 'react-router-dom'
import { BsCardImage } from 'react-icons/bs'
import adaHandleLogo from '../../assets/adaHandleLogoRounded.png'

/**
 * Provides an interface for the user to add additional information to their profile
 * 
 * @returns {JSX.Element} - Page which allows user to add profile image and bio
 */

const EditProfile = () => {
    const { sessionToken, 
        loggedInProfile, 
        setLoggedInProfile, 
        darkMode, 
        walletUser, 
        adaHandleSelected, 
        setAdaHandleSelected, 
        setDisplayAdaHandle, 
        adaHandleDetected, 
        adaHandleName } = useStateContext()

    const [newBio, setNewBio] = useState('')
    const [newImage, setNewImage] = useState(undefined)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const handleBio = (e) => {
        setNewBio(e)
    }

    const handleImageUpload = e => {
        if (e.target.files[0].size > 800000) {
            alert('Image must be less than 8MB')
            return
        }
        setNewImage(e.target.files[0])
    }

    const handleAdaHandleSelect = (obj) => {
        const index = adaHandleName.indexOf(obj)
        const adaHandleSelected = adaHandleName[index]
        setAdaHandleSelected('$' + adaHandleSelected)
        setDisplayAdaHandle(true)
    }

    const handleSubmit = async () => {
        let updatedProfile = new FormData()

        if (newBio.length > 0) {
            updatedProfile.append('bio', newBio)
            console.log(newBio)
        }

        if (newImage !== undefined) {
            updatedProfile.append('profile_image', newImage)
            console.log(newImage)
        }

        if(adaHandleDetected) {
            updatedProfile.append('display_name', adaHandleSelected)
        } else {
            updatedProfile.append('display_name', loggedInProfile.username)
        }

        for (const v of updatedProfile.values()) {
            console.log(v)
        }

        try {
            await API.patch(`/profile/user/${loggedInProfile.id}/update/`, updatedProfile, {
                headers: {
                    'Authorization': `Token ${sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => console.log(response))
            setUpdateSuccess(true)
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <>
            {
                updateSuccess && (
                    <>
                        <Navigate to={`/profiles/${loggedInProfile.id}`} replace={true} />
                    </>
                )
            }
            <div className='fixed justify-center m-auto left-0 right-0'>
                <Header page={'edit'} />
                <Sidebar />
            </div>
            <div className={`flex justify-center ${darkMode ? '' : ''}`}>
                <div className='pt-20 justify-center mx-autow-full'>
                    <div className='flex justify-center flex-row'>
                        <div>
                            <Title text={`Edit Profile`} size={'text-6xl'} />
                        </div>
                    </div>
                    <div className='mt-20' />
                    <div className={`${newImage !== undefined ? 'flex justify-center m-5' : 'hidden'}`}>
                        <img src={newImage} alt={'New user profile'} height={'26px'} width={'26px'}/>
                    </div>
                    <Title text={'Write about yourself'} size={'text-2xl'}/>
                    <Editor setContent={setNewBio} />
                    <div>
                    <div>
                        <div className='flex justify-center mt-10 mb-5'>
                            <div className='rounded-full focus:outline-none cursor-pointer
              bg-light-orange hover:bg-light-white  
              text-light-white dark:bg-dark-orange dark:text-white 
                py-2 px-4 text-xl font-bold z-0 absolute content-center'>
                                <div className='flex justify-center cursor-pointer'>
                                    <BsCardImage size={'26px'} />
                                    <div className='pl-2 text-base cursor-pointer'>
                                        Edit profile picture
                                    </div>
                                </div>
                            </div>
                            <input type='file' className='opacity-0 z-10 w-[100px] h-[50px] cursor-pointer' onChange={handleImageUpload} required={false} />
                        </div>
                    </div>
                    <div className={`${walletUser && adaHandleDetected ? 'block' : 'hidden'}`}>
                            <div className='m-5 flex justify-center'>
                                <Title text={'Display ADA Handle?'} size={'text-2xl'}/>
                            </div>
                            <div>
                                {adaHandleName.map(key =>
                                    <div key={key} className='flex justify-center pb-5'>
                                        <div className='flex'> {/** Could add className to hide handle if picked */}
                                            <Button
                                                label={'$' + key}
                                                labelProps={'flex justify-center text-base pl-5 pt-3'}
                                                image={adaHandleLogo}
                                                imageHeight={48}
                                                imageWidth={48}
                                                func={() => handleAdaHandleSelect(key)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 flex justify-center'>
                        <Button label={'Done'} func={handleSubmit} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default EditProfile