import React, { useEffect, useState } from "react";
import { Title, Sidebar, Header, Button } from "../components";
import API from '../API'
import { useParams, useNavigate } from "react-router-dom";
import { ArticleLoading } from "../components";
import { useStateContext } from "../context/ContextProvider";
import parser from 'html-react-parser'

/**
 * Displays a single Article in a full page view
 */

/**
 * TODO: Sidebar with details about the author, (wallet address or handle, picture if they have one, otherwise default)
 * TODO: Tip button on the bottom denominating ADA
 * TODO: Fix pub_date to be a 24 hour clock. (Needs to be done in Django)
 */

const ArticleDetail = () => {
    const { darkMode } = useStateContext()
    const [article, setArticle] = useState('')
    const { id } = useParams()
    let history = useNavigate()

    useEffect(() => {
        const articleDetail = () => {
            API.get(`/articles/${id}`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(console.error)
        }
        articleDetail()
    }, [])

    const formatDate = (e) => {
        const year = e?.substring(0,4)
        const month = e?.substring(5,7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        console.log(hour)
        console.log(minute)
        console.log(seconds)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    if (article === '') {
        return (
            <>
                <ArticleLoading pageTitle={'Loading'} />
            </>
        )
    }
    else {
        return (
            <>
                <div className='fixed justify-center m-auto left-0 right-0 '>
                    <Header />
                    <Sidebar />
                </div>
                <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
                    <div className='pt-20'>
                        <Title text={`${article.title}`} size={'text-6xl'} />
                        <div className='mt-20 overflow-auto '>
                            {parser(article.content)}
                        </div>
                        <div className='flex justify-center mt-10'>
                            tags: {article.tags}
                        </div>
                        <div className='flex justify-center mt-10'>
                        {console.log('pubdate here')}
                            {formatDate(article.pub_date)} 
                        </div>
                        <div className='mt-10 flex flex-row justify-center'>
                            <div className='px-2'>
                                {article.likes} likes
                            </div>
                            <div>
                                {article.dislikes} dislikes
                            </div>
                        </div>
                        <div className='flex justify-center pt-5 pb-20 sm:pb-10'>
                            <Button label={"Back"}
                                func={() => history(-1)}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ArticleDetail