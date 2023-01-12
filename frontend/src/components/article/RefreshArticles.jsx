import React, { useState } from 'react'
import { useStateContext } from '../../context/ContextProvider';
import Button from '../misc/Button'
import API from '../../API';
import { VscRefresh } from 'react-icons/vsc'
import LoadingSpinner from '../misc/LoadingSpinner';

/**
 * Button which refreshes the ArticleList component on the Homepage
 * Displays the LoadingSpinner component while refreshing
 * 
 * @returns {JSX.Element} - Button to refresh articles on Homepage
 */

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
          setArticleList({
            articles: res.data.reverse(),
            sortBy: 'newest',
        })
        })
        .catch(console.error)
        setRefreshing(false)
        setButtonIcon(<VscRefresh size={'26px'}/>)
    }
  return (

    <div><Button icon={buttonIcon} func={() => handleRefresh()} label={'Refresh'} labelProps={'text-sm pt-1 pl-2'}/></div>
  )
}

export default RefreshArticles