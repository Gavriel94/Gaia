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

    if (article === '') {
        return (
            <>
                <ArticleLoading pageTitle={'Loading'} />
            </>
        )
    }
    else {
        return (
            <div className={`${darkMode && 'text-white'}`}>
                <div className='fixed justify-center m-auto left-0 right-0'>
                    <Header />
                    <Sidebar />
                </div>
                <div className='pt-20'>
                        <Title text={`${article.title}`} size={'text-6xl'} />
                    </div>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-40'>
                    <div className='mt-20 justify-center'>
                        {parser(article.content)}
                    </div>
                    <div className='mt-10 flex justify-center'>
                        {article.tags}
                    </div>
                    <div className='mt-10 flex justify-center'>
                        {article.pub_date}
                    </div>
                    <div className='mt-10 flex flex-row justify-center'>
                        <div className='px-2'>
                            {article.likes}
                        </div>
                        <div>
                            {article.dislikes}
                        </div>
                    </div>
                    <div className='flex justify-center pt-5'>
                        <Button label={"Back"}
                            func={() => history(-1)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ArticleDetail