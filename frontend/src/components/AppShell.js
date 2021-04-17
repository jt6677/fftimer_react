import React from 'react'
import Footer from '../components/Footer/Footer'
import Navbar from './Navbar'
const AppShell = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default AppShell
