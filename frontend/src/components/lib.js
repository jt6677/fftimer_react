/** @jsxImportSource @emotion/react */
import tw, { styled } from 'twin.macro'
// import styled from '@emotion/styled/macro'

import { keyframes } from '@emotion/react'
import { FaSpinner } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'
import logo from 'assets/circle250.png'
import * as colors from 'styles/colors'
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})
const Spinner = styled(FaSpinner)({
  animation: `${spin} 1s linear infinite`,
})
Spinner.defaultProps = {
  'aria-label': 'loading',
}

const PrimaryButton = tw.button`
  p-3 text-xl font-bold text-center text-white uppercase transition duration-300 bg-red-600 border-b-4 border-red-700 rounded hover:bg-red-500 hover:text-red-100
`
const SecondaryButton = tw.button`
p-3 text-xl font-bold text-center text-white uppercase transition duration-300 border-2 border-gray-100 rounded hover:bg-gray-700 hover:text-gray-200 
`

// const InputwithIcon = styled.div`
//   display: flex;
//   vertical-align: middle;
//   height: 3.8rem;
//   margin-bottom: 1rem;
//   // //
// `
const InputwithIcon = tw.div`
flex align-middle`

// const Label = styled.div`
//   background-color: #363b41;
//   border-radius: 4px 0 0 4px;
//   height: 3.8rem;
//   width: 3.8rem;
//   display: flex;
//   vertical-align: center;
//   justify-content: center;
// `
const Label = tw.div`
bg-coolGray-700 rounded-l p-3`
const Input = tw.input` bg-coolGray-700 rounded-r outline-none text-white w-full hover:bg-coolGray-600
`
// const Input = styled.input`
//   background-color: #3b4148;
//   border: none;
//   border-radius: 4px;
//   color: #fff;
//   width: 100%;
//   height: 3.8rem;

//   &:hover,
//   &:focus {
//     background-color: #434a52;
//     outline: none;
//   }
// `

const Link = tw(
  RouterLink
)`inline-block  py-2 px-3 text-white text-lg hover:bg-red-600 rounded`

const CircleButton = tw.button`w-8 h-8 flex bg-coolGray-500 rounded-full items-center justify-center text-coolGray-100 hover:bg-coolGray-400`

function Fallfowardpage() {
  return (
    <div>
      <div>
        <img className="logo" src={logo} alt="FallForward" />
        <h1 className="mt-6 text-xl">Fall Forward</h1>
      </div>
      <div className="pl-3 mt-2 mb-2 space-y-2">
        <p>"Drop By Drop,</p>
        <p>"The Bucket Will Be Filled."</p>
      </div>
    </div>
  )
}
function FullPageSpinner() {
  return (
    <div
      css={{
        fontSize: '4em',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spinner />
    </div>
  )
}

const errorMessageVariants = {
  stacked: { display: 'block' },
  inline: { display: 'inline-block' },
}

function ErrorMessage({ error, variant = 'stacked', ...props }) {
  return (
    <div
      role="alert"
      css={[{ color: colors.danger }, errorMessageVariants[variant]]}
      {...props}
    >
      <span>There was an error: </span>
      <pre
        css={[
          { whiteSpace: 'break-spaces', margin: '0', marginBottom: -5 },
          errorMessageVariants[variant],
        ]}
      >
        {error.message}
      </pre>
    </div>
  )
}

function FullPageErrorFallback({ error }) {
  return (
    <div
      role="alert"
      css={{
        color: colors.danger,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <p>Uh oh... There's a problem. Try refreshing the app.</p>
      <pre>{error.message}</pre>
    </div>
  )
}
export {
  FullPageSpinner,
  PrimaryButton,
  Fallfowardpage,
  SecondaryButton,
  Input,
  CircleButton,
  InputwithIcon,
  Label,
  Spinner,
  Link,
  FullPageErrorFallback,
  ErrorMessage,
}
