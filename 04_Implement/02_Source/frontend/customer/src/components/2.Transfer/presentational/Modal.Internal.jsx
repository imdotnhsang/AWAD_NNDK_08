import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'
// import Step1 from '../container/Content.Step1'
import Step2 from '../container/Content.Step2.Internal'
import Step3 from '../container/Content.Step3'
import Step4 from './Content.Step4'
import Step5 from './Content.Step5'
import { updateDefaultCardBalance } from '../../../actions/cards'

class InternalModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// senderAccountID: '',
			receiver: {
				accountName: '',
				accountID: '',
				bankID: '',
				bankName: '',
			},
			amount: 50000,
			detail: '',
			chargedBySender: true,
			step: 1,
			disabled: false,
		}
		this.handleDisabled = this.handleDisabled.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleBack = this.handleBack.bind(this)
		this.handleTransfer = this.handleTransfer.bind(this)
	}

	handleDisabled(value) {
		this.setState({
			disabled: value,
		})
	}

	handleOnChange(value) {
		this.setState({
			...value,
		})
	}

	handleNext() {
		this.setState((prevState) => ({
			step: prevState.step + 1,
		}))
	}

	handleBack() {
		this.setState((prevState) => ({
			step: prevState.step - 1,
		}))
	}

	async handleTransfer(otp) {
		const {
			onSuccess,
			onFailure,
			onClose,
			onProcessing,
			//
			// onUpdateBalance,
		} = this.props
		onClose()
		const {
			// senderAccountID,
			receiver,
			amount,
			detail,
			chargedBySender,
		} = this.state
		const data = {
			// senderAccountID,
			otp,
			toAccountId: receiver.accountID,
			toFullName: receiver.accountName,
			transactionAmount: amount,
			transactionMessage: detail,
			transactionPayer: chargedBySender ? 'TRANSFERER' : 'RECEIVER',
		}
		// const config = {
		//   headers: {
		//     'Content-Type': 'application/x-www-form-urlencoded',
		//   },
		// }
		onProcessing()
		const res = await api.post(
			'/transactions/transferring-internal-banking',
			data
		)
		if (res.error) {
			const { error } = res
			onFailure(error)
		} else {
			onSuccess()
			// onUpdateBalance(res.balance)
		}
	}

	render() {
		const {
			step,
			disabled,
			// senderAccountID,
			receiver,
			amount,
			detail,
			chargedBySender,
		} = this.state
		const { loading, onClose, onNewReceiver } = this.props

		return (
			<Template
				width={604}
				name='Internal transfer'
				loading={loading}
				onClose={onClose}
				disabled={disabled}
			>
				{[
					null,
					// <Step1
					//   value={senderAccountID}
					//   onChange={this.handleOnChange}
					//   onClose={onClose}
					//   onNext={this.handleNext}
					// />,
					<Step2
						value={receiver}
						onChange={this.handleOnChange}
						// onBack={this.handleBack}
						onBack={onClose}
						onNext={this.handleNext}
						onNewReceiver={onNewReceiver}
					/>,
					<Step3
						value={{
							amount,
							detail,
							chargedBySender,
							// senderAccountID,
						}}
						onChange={this.handleOnChange}
						onBack={this.handleBack}
						onNext={this.handleNext}
					/>,
					<Step4
						value={{
							// senderAccountID,
							receiver,
							amount,
							chargedBySender,
							detail,
						}}
						onBack={this.handleBack}
						onNext={this.handleNext}
					/>,
					<Step5
						onTransfer={this.handleTransfer}
						onDisabled={this.handleDisabled}
					/>,
				][step] || null}
			</Template>
		)
	}
}
InternalModal.defaultProps = {
	loading: false,
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	onProcessing: (f) => f,
	onNewReceiver: (f) => f,
	//
	onUpdateBalance: (f) => f,
}
InternalModal.propTypes = {
	loading: PropTypes.bool,
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onProcessing: PropTypes.func,
	onNewReceiver: PropTypes.func,
	//
	onUpdateBalance: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
	onUpdateBalance: (balance) => dispatch(updateDefaultCardBalance(balance)),
})
export default connect(null, mapDispatchToProps)(InternalModal)
