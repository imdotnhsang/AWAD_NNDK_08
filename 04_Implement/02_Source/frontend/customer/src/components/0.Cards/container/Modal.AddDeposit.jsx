import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Select from '../../common/container/Select.Term'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
import api from '../../../api/api'
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
const TextInfoTitle = styled.p`
	font-family: OpenSans-Bold;
	font-size: 15px;
	color: #fff;
	margin: 0;
	margin-bottom: 8px;
`
const TextInfo = styled.p`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	margin: 0;
`
const InterestRateInfo = styled.div`
	margin-bottom: 24px;
	background: #111;
	width: 100%;
	padding: 12px 16px;
`
class AddDepositModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			depositAmount: 1000000,
			depositTerm: 0,
			depositInterestRate: 0,
			interestRateInfo: false,
			depositInterestRateInfo: '',
			error: '',
			loading: false,
		}
		this.handleAmount = this.handleAmount.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
		this.handleTerm = this.handleTerm.bind(this)
	}

	handleAmount(event) {
		const value = parseInt(event.target.value.replace(/\D/g, '') || 0, 10)
		if (value < 1000000) {
			this.setState({
				depositAmount: value,
				error: 'Value must be bigger than 1,000,000 VND',
			})
		} else if (value > 1000000000000) {
			this.setState({
				depositAmount: value,
				error: 'Value must be smaller than 1,000,000,000,000 VND',
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
		const { depositAmount, depositTerm, depositInterestRate } = this.state
		const { onClose, onSuccess, onFailure, onScrollTop } = this.props
		const data = {
			depositAmount,
			depositTerm,
			depositInterestRate,
		}
		if (depositTerm === 0) {
			this.setState({
				loading: false,
				error: 'Please choose a term',
			})
		} else {
			this.setState({
				loading: true,
				error: '',
			})
			const res = await api.post('/accounts/add-saving-account', data)
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
				onScrollTop()
				onSuccess('A new deposit successfully added!')
				// const { data: newData } = res
				// onAddAReceiver(newData)
			}
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleSubmit()
		}
	}

	handleTerm(valueTerm, valueInterestRate, textInterestRate) {
		this.setState({
			depositTerm: valueTerm,
			depositInterestRate: valueInterestRate,
			depositInterestRateInfo: textInterestRate,
			error: '',
			interestRateInfo: true,
		})
	}

	render() {
		const {
			depositAmount,
			depositTerm,
			depositInterestRateInfo,
			error,
			loading,
			interestRateInfo,
		} = this.state
		const { onClose } = this.props
		return (
			<Template name='Add deposit' onClose={onClose}>
				<>
					<Text>Enter the information for your new deposit</Text>
					<InputWrapper>
						<Select
							error={error}
							value={depositTerm}
							onChange={this.handleTerm}
							disabled={loading}
						/>
					</InputWrapper>
					{interestRateInfo && (
						<InterestRateInfo active={interestRateInfo}>
							<TextInfoTitle>
								Interest rate: {depositInterestRateInfo}
							</TextInfoTitle>
							<TextInfo style={{ marginBottom: '2px' }}>
								Deposit type: VND
							</TextInfo>
							<TextInfo style={{ marginBottom: '2px' }}>
								Minimum deposit amount: 1,000,000 VND
							</TextInfo>
							<TextInfo>Maximum deposit amount: 1,000,000,000,000 VND</TextInfo>
						</InterestRateInfo>
					)}
					<InputWrapper>
						<Input
							label='Deposit amount'
							placeholder='Enter the deposit amount'
							value={commaSeparating(depositAmount, 3)}
							onChange={this.handleAmount}
							error={error}
							onKeyDown={this.handleEnterKey}
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
