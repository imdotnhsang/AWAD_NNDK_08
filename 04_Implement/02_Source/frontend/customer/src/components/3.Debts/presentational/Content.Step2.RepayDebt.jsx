import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import CancelButton from '../../common/presentational/Button'
import RepayButton from '../../common/presentational/Button.Loading'
import {
	spaceSeparating,
	// getEmailFromStorage,
	aliasFullname,
} from '../../../utils/utils'
import api from '../../../api/api'
import Banner from '../../common/presentational/Banner.Step'
import { MINIMUM_BALANCE } from '../../../constants/constants'

const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
`
const StyledRow = styled(Row)`
	width: 100%;
	margin: 0;
`
const StyledCol = styled(Col)`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: flex-start;
	word-wrap: break-word;
	text-align: justify;
	padding: 0;
`
const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	& > * {
		margin-top: 32px;
	}
	& > *:last-child {
		margin-top: 32px;
	}
	& > *:first-child {
		margin-top: 0px;
	}
`
const Instruction = styled.span`
	margin: 30px 0;
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	line-height: 16px;
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
const Error = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: ${(props) => props.theme.yellow};
	margin-top: 30px;
	line-height: 16px;
`
class Step2RepayDebt extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: '',
			error: '',
		}
		this.handleSendOTP = this.handleSendOTP.bind(this)
	}

	async handleSendOTP() {
		const { data: dataDebtColleciton, balance } = this.props
		this.setState({
			error: '',
			loading: true,
		})
		if (dataDebtColleciton.debt_amount > balance - MINIMUM_BALANCE) {
			this.setState({
				error: 'Insufficient funds.',
				loading: false,
			})
		} else {
			const { onNext } = this.props
			const res = await api.post('/customers/send-transferring-otp')
			if (res.error) {
				const { error } = res
				this.setState({
					loading: false,
					error,
				})
			} else {
				this.setState({
					loading: false,
				})
				onNext()
			}
		}
	}

	render() {
		// const { loading, error } = this.state
		const { error } = this.state

		const { data, onBack } = this.props

		const {
			lender_fullname: lenderName,
			lender_default_account: lenderID,
			borrower_fullname: borrowerName,
			borrower_default_account: borrowerID,
			debt_amount: amount,
			debt_message: message,
		} = data

		return (
			<>
				<Banner
					// index={2}
					index={1}
					name='Confirm'
					description='Re-check the debt details'
				/>
				<Instruction>Are you sure you want to repay this debt?</Instruction>
				<Wrapper>
					<StyledRow>
						<StyledCol md={2}>
							<Text>Lender:</Text>
						</StyledCol>
						<StyledCol md={10}>
							<Text>{`${aliasFullname(lenderName)} / ${spaceSeparating(
								lenderID,
								4
							)} / EIGHT.Bank`}</Text>
						</StyledCol>
					</StyledRow>
					<StyledRow>
						<StyledCol md={2}>
							<Text>Borrower:</Text>
						</StyledCol>
						<StyledCol md={10}>
							<Text>{`${aliasFullname(borrowerName)} / ${spaceSeparating(
								borrowerID,
								4
							)} / EIGHT.Bank`}</Text>
						</StyledCol>
					</StyledRow>
					<StyledRow>
						<StyledCol md={2}>
							<Text>Amount:</Text>
						</StyledCol>
						<StyledCol md={10}>
							<Text>{`${spaceSeparating(amount, 3)} VND`}</Text>
						</StyledCol>
					</StyledRow>
					<StyledRow>
						<StyledCol md={2}>
							<Text>Description:</Text>
						</StyledCol>
						<StyledCol md={10}>
							<Text>{message || '(empty)'}</Text>
						</StyledCol>
					</StyledRow>
				</Wrapper>
				{error && <Error>{error}</Error>}
				<ButtonWrapper>
					<CancelButton
						// name="Back"
						name='Cancel'
						secondary
						fluid
						onClick={onBack}
					/>
					<RepayButton
						name='Confirm'
						fluid
						onClick={this.handleSendOTP}
						// loading={loading}
						// disabled={loading}
					/>
				</ButtonWrapper>
			</>
		)
	}
}
Step2RepayDebt.defaultProps = {
	data: {
		id: '',
		lenderName: '',
		lenderID: '',
		borrowerName: '',
		borrowerID: '',
		amount: 0,
		message: '',
	},
	onBack: (f) => f,
	onNext: (f) => f,
}
Step2RepayDebt.propTypes = {
	data: PropTypes.shape({
		id: PropTypes.string,
		lenderName: PropTypes.string,
		lenderID: PropTypes.string,
		borrowerName: PropTypes.string,
		borrowerID: PropTypes.string,
		amount: PropTypes.number,
		message: PropTypes.string,
	}),
	onBack: PropTypes.func,
	onNext: PropTypes.func,
}
const mapStateToProps = (state) => {
	const { defaultCard } = state.cards
	const { balance } = defaultCard
	return {
		balance,
	}
}

export default connect(mapStateToProps)(Step2RepayDebt)
