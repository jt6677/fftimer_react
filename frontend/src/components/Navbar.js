import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from 'context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="navbar">
        <Link className="link text-link " to="/signinandsignup">
          New Account
        </Link>
        <Link className="link text-link " to="/signin">
          Sign In
        </Link>
      </div>
    )
  } else {
    return (
      <div className="navbar">
        <Link className="link text-link" to="/clock">
          Timer
        </Link>
        <Link className="link text-link" to="/datepicker">
          Date-pick
        </Link>
        <Link
          className="link text-link "
          onClick={() => {
            logout()
          }}
          to="/signinandsignup"
        >
          Sign Out
        </Link>
        <Link className="link text-link ">hi, {user}</Link>
      </div>
    )
  }
}

export default Navbar
