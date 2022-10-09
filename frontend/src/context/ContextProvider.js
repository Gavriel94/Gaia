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
    const [screenSize, setScreenSize] = useState(undefined);
    const [article, setArticle] = useState(null)
    const [articleList, setArticleList] = useState([])
    const [articleLoading, setArticleLoading] = useState(true)
    const [sortBy, setSortBy] = useState('popular')

    return (
        <StateContext.Provider
            value={{
                darkMode, setDarkMode,
                screenSize, setScreenSize,
                article, setArticle,
                articleList, setArticleList,
                articleLoading, setArticleLoading,
                sortBy, setSortBy,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);