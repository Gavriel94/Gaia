import React, { useEffect } from 'react'
import placeholder from '../assets/fpngs/placeholder.png'
import { BsSun, BsMoon } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import { Button, FlipCard } from '../components'
import { useStateContext } from '../context/ContextProvider'
import frameZero from '../assets/fpngs/animated/frame0.png'
import firstFrame from '../assets/fpngs/animated/frame1.png'
import secondFrame from '../assets/fpngs/animated/frame2.png'
import thirdFrame from '../assets/fpngs/animated/frame3.png'
import fourthFrame from '../assets/fpngs/animated/frame4.png'
import fifthFrame from '../assets/fpngs/animated/frame5.png'
import sixthFrame from '../assets/fpngs/animated/frame6.png'
/**
 * Landing page for instant information for the user to see what the project is about 
 * TODO: change the Flipcards into animations and make the page scrollable with 'enter app' on a fixed header above
 */

const Landing = () => {
    const { darkMode, setDarkMode, currentFrame, setCurrentFrame } = useStateContext();
    const frames = [frameZero, firstFrame, secondFrame, thirdFrame, fourthFrame, fifthFrame, sixthFrame, sixthFrame, sixthFrame, fifthFrame, fourthFrame, thirdFrame, secondFrame, firstFrame]

    let timeInMs = 100

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentFrame === frames.length - 1) {
                setCurrentFrame(0)
            }
            else {
                setCurrentFrame(currentFrame + 1)
            }
        }, timeInMs)
        return () => clearInterval(interval)
    },)

    return (
        <div className='dark:bg-dark-gray'>
            <div className='flex justify-end top-5 h-16 px-10'>
                <div className='py-5 px-2'>
                    <Button
                        title={'mode-toggle'}
                        func={() => {
                            setDarkMode(!darkMode);
                        }}
                        icon={darkMode === false ? <BsSun /> : <BsMoon />}
                    />
                </div>
            </div>
            <div className='absolute mt-40 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <img src={frames[currentFrame]} alt={'animated icon'} className='w-[400px]' />
            </div>
            <div className='mt-100 justify-center'>
                <div className='container mx-auto p-2 grid grid-cols-2 gap-y-10 content-evenly'>
                    <div className='flex justify-center'>
                        <FlipCard
                            image={placeholder}
                            alt={'Card with an image of a placeholder and text describing placeholder'}
                            header={'Community Gauge'}
                            text={'Sentiment is displayed on each Drop'}
                            backText={
                                <>
                                    <p>Readers can vote on how they feel about the content.</p>
                                    <p>This combats misinformation and allows readers to get a quick glance into how the community feels overall.</p>
                                </>
                            }
                        />
                    </div>
                    <div className='col-span-1 flex justify-center'>
                        <FlipCard
                            image={placeholder}
                            header={'Self Sufficient'}
                            text={'Drops are by the community, for the community'}
                            alt={'Card with an image of a placeholder and text describing placeholder'}
                            backText={
                                <>
                                    <p>Anyone can create a Drop containing the content they desire.</p>
                                    <p>Drop articles, music, videos and more.</p>
                                    <p> Develop a community in a Section</p>
                                </>
                            }
                        />
                    </div>
                    <div className='col-span-1 flex justify-center'>
                        <FlipCard
                            image={placeholder}
                            header={'Explore'}
                            text={'Stay Informed'}
                            backText={
                                <>
                                    <p>Gaia is no microblogging platform. Find real, in-depth information here.</p>
                                    <p>This is a decentralised news source where you can find what you need to find. No biases, no algorithms dictating how content is displayed.</p>
                                </>
                            }
                        />
                    </div>
                    <div className='col-span-1 flex justify-center'>
                        <FlipCard
                            image={placeholder}
                            header={'One Stop Shop'}
                            text={'Discover music, videos, in-depth articles and more'}
                            backText={
                                <>
                                    <p>Information is split into Sections.</p>
                                    <p>Each Section contains Drops which can be any kind of content.</p>
                                </>
                            }
                        />
                    </div>
                </div>
            </div>

            <div className='flex justify-center p-6 dark:bg-dark-gray'>
                <NavLink to='/home'>
                    <Button title={'Enter App'} icon={'Enter App'} />
                </NavLink>
            </div>
        </div>
    )
}

export default Landing