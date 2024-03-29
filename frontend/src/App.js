import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useStateContext } from './context/ContextProvider';
import { 
  Landing, 
  Home, 
  Market, 
  About, 
  ArticleGuide, 
  ArticleDetail, 
  Trending, 
  UnresolvedPath, 
  CreateArticleV2, 
  UsernameUserRegister, 
  UserProfile, 
  UsernameLogin, // Deprecated 
  EditProfile,
  Login,
  TagNavigation,
  CommentThread,
  AllNotifications,
  Search,
  WalletInstructions
} from './pages'

/**
* SPA with routing defined
*/
function App() {

  const { darkMode } = useStateContext()

  return (
    <div className={`${darkMode === true ? 'dark' : ''}`}>
      <div className='dark:bg-dark-grey bg-white min-h-screen min-w-full'>
        <Router>
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
            <Route path='/login' element={<Login />} />
            <Route path='/profiles/:id/' element={<UserProfile/>} />
            <Route path='/profiles/edit' element={<EditProfile/>} />
            <Route path='/articles/tags/:tag/' element={<TagNavigation/>}/>
            <Route path='/articles/comments/:id' element={<CommentThread/>}/>
            <Route path='/profile/notifications' element={<AllNotifications/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path={'/walletinstructions'} element={<WalletInstructions/>}/>
            <Route path={'*'} element={<UnresolvedPath />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App;

