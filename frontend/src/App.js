import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStateContext } from './context/ContextProvider';
import { Landing, Home, Market, About, ArticleGuide, ArticleDetail, CreateArticle, UnresolvedPath } from './pages'

// /**
//  * App function with routing
//  */

function App() {

  const { darkMode } = useStateContext()

  return (
    <div className={`${darkMode === true ? 'dark' : ''}`}>
      <div className='dark:bg-dark-grey min-h-screen'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/home/' element={<Home />} />
            <Route path='/market' element={<Market />} />
            <Route path='/about' element={<About />} />
            <Route path='/articleguide' element={<ArticleGuide />} />
            <Route path='/articles/:id/' element={<ArticleDetail />} />
            <Route path='/create' element={<CreateArticle />} />
            <Route path={'*'} element={<UnresolvedPath />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App;

