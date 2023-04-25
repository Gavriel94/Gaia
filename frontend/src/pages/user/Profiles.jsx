import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Hosted in the Sidebar component 
 * Redirects user to the login page if they are not logged in and click the Profile button
 * Navigator to register page
 */

const Profiles = () => {
  return (
    <Navigate to={`/register`} replace={true} />
  )
}

export default Profiles