import React, { useState } from 'react'
import API from '../../API'
import { Header, SidebarV2, Title, InputField, Button, Editor, ImageTooLargeAlert, NotImageAlert } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Navigate } from 'react-router-dom'
import { BsCardImage } from 'react-icons/bs'
import adaHandleLogo from '../../assets/adaHandleLogoRounded.png'

/**
 * Provides an interface for the user to add additional information to their profile
 * 
 * Page which allows user to add profile image and bio
 */

const EditProfile = () => {
    const {
        loggedInProfile,
        setLoggedInProfile,
        darkMode,
        walletUser,
        setAdaHandleSelected,
        setDisplayAdaHandle,
        adaHandleDetected,
        adaHandleName,
        imageTooLargeAlert,
        notImageAlert,
    } = useStateContext()

    const [newDisplayName, setNewDisplayName] = useState('')
    const [newBio, setNewBio] = useState('')
    const [previewImage, setPreviewImage] = useState(undefined)
    const [showPreview, setShowPreview] = useState(undefined)
    const [imageError, setImageError] = useState(false)
    const [imageErrorMessage, setImageErrorMessage] = useState('')
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const handleBio = (e) => {
        setNewBio(e)
    }

    const handleDisplayName = (e) => {
        setNewDisplayName(e)
    }

    const handleImageUpload = async e => {
        setShowPreview(undefined)
        setImageError(false)
        setImageErrorMessage('')
        let image = e.target.files[0]

        if (image.size > 800000) {
            setImageError(true)
            setImageErrorMessage('Image must be less than 8MB')
            return
        }

        let imageRegEx = /(\.gif|\.jpg|\.png|\.bmp)$/
        let imageValid = imageRegEx.test(image.name)
        if (!imageValid) {
            setImageError(true)
            setImageErrorMessage('File must end with .gif / .jpg / .png / .bmp.')
            return
        }


        setPreviewImage(image)
        setShowPreview(URL.createObjectURL(image))
    }

    const handleAdaHandleSelect = (obj) => {
        const index = adaHandleName.indexOf(obj)
        const adaHandleSelected = adaHandleName[index]
        setAdaHandleSelected('$' + adaHandleSelected)
        setNewDisplayName('$' + adaHandleSelected)
        setDisplayAdaHandle(true)
    }

    const handleSubmit = async () => {
        let updatedProfile = new FormData()

        updatedProfile.append('id', loggedInProfile.id)

        if (newBio.length > 0) {
            updatedProfile.append('bio', newBio)
        }

        if (previewImage !== undefined) {
            updatedProfile.append('profile_image', previewImage)
        }

        if (newDisplayName !== null) {
            updatedProfile.append('profile_name', newDisplayName)
        }


        setLoggedInProfile({ ...loggedInProfile, ...updatedProfile })

        try {
            await API.patch(`/profile/user/${loggedInProfile.id}/update/`, updatedProfile, {
                headers: {
                    'Authorization': `Token ${loggedInProfile.sessionToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                setUpdateSuccess(true)
            })
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
                <SidebarV2 />
            </div>
            <div className={`flex justify-center ${darkMode ? '' : ''}`}>
                <div className='pt-20 justify-center mx-autow-full'>
                    <div className={`${previewImage === undefined ? 'hidden' : 'flex justify-center mt-10'}`}>
                        <img src={showPreview} alt='preview' width={120} className='rounded-lg' />
                    </div>
                    <div className='flex justify-center mt-10'>

                        <div className='cursor-pointer'>
                            <input type='file' className='opacity-0 w-[100px] h-[45px] cursor-pointer absolute' onChange={handleImageUpload} />
                            <div className={`rounded-full focus:outline-none hover:bg-light-white  
                    ${imageError ? 'bg-light-red' : 'bg-light-orange dark:bg-dark-orange'}
                     w-[100px] py-2 px-4 text-xl font-bold cursor-pointer content-center`}>
                                <div className='flex justify-center cursor-pointer'>
                                    <BsCardImage size={'26px'} color={'white'} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${previewImage === undefined ? 'flex text-center justify-center mt-2 ml-5 dark:text-white' : 'hidden'}`}>
                        Add an image
                    </div>
                    <div className='dark:text-white text-black flex justify-center'>
                        Gaia only accepts image files which end in .gif / .jpg / .png / .bmp.
                    </div>
                    <div className={`${imageError ? 'flex justify-center dark:text-white mt-5' : 'hidden'}`}>
                        {imageErrorMessage}
                    </div>
                    <div className='flex justify-center flex-row mt-5'>
                        <div>
                            <Title text={newDisplayName} size={'text-6xl'} hover={true} lengthLimit={true} />
                        </div>
                    </div>
                    <div className='mt-5' />
                    <InputField
                        required={false} type={'input'}
                        placeholder={'Add a personalised name'} defaultValue={''}
                        onChange={e => handleDisplayName(e.target.value)}
                    />
                    <div className='mt-10' />
                    <Title text={'Bio'} size={'text-2xl'} hover={true} />
                    <div className='mt-5' />
                    <Editor setContent={setNewBio} />
                    <div>
                        <div className={`${walletUser && adaHandleDetected ? 'block' : 'hidden'}`}>
                            <div className='m-5 flex justify-center'>
                                <Title text={'Display ADA Handle?'} size={'text-2xl'} hover={true} />
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
                    <div className='mt-5 mb-20 flex justify-center'>
                        <Button label={'Done'} func={handleSubmit} />
                    </div>
                </div>
            </div>
            <ImageTooLargeAlert open={imageTooLargeAlert} />
            <NotImageAlert open={notImageAlert} />
        </>
    )
}

export default EditProfile