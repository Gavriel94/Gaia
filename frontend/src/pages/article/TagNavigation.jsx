import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SidebarV2, Header, Title, ArticleLoading, MiniArticle } from '../../components'
import { useStateContext } from '../../context/ContextProvider'
import API from '../../API'

/**
 * Provides an interface for the user to browse articles with the same tag
 * Displays MiniArticle components complete with links to each article
 * 
 * @returns {JSX.Element} TagNavigation page
 */

const TagNavigation = () => {
    const { refreshing } = useStateContext()

    const { tag } = useParams()
    const [articleList, setArticleList] = useState([])

    useEffect(() => {
        const getTaggedArticles = async () => {
            await API.get(`/articles/tagged/${tag}`)
                .then((res) => {
                    var tempList = []
                    tempList.push(...res.data)
                    setArticleList(tempList)
                    console.log('tempList', tempList)
                    console.log(articleList)
                }).catch(console.err)
        }
        getTaggedArticles()
    }, [tag])

    const articles = articleList?.map(function iterateArticles(article) {
        return (
            <div key={article.id} className='flex justify-center'>
                <MiniArticle
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    tags={article.tags}
                    image={article.preview_image}
                    imageHeight={'150px'}
                    imageWidth={'150px'}
                />
            </div>
        )
    })


    return (
        <>
            <Header />
            <SidebarV2 />
            <div className='flex justify-center'>
                <div className='pt-20'>
                    <Title text={`${tag}`} size={'text-6xl'} hover={true} />
                    <div className={`${refreshing ? 'hidden' : 'mt-10 overflow-auto pb-20 sm:pb-10'}`}>
                        {articles.reverse()}
                    </div>
                    <div className={`${refreshing ? 'block mt-10 overflow-auto pb-20 sm:pb-10' : 'hidden'}`}>
                        <ArticleLoading />
                    </div>
                </div>
            </div>
        </>
    )
}

export default TagNavigation