import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from '../../common/presentational/Input'
import TextArea from '../../common/presentational/TextArea'
import FormRadio from '../../common/presentational/Form.Radio'
import Button from '../../common/presentational/Button'
import Banner from '../../common/presentational/Banner.Step'
import { MINIMUM_BALANCE } from '../../../constants/constants'
// import { getAccountIDFromStorage } from '../../../utils/utils'

const Instruction = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	margin: 30px 0;
`
const InputWrapper = styled.div`
	width: 100%;
	margin-top: 30px;
`
const TextAreaWrapper = styled.div`
	width: 100%;
	margin-top: 24px;
`
const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 36px;
	& > *:first-child {
		margin-right: 10px;
	}
	& > *:last-child {
		margin-left: 10px;
	}
`

class Step3Content extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: 50000,
			error: '',
		}
		this.handleAmount = this.handleAmount.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleDetail = this.handleDetail.bind(this)
		this.handleRadio = this.handleRadio.bind(this)
	}

	componentDidMount() {
		const { value } = this.props
		this.setState({
			amount: value.amount,
		})
	}

	handleAmount(event) {
		const value = parseInt(event.target.value.replace(/\D/g, '') || 0, 10)
		if (value < 50000) {
			this.setState({
				amount: value,
				error: 'Value must be bigger than 50000',
			})
		} else {
			const { balance, onChange } = this.props
			if (value > balance - MINIMUM_BALANCE) {
				this.setState({
					error: 'Unaffordable amount',
					amount: value,
				})
			} else {
				this.setState({
					amount: value,
					error: '',
				})
				onChange({
					amount: value,
				})
			}
		}
	}

	handleDetail(event) {
		const { onChange } = this.props
		onChange({
			detail: event.target.value,
		})
	}

	handleRadio(value) {
		const { onChange } = this.props
		onChange({
			chargedBySender: value,
		})
	}

	handleNext() {
		const { error } = this.state
		const { onNext } = this.props
		if (!error) {
			onNext()
		}
	}

	render() {
		const { amount, error } = this.state
		const { value, onBack } = this.props
		const { detail, chargedBySender } = value
		const formData = [
			{ id: 1, value: true, label: 'Charged by the sender (you)' },
			{ id: 2, value: false, label: 'Charged by the receiver' },
		]
		return (
			<>
				<Banner
					// index={3}
					index={2}
					name='Payment'
					description='Provide the details of the payment'
				/>
				<InputWrapper>
					<Input
						label='Total amount:'
						placeholder='Enter the total amount of money'
						value={amount}
						onChange={this.handleAmount}
						error={error}
					/>
				</InputWrapper>
				<TextAreaWrapper>
					<TextArea
						label='Detail:'
						placeholder='Enter some details of the payment'
						value={detail}
						onChange={this.handleDetail}
					/>
				</TextAreaWrapper>
				<Instruction>Payment fee:</Instruction>
				<FormRadio
					data={formData}
					value={chargedBySender}
					onChange={this.handleRadio}
				/>
				<ButtonWrapper>
					<Button fluid secondary name='Back' onClick={onBack} />
					<Button fluid name='Next' onClick={this.handleNext} />
				</ButtonWrapper>
			</>
		)
	}
}
Step3Content.defaultProps = {
	value: {
		amount: 0,
		detail: '',
		chargedBySender: true,
	},
	onChange: (f) => f,
	onBack: (f) => f,
	onNext: (f) => f,
	//
	balance: 1000,
}
Step3Content.propTypes = {
	value: PropTypes.shape({
		amount: PropTypes.number,
		detail: PropTypes.string,
		chargedBySender: PropTypes.bool,
	}),
	onChange: PropTypes.func,
	onBack: PropTypes.func,
	onNext: PropTypes.func,
	//
	balance: PropTypes.number,
}
const mapStateToProps = (state) => {
	const { defaultCard } = state.cards
	const { balance } = defaultCard
	return {
		balance,
	}
}
export default connect(mapStateToProps)(Step3Content)
