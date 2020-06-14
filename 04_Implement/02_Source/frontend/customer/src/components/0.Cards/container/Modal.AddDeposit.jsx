import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
// import Select from '../../common/container/Select.Bank'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
import api from '../../../api/api'
// import { addAReceiver } from '../../../actions/receivers'
import { commaSeparating } from '../../../utils/utils'
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
			depositAmount: 1000000,
			error: '',
			loading: false,
		}
		this.handleAmount = this.handleAmount.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleAmount(event) {
		const value = parseInt(event.target.value.replace(/\D/g, '') || 0, 10)
		if (value < 1000000) {
			this.setState({
				depositAmount: value,
				error: 'Value must be bigger than 1,000,000',
			})
		} else {
			const { balance } = this.props
			if (value > balance - MINIMUM_BALANCE) {
				this.setState({
					error: 'Unaffordable amount',
					depositAmount: value,
				})
			} else {
				this.setState({
					depositAmount: value,
					error: '',
				})
			}
		}
	}

	async handleSubmit() {
		const { depositAmount } = this.state
		const { onClose, onSuccess, onFailure } = this.props
		const data = {
			depositAmount,
		}
		this.setState({
			loading: true,
			error: '',
		})
		const res = await api.post('/customers/add-saving-account', data)
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
			onSuccess('A new deposit successfully added!')
			// const { data: newData } = res
			// onAddAReceiver(newData)
		}
	}

	render() {
		const { depositAmount, error, loading } = this.state
		const { onClose } = this.props
		return (
			<Template name='Add deposit' onClose={onClose}>
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
							value={commaSeparating(depositAmount, 3)}
							onChange={this.handleAmount}
							error={error}
						/>
					</InputWrapper>
					<ButtonWrapper>
						<Button
							name='Create new deposit'
							fluid
							loading={loading}
							onClick={this.handleSubmit}
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
	onAddADeposit: (f) => f,
	balance: 1000,
}
AddDepositModal.propTypes = {
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onAddADeposit: PropTypes.func,
	balance: PropTypes.number,
}
const mapStateToProps = (state) => {
	const { defaultCard } = state.cards
	const { balance } = defaultCard
	return {
		balance,
	}
}
const mapDispatchToProps = (dispatch) => ({
	// onAddADeposit: (data) => dispatch(addADeposit(data)),
})
export default connect(mapStateToProps, mapDispatchToProps)(AddDepositModal)
