import React, { useState } from 'react'
import { Header, SidebarV2, Title, InputField, Button, EmptyFieldAlert, ExceedsLengthAlert, InputTooShortAlert, Footer } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import { Navigate } from 'react-router-dom'
import { AiOutlineEnter } from 'react-icons/ai'

const Search = () => {

    const [submitSearch, setSubmitSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [searchError, setSearchError] = useState(false)

    const {
        emptyFieldAlert,
        setEmptyFieldAlert,
        exceedsLengthAlert,
        setExceedsLengthAlert,
        inputTooShortAlert,
        setInputTooShortAlert,
    } = useStateContext()

    const handleSearch = (e) => {
        setSearchTerm(e)
        if (searchError) {
            setSearchError(false)
        }
    }

    const submitSearchTerm = () => {
        const removePunct = searchTerm.replace(/[.,-/#!$%^&*;:{}=\-_`~()@+?><[\]+]/g, '')
        const trimmedInput = removePunct.replace(/\s{2,}/g, ' ');

        if (trimmedInput.length === 0) {
            setSearchError(true)
            setEmptyFieldAlert(true)
            setSearchTerm('')
            return
        }

        if (trimmedInput.length < 2) {
            setSearchError(true)
            setInputTooShortAlert(true)
            setSearchTerm('')
            return
        }

        if (trimmedInput.length > 14) {
            setSearchError(true)
            setExceedsLengthAlert(true)
            setSearchTerm('')
            return
        }

        setSubmitSearch(true)
    }

    return (
        <>
            {
                submitSearch && (
                    <Navigate to={`/articles/tags/${searchTerm.toLowerCase()}`} replace={true} />
                )
            }
            <Header page={'home'} />
            <SidebarV2 />
            <div className='h-screen'>
                <div className='flex justify-center'>
                    <div className='pt-20'>
                        <Title text={'search'} size={'text-6xl'} hover={true} />
                    </div>
                </div>
                <div className='flex justify-center text-center mt-10 dark:text-white'>
                    Search for a Topic
                    <br />
                    Remember, topics are between 2-15 characters
                </div>
                <div className='flex justify-center text-center dark:text-white mt-20'>
                    <InputField
                        required={true}
                        type={'input'}
                        placeholder={'Topic'}
                        defaultValue={''}
                        borderColor={`${searchError ? 'border-light-red' : 'border-light-orange dark:border-dark-orange'}`}
                        onChange={e => handleSearch(e.target.value)}
                    />
                </div>
                <div className='flex justify-center mt-2 ml-44 dark:text-white'>
                    {searchTerm.length}/15
                </div>
                <div className='justify-center mt-5 hidden sm:flex'>
                    <Button label={'Submit'} func={() => submitSearchTerm()} />
                </div>
                <div className='flex justify-center mt-5 sm:hidden'>
                    <button className='rounded-full focus:outline-none
                    bg-light-orange hover:bg-light-white hover:text-light-orange text-light-white
                    dark:bg-dark-orange dark:hover:bg-dark-grey dark:hover:text-dark-orange dark:text-white py-2 px-4 text-xl font-bold transition-color duration-500 cursor-pointer'
                    onClick={() => submitSearchTerm()}
                    >
                        <AiOutlineEnter size={'26px'}/>
                    </button>
                </div>

                <EmptyFieldAlert open={emptyFieldAlert} />
                <ExceedsLengthAlert open={exceedsLengthAlert} />
                <InputTooShortAlert open={inputTooShortAlert} />
            </div>
            <Footer />
        </>
    )
}

export default Search