import React from 'react'
import API from '../API'
import { Button } from '../components'

/**
 * 
 * @returns Button to destroy Knox token
 */

const LogoutButton = () => {

    const handleLogout = () => {
        try {
            API.post('/auth/logout').then((res) => console.log(res))
        } catch(err) {
            console.log(err)
        }
    }

  return (
    <Button label={'Logout'} func={handleLogout}/>
  )
}

export default LogoutButton