import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import RadioForm from '../../common/presentational/Form.Radio'
import Input from '../../common/presentational/Input'
import Banner from '../../common/presentational/Banner.Step'
import Button from '../../common/presentational/Button'
import Table from '../../1.Receivers/presentational/Table.Min.Select'
import SearchButton from '../../common/presentational/Button.Search'
import Display from '../../1.Receivers/presentational/Display'
import api from '../../../api/api'
import { getBankIDFromStorage } from '../../../utils/utils'

const FormWrapper = styled.div`
	width: 100%;
	margin: 30px 0;
`
const Error = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: ${(props) => props.theme.yellow};
	margin-top: 30px;
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
const SearchWrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	& > *:last-child {
		margin-left: 30px;
	}
	margin-bottom: 24px;
`
const Instruction = styled.span`
	margin-top: 30px;
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
`

class Step2AddDebtContent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			existedReceiver: {
				id: '',
				accountName: '',
				accountID: '',
				bankID: '',
				bankName: '',
			},
			newReceiver: {
				id: '',
				accountName: '',
				accountID: '',
				bankID: '',
				bankName: '',
			},
			tab2Input: '',
			tab: 1,
			error: '',
			loading: false,
		}
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleTableChange = this.handleTableChange.bind(this)
		this.handleTab2Input = this.handleTab2Input.bind(this)
		this.handleSearch = this.handleSearch.bind(this)
		this.handleRadioForm = this.handleRadioForm.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
	}

	componentDidMount() {
		const { value, receiversData } = this.props
		if (value.accountID) {
			const isExisted =
				receiversData.findIndex(
					(receiver) =>
						receiver.accountID === value.accountID &&
						receiver.bankID === value.bankID
				) !== -1
			if (isExisted) {
				this.setState({
					tab: 1,
					existedReceiver: value,
				})
			} else {
				this.setState({
					tab: 2,
					newReceiver: value,
				})
			}
		}
	}

	handleOnChange(value) {
		const { onChange } = this.props
		onChange({
			borrower: value,
		})
	}

	handleTableChange(value) {
		this.setState({
			existedReceiver: value,
		})
		this.handleOnChange(value)
	}

	handleTab2Input(event) {
		this.setState({
			tab2Input: event.target.value.replace(/\D/g, ''),
			error: '',
		})
	}

	async handleSearch() {
		const { tab2Input } = this.state
		// const { banksData } = this.props
		// eslint-disable-next-line no-restricted-globals
		// if (!isNaN(tab2Input)) {
		// 	this.setState({
		// 		error: 'Invalid value',
		// 	})
		// 	return
		// }
		this.setState({
			loading: true,
			error: '',
		})
		// console.log(banksData)
		// const bankID = banksData.find((bank) => bank.bank_name === 'Eight Bank').bank_id
		const data = {
			accountId: tab2Input,
			// bankID,
		}
		const res = await api.get('/transactions/receiver-internal-banking', data)
		if (res.error) {
			const { error } = res
			this.setState({
				error,
				loading: false,
			})
		} else {
			const { full_name: accountName } = res
			if (accountName) {
				this.setState({
					loading: false,
					newReceiver: {
						accountID: tab2Input,
						accountName: res.full_name,
						bankID: 'EIGHT.Bank',
						bankName: 'Eight Bank',
					},
				})
				this.handleOnChange(this.state.newReceiver)
			} else {
				this.setState({
					error: 'Invalid card number',
					loading: false,
				})
			}
		}
	}

	handleRadioForm(value) {
		this.setState({
			tab: value,
			error: '',
		})
		const { existedReceiver, newReceiver } = this.state
		if (value === 1) {
			this.handleOnChange(existedReceiver)
		} else {
			this.handleOnChange(newReceiver)
		}
	}

	handleNext() {
		const { tab, existedReceiver, newReceiver } = this.state

		const { onNext } = this.props

		if (tab === 1) {
			if (existedReceiver.accountID) onNext()
			else {
				this.setState({
					error: 'Please choose a borrower',
				})
			}
		} else if (newReceiver.accountID) {
			onNext()
		} else {
			this.setState({
				error: 'Please provide a valid card number',
			})
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleSearch()
		}
	}

	render() {
		const formData = [
			{ id: 1, value: 1, label: 'Existed receivers' },
			{ id: 2, value: 2, label: 'A new borrower' },
		]

		const {
			existedReceiver,
			tab2Input,
			newReceiver,
			loading,
			tab,
			error,
		} = this.state

		const {
			onClose,
			//
			receiversData,
		} = this.props
		console.log(receiversData)
		return (
			<>
				<Banner
					index={1}
					name='Borrower'
					description='Provide the information of the borrower'
				/>
				<Instruction>Add information from:</Instruction>
				<FormWrapper>
					<RadioForm
						data={formData}
						value={tab}
						onChange={this.handleRadioForm}
					/>
				</FormWrapper>
				{tab === 1 ? (
					<>
						<Table
							data={receiversData}
							value={existedReceiver}
							onChange={this.handleTableChange}
						/>
						{error && <Error>{error}</Error>}
					</>
				) : (
					<>
						<div style={{ height: '1px', width: '100%' }} />
						<SearchWrapper>
							<Input
								label='Card number'
								placeholder="Enter the borrower's card number"
								value={tab2Input}
								error={error}
								onChange={this.handleTab2Input}
								disabled={loading}
								onKeyDown={this.handleEnterKey}
							/>
							<SearchButton disabled={loading} onClick={this.handleSearch} />
						</SearchWrapper>
						<Display
							name={newReceiver.accountName}
							bankName={newReceiver.bankName}
							cardNumber={newReceiver.accountID}
							loading={loading}
						/>
					</>
				)}
				<ButtonWrapper>
					<Button fluid secondary name='Cancel' onClick={onClose} />
					<Button
						fluid
						name='Next'
						onClick={this.handleNext}
						disabled={loading}
					/>
				</ButtonWrapper>
			</>
		)
	}
}

Step2AddDebtContent.defaultProps = {
	value: {
		accountName: '',
		accountID: '',
		bankID: '',
		bankName: '',
	},
	onChange: (f) => f,
	onClose: (f) => f,
	onNext: (f) => f,
	//
	receiversData: [],
	// banksData: [],
}
Step2AddDebtContent.propTypes = {
	value: PropTypes.shape({
		accountName: PropTypes.string,
		accountID: PropTypes.string,
		bankID: PropTypes.string,
		bankName: PropTypes.string,
	}),
	onChange: PropTypes.func,
	onClose: PropTypes.func,
	onNext: PropTypes.func,
	//
	receiversData: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			nickname: PropTypes.string,
			accountID: PropTypes.string,
			bankName: PropTypes.string,
		})
	),
	// banksData: PropTypes.arrayOf(
	// 	PropTypes.shape({
	// 		id: PropTypes.string,
	// 		name: PropTypes.string,
	// 	})
	// ),
}

const mapStateToProps = (state) => ({
	receiversData: state.receivers.receivers
		.filter((receiver) => receiver.bank_id === 'EIGHT.Bank')
		.map((receiver) => ({
			id: receiver._id,
			accountNickname: receiver.nickname,
			accountName: receiver.full_name,
			accountID: receiver.account_id,
			bankID: receiver.bank_id,
			bankName: receiver.bank_name,
		})),
	// banksData: state.banks.banks,
})
export default connect(mapStateToProps)(Step2AddDebtContent)
