import React from 'react'
import { useStateContext } from '../../context/ContextProvider'
import MiniArticle from './MiniArticle'

/**
 * Maps all articles stored in the articleList into MiniArticle components. 
 * Used to display and sort articles
 * 
 * @returns {JSX.Element} - List of MiniArticle components
 */

const ArticleView = () => {
    const { articleList, sortBy } = useStateContext()

    const oldestFirst = articleList.map(function iterateArticles(article) {
        return (
            <div key={article.id} className='flex justify-center'>
                <MiniArticle
                    id={article.id}
                    title={article.title}
                    content={article.content}
                    tags={article.tags}
                    image={article.preview_image}
                />
            </div>
        )
    })

    return (
        <div className='overflow-auto'>
            {sortBy === 'new' ? oldestFirst.reverse() : oldestFirst}
        </div>
    )
}

export default ArticleView