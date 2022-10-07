import React, { useEffect, useState } from "react";
import { Title, Sidebar, Header } from "../components";
import API from '../API'
import { useParams } from "react-router-dom";

/**
 * Displays a single Article in a full page view
 */

const ArticleDetail = () => {

    const [article, setArticle] = useState('')
    const { id } = useParams()

    useEffect(() => {
        const articleDetail = () => {
            API.get(`/articles/${id}`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(console.error)
        }
        articleDetail()
        console.log(article)
    }, [id, article])

    return (
        <>
            <div className='fixed justify-center m-auto left-0 right-0 dark:bg-dark-grey'>
                <Sidebar />
                <Header />
            </div>
            <div className='contents-center'>
                <div className='pt-20'>
                    <Title text={`${article.title}`} size={'text-6xl'} />
                </div>
                <div className='mt-20 overflow-auto flex justify-center'>
                    {article.content}
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
            </div>
        </>
    )
}

export default ArticleDetail