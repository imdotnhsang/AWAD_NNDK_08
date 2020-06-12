import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Select from '../../common/container/Select.Bank'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
import api from '../../../api/api'
import { addAReceiver } from '../../../actions/receivers'

const InputWrapper = styled.div`
	width: 100%;
	margin-bottom: 24px;
`
const ButtonWrapper = styled.div`
	width: 100%;
	margin-top: 36px;
`
const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	margin-bottom: 24px;
`
class AddReceiverModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			fullName: '',
			bankID: '',
			bankName: '',
			accountID: '',
			nickname: '',
			error: '',
			loading: false,
			//
			accountIDValid: false,
			accountIDLoading: false,
			accountIDError: '',
		}
		this.handleBankID = this.handleBankID.bind(this)
		this.handleAccountID = this.handleAccountID.bind(this)
		this.handleNickname = this.handleNickname.bind(this)
		this.handleValidateAccountID = this.handleValidateAccountID.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
	}

	handleBankID(value, valueName) {
		// console.log(valueName)
		this.setState({
			bankID: value,
			bankName: valueName,
			error: '',
		})
	}

	handleAccountID(event) {
		this.setState({
			accountID: event.target.value,
			error: '',
			accountIDError: '',
		})
	}

	handleNickname(event) {
		this.setState({
			nickname: event.target.value,
			error: '',
		})
	}

	async handleValidateAccountID() {
		this.setState({
			accountIDValid: false,
			nickname: '',
		})
		const { accountID } = this.state
		// if (accountID.length !== 14) {
		//   this.setState({
		//     accountIDError: 'Invalid value',
		//   })
		//   return
		// }
		// Create new receiver
		// const data = {
		//   bankID, accountID,
		// }
		const data = {
			accountId: accountID,
		}
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// }
		// console.log(data)
		this.setState({
			accountIDLoading: true,
			accountIDError: '',
		})
		const res = await api.get('/transactions/receiver-internal-banking', data)
		if (res.error) {
			const { error } = res
			this.setState({
				accountIDError: error,
				accountIDValid: false,
				accountIDLoading: false,
			})
		} else {
			const { full_name: accountName } = res
			if (accountName) {
				this.setState({
					accountIDValid: true,
					accountIDLoading: false,
					fullName: accountName,
					nickname: accountName,
				})
			} else {
				this.setState({
					accountIDValid: false,
					accountIDError: 'Invalid card number',
					accountIDLoading: false,
				})
			}
		}
	}

	async handleSubmit() {
		const {
			bankID,
			bankName,
			fullName,
			accountID,
			nickname,
			accountIDValid,
		} = this.state
		const { onClose, onSuccess, onFailure, onAddAReceiver } = this.props
		if (!bankID || !accountID || !nickname) {
			this.setState({
				error: 'Required field',
			})
			return
		}
		if (!accountIDValid) {
			this.setState({
				accountIDError: 'Invalid value',
			})
			return
		}
		// Validate account ID
		const data = {
			bankName,
			fullName,
			bankId: bankID,
			accountId: accountID,
			nickname,
		}
		// console.log(data)
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// }
		this.setState({
			loading: true,
			error: '',
			accountIDError: '',
		})
		const res = await api.post('/receivers/add-receiver', data)
		if (res.error) {
			const { error } = res
			this.setState({
				loading: false,
			})
			onClose()
			onFailure(error)
		} else {
			this.setState({
				error: '',
				loading: false,
			})
			onClose()
			onSuccess('You have successfully added a new receiver!')
			// const { data: newData } = res
			// onAddAReceiver(newData)
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
		}
	}

	render() {
		const {
			bankID,
			// bankName,
			accountID,
			nickname,
			error,
			loading,
			accountIDValid,
			accountIDLoading,
			accountIDError,
		} = this.state
		const {
			onClose,
			//
			bankLoading,
		} = this.props
		return (
			<Template
				name='Add receiver'
				onClose={onClose}
				loading={bankLoading}
				disabled={loading}
			>
				<>
					<Text>Enter the infomation for your new contact</Text>
					<InputWrapper>
						<Select
							error={error}
							value={bankID}
							onChange={this.handleBankID}
							disabled={loading || accountIDLoading}
						/>
					</InputWrapper>
					<InputWrapper>
						<Input
							label='Card number'
							placeholder="Enter the receiver's card number"
							value={accountID}
							onChange={this.handleAccountID}
							disabled={loading || bankID === ''}
							error={error || accountIDError}
							loading={accountIDLoading}
							onBlur={this.handleValidateAccountID}
						/>
					</InputWrapper>
					<Input
						label='Nickname'
						placeholder="Enter the receiver's nickname"
						value={nickname}
						error={error}
						onChange={this.handleNickname}
						disabled={loading || !accountIDValid}
						onKeyDown={this.handleEnterKey}
					/>
					<ButtonWrapper>
						<Button
							name='Create new receiver'
							fluid
							onClick={this.handleSubmit}
							loading={loading}
							disabled={loading || accountIDLoading}
						/>
					</ButtonWrapper>
				</>
			</Template>
		)
	}
}

AddReceiverModal.defaultProps = {
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	//
	bankLoading: false,
	onAddAReceiver: (f) => f,
}
AddReceiverModal.propTypes = {
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	//
	bankLoading: PropTypes.bool,
	onAddAReceiver: PropTypes.func,
}
const mapStateToProps = (state) => ({
	bankLoading: state.banks.loading,
})
const mapDispatchToProps = (dispatch) => ({
	onAddAReceiver: (data) => dispatch(addAReceiver(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AddReceiverModal)
