import React from 'react'
import { TrendBar, Header, SidebarV2, Title } from '../../components'

/**
 * Page to contain information for user to create a wallet
 */
const WalletInstructions = () => {
    return (
        <>
            <TrendBar />
            <Header page={'home'} />
            <SidebarV2 />
            <div>
                <div className='pt-20'>
                    <Title text={'Wallet Instructions'} size={'text-6xl'} hover={true} />
                </div>
            </div>
        </>
    )
}

export default WalletInstructions