/** @jsxImportSource @emotion/react */

import React, { useRef } from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { CircleButton } from '../lib'
import '@reach/dialog/styles.css'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { useTransition, animated } from 'react-spring'
animated.DialogOverlay = animated(DialogOverlay)
animated.DialogContent = animated(DialogContent)

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach((fn) => fn && fn(...args))

const ModalContext = React.createContext()

function Modal(props) {
  const [isOpen, setIsOpen] = React.useState(false)

  return <ModalContext.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

function ModalOpenButton({ children: child }) {
  const [, setIsOpen] = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

function ModalContents({ title, children, ...props }) {
  const [isOpen, setIsOpen] = React.useContext(ModalContext)
  const rootRef = useRef(null)
  if (!rootRef.current) {
    rootRef.current = document.getElementById('root')
  }

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, xyz: [0, -30, 0], blur: 0 },
    enter: { opacity: 1, xyz: [0, 0, 0], blur: 8 },
    leave: { opacity: 0, xyz: [0, 30, 0], blur: 0 },
    delay: 200,
    onChange: (blur) => {
      if (isOpen) rootRef.current.style.filter = `blur(${20}px)`
      if (!isOpen) rootRef.current.style.filter = `blur(${0}px)`
    },
  })
  return transitions(
    ({ opacity, xyz }, item) =>
      item && (
        <animated.DialogOverlay
          style={{ opacity }}
          // isOpen={isOpen}
          onDismiss={() => setIsOpen(false)}
        >
          <animated.DialogContent
            style={{
              transform: xyz.to(
                (x, y, z) => `translate3d(${x}px, ${y}px, ${z}px)`
              ),
              backgroundColor: '#1E293B',
              // top: '70%',
              margin: '22vh  auto',
              maxWidth: '450px',
            }}
            className="rounded-2xl"
            {...props}
          >
            <div className="flex justify-end ">
              <ModalDismissButton>
                <CircleButton>
                  <VisuallyHidden>Close</VisuallyHidden>
                  <span aria-hidden>×</span>
                </CircleButton>
              </ModalDismissButton>
            </div>
            <div className="mt-2">{children}</div>
          </animated.DialogContent>
        </animated.DialogOverlay>
      )
  )
}

export { Modal, ModalDismissButton, ModalOpenButton, ModalContents }
