import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Customer from './components/Customer'
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute
          exact
          path="/"
          component={Customer}
        />
        <Route
          path="/forgot-password"
          component={ForgotPassword}
        />
        <Route
          path="/reset-password"
          component={ResetPassword}
        />
        <Route
          path="/login"
          component={SignIn}
        />
      </Switch>
    </Router>
  )
}

export default App
