import React, { useState } from 'react'
import { useStateContext } from '../context/ContextProvider';
import Button from './Button'
import API from '../API';
import { VscRefresh } from 'react-icons/vsc'
import LoadingSpinner from './LoadingSpinner';

const RefreshArticles = () => {

    const { setArticleList, setRefreshing } = useStateContext()

    const [buttonIcon, setButtonIcon] = useState(<VscRefresh size={'26px'}/>)

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function handleRefresh() {
        setButtonIcon(<LoadingSpinner />)
        setRefreshing(true)
        await sleep(2000);
        API.get('/articles/all/')
        .then((res) => {
            setArticleList(res.data)
        })
        .catch(console.error)
        setRefreshing(false)
        setButtonIcon(<VscRefresh size={'26px'}/>)
    }
  return (

    <div><Button icon={buttonIcon} func={() => handleRefresh()} label={'Refresh content'} labelProps={'text-sm pt-1 pl-2'}/></div>
  )
}

export default RefreshArticles