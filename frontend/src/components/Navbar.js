import React from 'react'
import { Link } from 'components/lib'
import { useAuth } from 'context/AuthContext'
import {
  Modal,
  ModalContents,
  ModalOpenButton,
} from 'components/modal/animatedModal'
function Navbar() {
  const { user, logout } = useAuth()
  const [, setOpenModal] = React.useState('none')
  return (
    <div className="w-full h-12 bg-coolGray-900">
      <Link to="/clock">Timer</Link>

      <Link to="/datepicker">Date-pick</Link>
      <Link onClick={() => logout()}>Sign Out</Link>
      {/* <Link>hi, {user.name}</Link> */}
      <Modal>
        <ModalOpenButton>
          <Link onClick={() => setOpenModal('lfg')}>hi, {user.name}</Link>
        </ModalOpenButton>
        <ModalContents aria-label="Login form">
          <h2 className="text-6xl text-center text-pink-600">
            <strong>Let's Go!!</strong>
          </h2>
        </ModalContents>
      </Modal>
    </div>
  )
}

export default Navbar
