import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Cards from './components/0.Cards'
import Receivers from './components/1.Receivers'
import Transfer from './components/2.Transfer'
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
        <PrivateRoute
          exact
          path="/transfer"
          component={Transfer}
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
