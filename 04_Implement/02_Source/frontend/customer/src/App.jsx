import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Cards from './components/Cards'
import Receivers from './components/Receivers'
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute
          exact
          path="/"
          component={Cards}
        />
        <PrivateRoute
          exact
          path="/cards"
          component={Cards}
        />
        <PrivateRoute
          exact
          path="/receivers"
          component={Receivers}
        />
        <Route
          exact
          path="/forgot-password"
          component={ForgotPassword}
        />
        <Route
          exact
          path="/reset-password"
          component={ResetPassword}
        />
        <Route
          exact
          path="/login"
          component={SignIn}
        />
      </Switch>
    </Router>
  )
}

export default App
