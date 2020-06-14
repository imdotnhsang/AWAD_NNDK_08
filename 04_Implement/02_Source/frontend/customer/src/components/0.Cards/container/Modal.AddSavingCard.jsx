import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
// import Select from '../../common/container/Select.Term'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
import api from '../../../api/api'
import { addAReceiver } from '../../../actions/receivers'
import { MINIMUM_BALANCE } from '../../../constants/constants'

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
class AddDepositModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			depositAmount: 10000000,
			error: '',
			loading: false,
		}
		this.handleDepositAmount = this.handleDepositAmount.bind(this)
		this.handleNickname = this.handleNickname.bind(this)
		this.handleValidateAccountID = this.handleValidateAccountID.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
	}

	handleDepositAmount(event) {
		const value = parseInt(event.target.value.replace(/\D/g, '') || 0, 10)
		this.setState({
			error: '',
			depositAmount: value,
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
		const { accountID, bankID } = this.state
		const data = {
			accountId: accountID,
		}
		this.setState({
			accountIDLoading: true,
			accountIDError: '',
		})
		let res = {}
		if (bankID === 'EIGHT.Bank') {
			res = await api.get('/transactions/receiver-internal-banking', data)
		} else {
			//  API get full name interbank
			// data.bankID= ...
			// res = await api.get('...', data)
		}
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
		// const { onClose, onSuccess, onFailure } = this.props
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
			const { data: newData } = res
			onAddAReceiver(newData)
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
		}
	}

	render() {
		const { loading, depositAmount } = this.state
		const {
			onClose,
			// bankLoading,
		} = this.props
		return (
			<Template
				name='Add deposit'
				onClose={onClose}
				loading={false}
				disabled={loading}
			>
				<>
					<Text>Enter the information for your new deposit</Text>
					{/* <InputWrapper>
						<Select
							error={error}
							value={bankID}
							onChange={this.handleBankID}
							disabled={loading || accountIDLoading}
						/>
					</InputWrapper> */}
					<InputWrapper>
						<Input
							label='Deposit amount'
							placeholder='Enter the deposit amount'
							value={depositAmount}
							onChange={this.handleDepositAmount}
						/>
					</InputWrapper>
					<ButtonWrapper>
						<Button
							name='Create new deposit'
							fluid
							onClick={this.handleSubmit}
							loading={loading}
							disabled={loading}
						/>
					</ButtonWrapper>
				</>
			</Template>
		)
	}
}

AddDepositModal.defaultProps = {
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	//
	bankLoading: false,
	onAddAReceiver: (f) => f,
}
AddDepositModal.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(AddDepositModal)
