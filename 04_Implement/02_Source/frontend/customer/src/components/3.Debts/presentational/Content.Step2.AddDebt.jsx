import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from '../../common/presentational/Input'
import TextArea from '../../common/presentational/TextArea'
import api from '../../../api/api'
import AddButton from '../../common/presentational/Button.Loading'
import BackButton from '../../common/presentational/Button'
import Banner from '../../common/presentational/Banner.Step'
import { addADebt } from '../../../actions/debts'

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

class Step2AddDebtContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			amount: 50000,
			error: '',
			loading: false,
		}
		this.handleAmount = this.handleAmount.bind(this)
		this.handleMessage = this.handleMessage.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
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
			const { onChange } = this.props
			this.setState({
				amount: value,
				error: '',
			})
			onChange({
				amount: value,
			})
		}
	}

	handleMessage(event) {
		const { onChange } = this.props
		onChange({
			message: event.target.value,
		})
	}

	async handleAdd() {
		const { error } = this.state

		const {
			value,
			onClose,
			onSuccess,
			onFailure,
			onDisabled,
			//
			onAddADebt,
		} = this.props
		if (!error) {
			this.setState({
				loading: true,
			})
			// onDisabled(true)
			const { borrowerID, borrowerName, amount, message } = value
			// console.log(value)
			const data = {
				borrowerAccountId: borrowerID,
				debtAmount: amount,
				debtMessage: message,
				borrowerFullname: borrowerName,
			}
			// const config = {
			//   headers: {
			//     'Content-Type': 'application/x-www-form-urlencoded',
			//   },
			// }
			const res = await api.post('/debt-collections/add-debt', data)
			if (res.error) {
				this.setState({
					loading: false,
				})
				onClose()
				onFailure(res.error)
			} else {
				onClose()
				onSuccess('You have successfully created a new debt!', true)
				onAddADebt(res.data)
			}
			// onDisabled(false)
		}
	}

	render() {
		const { amount, error, loading } = this.state
		const { value, onBack } = this.props
		const { message } = value
		return (
			<>
				<Banner
					index={2}
					name='Debt amount'
					description='Provide the details of the debt amount'
				/>
				<InputWrapper>
					<Input
						label='Total amount:'
						placeholder='Enter the total amount of money'
						value={amount}
						onChange={this.handleAmount}
						error={error}
						disabled={loading}
					/>
				</InputWrapper>
				<TextAreaWrapper>
					<TextArea
						label='Description:'
						placeholder='Enter some descriptions for the debt'
						value={message}
						disabled={loading}
						onChange={this.handleMessage}
					/>
				</TextAreaWrapper>
				<ButtonWrapper>
					<BackButton
						fluid
						secondary
						name='Back'
						onClick={onBack}
						disabled={loading}
					/>
					<AddButton
						fluid
						name='Finish'
						onClick={this.handleAdd}
						loading={loading}
						disabled={loading}
					/>
				</ButtonWrapper>
			</>
		)
	}
}
Step2AddDebtContent.defaultProps = {
	value: {
		borrowerID: '',
		amount: 0,
		message: '',
		borrowerName: '',
	},
	onChange: (f) => f,
	onBack: (f) => f,
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	onDisabled: (f) => f,
	//
	onAddADebt: (f) => f,
}
Step2AddDebtContent.propTypes = {
	value: PropTypes.shape({
		borrowerID: PropTypes.string,
		amount: PropTypes.number,
		message: PropTypes.string,
		borrowerName: PropTypes.string,
	}),
	onChange: PropTypes.func,
	onBack: PropTypes.func,
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onDisabled: PropTypes.func,
	//
	onAddADebt: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
	onAddADebt: (data) => dispatch(addADebt(data)),
})
export default connect(null, mapDispatchToProps)(Step2AddDebtContent)
