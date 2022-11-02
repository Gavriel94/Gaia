import React, { useEffect, useState } from "react";
import { Title, Sidebar, Header, Button, TagIcon } from "../components";
import API from '../API'
import { useParams, useNavigate, Link } from "react-router-dom";
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
 * TODO: Link to tags needs implementation
 * TODO: Add author field
 */

const ArticleDetail = () => {
    const { darkMode } = useStateContext()
    const [article, setArticle] = useState('')
    const { id } = useParams()
    let history = useNavigate()

    useEffect(() => {
        const articleDetail = () => {
            API.get(`/articles/article/${id}/`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(console.error)
        }
        articleDetail()
    }, [])

    const formatDate = (e) => {
        const year = e?.substring(0, 4)
        const month = e?.substring(5, 7)
        const day = e?.substring(8, 10)
        const hour = e?.substring(11, 13)
        const minute = e?.substring(14, 16)
        const seconds = e?.substring(17, 19)

        return hour + ':' + minute + ' ' + day + '/' + month + '/' + year + ' UTC'
    }

    const formatTags = (e) => {
        var tagList = []
        const tagString = e?.split(',')
        tagString?.forEach(tag => tagList.push(tag))

        return (
            tagList.map((tag) =>
                <div key={tag} className='px-2'>
                    <Link>
                        {tag}
                    </Link>
                </div>)
        )
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
                <div className='fixed justify-center m-auto left-0 right-0'>
                    <Header />
                    <Sidebar />
                </div>
                <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
                    <div className='pt-20 justify-center mx-autow-full'>
                        {/* <Title text={`${article.title}`} size={'text-6xl'} /> */}
                        <div className='flex justify-center flex-row'>
                            <div className='pt-5'>
                                <Title text={`${article.title}`} size={'text-6xl'} />
                            </div>
                            <div className='pr-2 sm:pr-0 pl-2 md:pl-10'>
                                <img src={`${article.preview_image}`} className='rounded-lg' alt="" height={'200px'} width={'200px'} />
                            </div>
                        </div>
                        <div className='mt-20' />
                        <div className='justify-center content-center text-center self-center w-[400px] sm:w-[600px] xl:w-[1000px]'>
                            {parser(article.content)}
                        </div>
                        <div className='flex justify-center mt-10'>
                            tags: {formatTags(article.tags)}
                            {/* tags: {article.tags} */}
                        </div>
                        <div className='flex justify-center mt-10'>
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
                            <Button label={"Home"}
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