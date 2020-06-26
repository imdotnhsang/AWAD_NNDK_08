import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Cards from './components/0.Cards'
import Receivers from './components/1.Receivers'
import Transfer from './components/2.Transfer'
import Debts from './components/3.Debts'
import History from './components/4.History'
import Account from './components/5.Account'
import PrivateRoute from './PrivateRoute'

function App(theme) {
	return (
		<Router>
			<Switch>
				<PrivateRoute exact path='/' component={Cards} />
				<PrivateRoute exact path='/cards' component={Cards} theme={theme} />
				<PrivateRoute exact path='/receivers' component={Receivers} />
				<PrivateRoute exact path='/transfer' component={Transfer} />
				<PrivateRoute exact path='/debts' component={Debts} />
				<PrivateRoute exact path='/history' component={History} />
				<PrivateRoute exact path='/account' component={Account} />
				<Route exact path='/forgot-password' component={ForgotPassword} />
				<Route exact path='/reset-password' component={ResetPassword} />
				<Route exact path='/login' component={SignIn} />
			</Switch>
		</Router>
	)
}

export default App
