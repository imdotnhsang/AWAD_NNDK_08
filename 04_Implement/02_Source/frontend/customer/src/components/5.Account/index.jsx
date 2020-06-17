import React, { Component } from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
// import { Row, Col } from 'react-bootstrap'
import Template from '../common/presentational/Template.Customer'
import { clearStorage } from '../../utils/utils'
import { connect } from 'react-redux'
import Button from '../common/presentational/Button'
import Display from './container/Display.CustomerInfo'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'
import ChangePasswordModal from './presentational/Modal.ChangePassword'
import SignOutModal from './presentational/Modal.SignOut'

import { receiveBanksData } from '../../actions/banks'
import { receiveAccountData } from '../../actions/account'
import { receiveCardsData, initializedCards } from '../../actions/cards'
import { receiverDebtsData, initializedDebt } from '../../actions/debts'
import { receiverHistoryData, initializedHistory } from '../../actions/history'
import { receiveReceiversData } from '../../actions/receivers'
import {
	receiverNotificationsData,
	initializedNotification,
} from '../../actions/notifications'

import api from '../../api/api'

const Wrapper = styled.div`
	width: 100%;
	padding: 0px 60px;
	padding-bottom: 54px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`
const ButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	& > *:first-child {
		margin-bottom: 40px;
	}
	width: 190px;
	margin-top: 30px;
`
const Description = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	line-height: 16px;
`

class AccountPage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			showChangePassword: false,
			showSignOut: false,
			showSuccess: false,
			showFailure: false,
			didSignOut: false,
			failureMessage: '',
		}
		this.handleOpenChangePassword = this.handleOpenChangePassword.bind(this)
		this.handleCloseChangePassword = this.handleCloseChangePassword.bind(this)
		this.handleOpenSignOut = this.handleOpenSignOut.bind(this)
		this.handleCloseSignOut = this.handleCloseSignOut.bind(this)
		this.handleSignOut = this.handleSignOut.bind(this)
		this.handleOpenSuccess = this.handleOpenSuccess.bind(this)
		this.handleCloseSuccess = this.handleCloseSuccess.bind(this)
		this.handleOpenFailure = this.handleOpenFailure.bind(this)
		this.handleCloseFailure = this.handleCloseFailure.bind(this)
	}

	handleOpenChangePassword() {
		this.setState({
			showChangePassword: true,
		})
	}

	handleCloseChangePassword() {
		this.setState({
			showChangePassword: false,
		})
	}

	handleOpenSignOut() {
		this.setState({
			showSignOut: true,
		})
	}

	handleCloseSignOut() {
		this.setState({
			showSignOut: false,
		})
	}

	async handleSignOut() {
		const res = await api.post('/auth/logout')
		const {
			onReceiveAccountData,
			onReceiveBanksData,
			onReceiveCardsData,
			onInitializedCard,
			onReceiveDebtsData,
			onInitializedDebt,
			onReceiveHistoryData,
			onInitializedHistory,
			onReceiveReceiversData,
			onReceiveNotificationData,
			onInitializedNotification,
		} = this.props
		if (res.error) {
			const { error } = res
			this.setState({
				loading: false,
			})
			this.handleCloseSignOut()
			this.handleOpenFailure(error)
		} else {
			clearStorage()
			onReceiveAccountData({
				email: '',
				full_name: '',
				phone_number: '',
			})

			onReceiveCardsData({
				defaultAccount: {},
				savingAccounts: [],
			})
			onInitializedCard(false)

			onReceiveBanksData([])

			onReceiveDebtsData('createdByYou', [])
			onInitializedDebt('createdByYou', false)
			onReceiveDebtsData('receivedFromOthers', [])
			onInitializedDebt('receivedFromOthers', false)

			onReceiveHistoryData('receive', [])
			onInitializedHistory('receive', false)
			onReceiveHistoryData('transfer', [], false)
			onInitializedHistory('transfer', false)
			onReceiveHistoryData('debtRepaying', [], false)
			onInitializedHistory('debtRepaying', false)

			onReceiveReceiversData([])

			onReceiveNotificationData([])
			onInitializedNotification(false)

			this.setState({
				didSignOut: true,
			})
		}
	}

	handleOpenSuccess() {
		this.setState({
			showSuccess: true,
		})
	}

	handleCloseSuccess() {
		this.setState({
			showSuccess: false,
		})
	}

	handleOpenFailure(message) {
		this.setState({
			showFailure: true,
			failureMessage: message,
		})
	}

	handleCloseFailure() {
		this.setState({
			showFailure: false,
			failureMessage: '',
		})
	}

	render() {
		const {
			didSignOut,
			showChangePassword,
			showSignOut,
			showSuccess,
			showFailure,
			failureMessage,
		} = this.state
		if (didSignOut) return <Redirect to='/login' />
		return (
			<Template currentTab={5} headerName='Account'>
				<>
					<Wrapper>
						<Display />
						<ButtonWrapper>
							<Button
								fluid
								name='Change password'
								onClick={this.handleOpenChangePassword}
								onSuccess={this.handleOpenSuccess}
								onFailure={this.handleOpenFailure}
							/>
							<Button
								fluid
								name='Sign out'
								secondary
								onClick={this.handleOpenSignOut}
							/>
						</ButtonWrapper>
					</Wrapper>
					{showChangePassword && (
						<ChangePasswordModal
							onClose={this.handleCloseChangePassword}
							onSuccess={this.handleOpenSuccess}
							onFailure={this.handleOpenFailure}
						/>
					)}
					{showSignOut && (
						<SignOutModal
							onClose={this.handleCloseSignOut}
							onSignOut={this.handleSignOut}
						/>
					)}
					{showSuccess && (
						<SuccessModal onClose={this.handleCloseSuccess}>
							<Description>
								You have successfully changed your password!
							</Description>
						</SuccessModal>
					)}
					{showFailure && (
						<FailureModal onClose={this.handleCloseFailure}>
							<Description>
								Something wrong has happened that your action was canceled
								<br />
								Error message: {failureMessage}
							</Description>
						</FailureModal>
					)}
				</>
			</Template>
		)
	}
}
const mapDispatchToProps = (dispatch) => ({
	onReceiveAccountData: (data) => {
		dispatch(receiveAccountData(data))
	},
	onReceiveBanksData: (data) => {
		dispatch(receiveBanksData(data))
	},
	onReceiveCardsData: (data) => {
		dispatch(receiveCardsData(data))
	},
	onInitializedCard: (status) => {
		dispatch(initializedCards(status))
	},
	onReceiveDebtsData: (category, data) => {
		dispatch(receiverDebtsData(category, data))
	},
	onInitializedDebt: (category, status) => {
		dispatch(initializedDebt(category, status))
	},
	onReceiveHistoryData: (category, data) => {
		dispatch(receiverHistoryData(category, data))
	},
	onInitializedHistory: (category, status) => {
		dispatch(initializedHistory(category, status))
	},
	onReceiveReceiversData: (data) => {
		dispatch(receiveReceiversData(data))
	},
	onReceiveNotificationData: (data) => {
		dispatch(receiverNotificationsData(data))
	},
	onInitializedNotification: (status) => {
		dispatch(initializedNotification(status))
	},
})

export default connect(null, mapDispatchToProps)(AccountPage)
