import React, { Component } from 'react'
import { Sidebar, Header, Title } from '../components'

/**
 * Page for displaying all posts
 * TODO: implement a dropdown so the user can sort the posts in different ways (new/popular etc)
 */

const AllArticles = () => {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         activeArticle: {
    //             title: "",
    //             tags: "",
    //             votes: "",
    //         },
    //         postList: []
    //     };
    // }

    // async componentDidMount() {
    //     try {
    //         const res = await fetch('http://localhost:8000/posts')
    //         const postList = await res.json()

    //         this.setState({
    //             postList
    //         })
    //     } catch (e) {
    //     }
    // }

    // render() {
    //     return (
    //         <>
    //             <div>
    //                 <Sidebar />
    //                 <div>
    //                     <Header />
    //                 </div>
    //                 <div className='flex justify-center'>
    //                     <Title text={'sections'} />
    //                 </div>
    //                 <div className='flex pt-14' />
    //                 <div className='grid columns-1 content-center justify-center'>
    //                     <h1>Articles</h1>
    //                 </div>
    //             </div>
    //         </>
    //     )
    // }
}
export default AllArticles