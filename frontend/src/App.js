import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStateContext } from './context/ContextProvider';
import { Landing, Home, Market, About, ArticleGuide, ArticleDetail, Trending, UnresolvedPath, CreateArticleV2, UsernameUserRegister, UserProfile, UsernameLogin } from './pages'

/**
* App function with routing
*/

function App() {

  const { darkMode } = useStateContext()

  return (
    <div className={`${darkMode === true ? 'dark' : ''}`}>
      <div className='dark:bg-dark-grey bg-white min-h-screen min-w-full'>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/home/' element={<Home />} />
            <Route path='/market' element={<Market />} />
            <Route path='/about' element={<About />} />
            <Route path='/articleguide' element={<ArticleGuide />} />
            <Route path='/articles/:id/' element={<ArticleDetail />} />
            <Route path='/create' element={<CreateArticleV2 />} />
            <Route path='/trending' element={<Trending />} />
            <Route path='/register' element={<UsernameUserRegister />} />
            <Route path='/login' element={<UsernameLogin />} />
            <Route path='/profiles/:id/' element={<UserProfile/>} />

            <Route path={'*'} element={<UnresolvedPath />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App;

