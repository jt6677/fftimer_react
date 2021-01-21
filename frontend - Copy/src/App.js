import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css'
// import Navbar from './components/Navbar/Navbar'
import CountdownClock from './components/CountdownClock/CountdownClock'
// import SigninSignup from './components/Auth/SigninSignup'
// import Signin from './components/Auth/Signin'
// import Signup from './components/Auth/Signup'
// import Signout from './components/Auth/Signout'
// import DatePick from './components/DatePick/DatePick.js'
// import SessionShow from './components/SessionShow/SessionShow'
// import history from './history'

// const UnauthenticatedRoutes = () => (
//   <Switch>
//     <Route path="/signin">
//       <Signin />
//     </Route>
//     <Route path="/signup">
//       <Signup />
//     </Route>
//     <Route exact path="/">
//       <SigninSignup />
//     </Route>
//   </Switch>
// )

const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      <Switch>
        <Route path="/clock" exact component={CountdownClock} />
        {/* <UnauthenticatedRoutes /> */}
      </Switch>
    </Router>
  )
}

export default App
