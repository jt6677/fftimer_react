import React from 'react'
import { Link } from 'components/lib'
import { useAuth } from 'context/AuthContext'
import {
  Modal,
  ModalContents,
  ModalOpenButton,
} from 'components/modal/animatedModal'
import { UploadFiles } from './uploadFiles'
function Navbar() {
  const { user, logout } = useAuth()
  // const [, setOpenModal] = React.useState('none')
  return (
    <div className="w-full h-12 bg-coolGray-900">
      <Link to="/clock">Timer</Link>

      <Link to="/datepicker">Date-pick</Link>
      <Link onClick={() => logout()}>Sign Out</Link>
      {/* <Link>hi, {user.name}</Link> */}
      <Modal>
        <ModalOpenButton>
          <Link>hi, {user.name}</Link>
        </ModalOpenButton>
        <ModalContents aria-label="upload form">
          <UploadFiles />
        </ModalContents>
      </Modal>
    </div>
  )
}

export default Navbar
