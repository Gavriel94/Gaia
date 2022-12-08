import React, { useEffect, useState } from 'react'
import { Header, SidebarV2, Title, MiniArticle } from '../../components'
import API from '../../API'
/**
 * Page which allows users to see trending topics if they are not using a screen large enough to see the TrendBar
 * Shows 8 Articles instead of the 4 you can see with the TrendBar
 * 
 * @returns {JSX.Element} - Trending topics
 */

const Trending = () => {
    const [mostPopular, setMostPopular] = useState([])

    useEffect(() => {
        const getTrending = async () => {
            await API.get('/articles/trending/page')
                .then((res) => {
                    setMostPopular(res.data)
                })
                .catch(err => {
                    console.log(err)
                })
                console.log(mostPopular)
        }

        getTrending()
    }, [])

    const articles = mostPopular?.map(function iterateArticles(article) {
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
                sentiment={article.sentiment}
            />
        </div>
        )
    })

  return (
    <>
        <div className='fixed justify-center m-auto left-0 right-0 '>
            <Header />
            <SidebarV2 />
        </div>
        <div className='flex justify-center'>
            <div className='pt-20'>
                <Title text={'trending'} size={'text-6xl'} hover={true}/>
                <div className='mt-20 overflow-auto '>
                {articles}
                {console.log(mostPopular)}
                </div>
            </div>
        </div>
</>
  )
}

export default Trending