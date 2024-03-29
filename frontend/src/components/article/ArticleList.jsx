import React from 'react'
import { useStateContext } from '../../context/ContextProvider'
import MiniArticle from './MiniArticle'

/**
 * Maps all articles stored in the articleList into MiniArticle components. 
 * Used to display and sort articles
 * 
 * @returns {JSX.Element} - List of MiniArticle components
 */

const ArticleList = () => {

    const { articleList } = useStateContext()

    const articles = articleList.articles.map(function iterateArticles(article) {
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
                    likes={article.sentiment[0]}
                    dislikes={article.sentiment[1]}
                    percent={article.sentiment[2]}
                />
            </div>
        )
    })

    return (
        <>
            <div className='overflow-auto'>
                {articles}
            </div>
        </>
    )
}

export default ArticleList