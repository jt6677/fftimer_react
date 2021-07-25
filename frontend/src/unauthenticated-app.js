/** @jsxImportSource @emotion/react */
import React from 'react'
import '@reach/dialog/styles.css'
import { Signup } from 'components/Signup.js'
import { Login } from 'components/Login.js'
import { SecondaryButton, PrimaryButton, Fallfowardpage } from 'components/lib'
import {
  Modal,
  ModalContents,
  ModalOpenButton,
} from 'components/modal/animatedModal'

function UnauthenticatedApp() {
  const [, setOpenModal] = React.useState('none')
  // const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-blueGray-800">
      <div className="flex flex-col items-center justify-center pt-32 text-white ">
        <Fallfowardpage className="relative" />
        <div className="flex flex-col w-1/5 mt-4 space-y-5 ">
          <Modal>
            <ModalOpenButton>
              <PrimaryButton onClick={() => setOpenModal('login')}>
                Login
              </PrimaryButton>
            </ModalOpenButton>
            <ModalContents aria-label="Login form">
              <Login />
            </ModalContents>
          </Modal>

          <Modal>
            <ModalOpenButton>
              <SecondaryButton onClick={() => setOpenModal('signup')}>
                Sign up
              </SecondaryButton>
            </ModalOpenButton>
            <ModalContents aria-label="Sign up form">
              <Signup />
            </ModalContents>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default UnauthenticatedApp
