import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {

    const getInitialTheme = () => {
        if (typeof window !== 'undefined' &&
            window.localStorage) {

            const storedPrefs =
                window.localStorage.getItem('color-theme')
            if (typeof storedPrefs === 'string') {
                return storedPrefs
            }

            const userMedia =
                window.matchMedia('(prefers-color-scheme: dark)')
            if (userMedia.matches) {
                return true
            }
        }
        return false
    }

    const [darkMode, setDarkMode] = useState(getInitialTheme())
    const [showAlert, setShowAlert] = useState(false);
    const [screenSize, setScreenSize] = useState(undefined);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(null)
    const [article, setArticle] = useState(null)
    const [articleList, setArticleList] = useState([])
    const [articleLoading, setArticleLoading] = useState(true)
    const [sortBy, setSortBy] = useState('popular')
    const [openDropdown, setOpenDropdown] = useState(false)

    return (
        <StateContext.Provider
            value={{
                darkMode,
                setDarkMode,
                showAlert,
                setShowAlert,
                screenSize,
                setScreenSize,
                sidebarOpen,
                setSidebarOpen,
                currentFrame,
                setCurrentFrame,
                article,
                setArticle,
                articleList,
                setArticleList,
                articleLoading,
                setArticleLoading,
                sortBy,
                setSortBy,
                openDropdown,
                setOpenDropdown,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);