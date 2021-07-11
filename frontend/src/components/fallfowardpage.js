import React from 'react'
import IntotheWild from 'assets/circle250.png'

const renderWisdom = (showWisdom) => {
  if (showWisdom) {
    return (
      <div className="mt-2 mb-2 space-y-2">
        <p>"Drop By Drop,</p>
        <p> "The Bucket Will Be Filled."</p>
      </div>
    )
  }
}
function Fallfowardpage({ showWisdom }) {
  return (
    <div>
      <div>
        <div>
          <img src={IntotheWild} alt="FallForward" />
        </div>
        <h1 className="mt-6 text-xl">Fall Forward</h1>
      </div>
      {renderWisdom(showWisdom)}
    </div>
  )
}

export default Fallfowardpage
