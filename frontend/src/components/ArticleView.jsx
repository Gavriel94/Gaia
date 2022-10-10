import React from 'react'
import { useStateContext } from '../context/ContextProvider'
import MiniArticle from './MiniArticle'

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