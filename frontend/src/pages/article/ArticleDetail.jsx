import React, { useEffect, useState } from "react";
import { Title, SidebarV2, Header, Button, TagIcon, ProfileArticleBar } from "../../components";
import API from '../../API'
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { ArticleLoading } from "../../components";
import { useStateContext } from "../../context/ContextProvider";
import parser from 'html-react-parser'
import AuthorBar from "../../components/article/AuthorBar";

/**
 * Displays a single Article in a full page view
 */

/**
 * TODO: Sidebar with details about the author, (wallet address or handle, picture if they have one, otherwise default)
 * TODO: Tip button on the bottom denominating ADA
 * TODO: Fix pub_date to be a 24 hour clock. (Needs to be done in Django)
 * TODO: Link to tags needs implementation
 */

const ArticleDetail = () => {
    const { darkMode } = useStateContext()
    const [article, setArticle] = useState('')
    const [authorDetails, setAuthorDetails] = useState(undefined)
    const [notLoaded, setNotLoaded] = useState(false)
    const { id } = useParams()
    let history = useNavigate()

    useEffect(() => {

        const articleDetail = async () => {
            await API.get(`/articles/article/${id}/`)
                .then((res) => {
                    setArticle(res.data)
                })
                .catch(err => {
                    console.log(err.response.status)
                    setNotLoaded(true)
                })
        }

        const authorDetail = async () => {
            await API.get(`/profile/user/${article.author}`)
            .then((res) => {
                setAuthorDetails(res.data)
            })
            .catch(err => {
                console.log(err)
            })
        }
        articleDetail()
        authorDetail()
    }, [id, article.author])

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
                {
                    notLoaded && (
                        <Navigate to={'not-found'} replace={true} />
                    )
                }
            </>
        )
    }
    else {
        return (
            <>
                <div className='fixed justify-center m-auto left-0 right-0'>
                    <Header />
                    <SidebarV2 />
                    {console.log(article)}
                    {console.log(authorDetails)}
                    <div className="hidden xl:block">
                    <AuthorBar/>
                    </div>
                </div>
                <div className={`flex justify-center ${darkMode ? 'text-white' : ''}`}>
                    <div className='pt-20 justify-center'>
                        {/* <Title text={`${article.title}`} size={'text-6xl'} /> */}
                        <div className='pr-2 sm:pr-0 pl-2 md:pl-10 flex justify-center'>
                            <img src={`${article.preview_image}`} className='rounded-lg' alt="" height={'200px'} width={'200px'} />
                        </div>
                        <div className='flex justify-center flex-row mx-auto'>
                            <div className='pt-5'>
                                <Title text={`${article.title}`} size={'text-6xl'} />
                                <div className='flex text-center justify-center mt-5 sm:hidden'>
                                    <p>Written by <Link to={`/profiles/${article.author}`}> {article.author_profile_name.slice(0, 20) + '...'} </Link></p>
                                </div>
                            </div>
                        </div>
                        <div className='mt-20' />
                        <div className='justify-center content-center text-center text-truncate [w-100px] md:[600px] lg:[750px] xl:[850px]'>
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