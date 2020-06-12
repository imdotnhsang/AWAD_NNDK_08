import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'
// import Step1 from '../container/Content.Step1.RepayDebt'
import Step2 from './Content.Step2.RepayDebt'
import Step3 from './Content.Step3.RepayDebt'
import {
	// invalidateCardsData,
	fetchCardsDataIfNeeded,
	updateDefaultCardBalance,
} from '../../../actions/cards'

class RepayDebtModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			// accountID: '',
			step: 1,
			disabled: false,
		}
		this.handleDisabled = this.handleDisabled.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleBack = this.handleBack.bind(this)
		this.handleRepay = this.handleRepay.bind(this)
	}

	componentDidMount() {
		const { onFetchCardsData } = this.props
		onFetchCardsData()
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

	async handleRepay(otp) {
		const {
			onSuccess,
			onFailure,
			onClose,
			onProcessing,
			//
			// onInvalidateData,
			// onUpdateBalance,
		} = this.props
		onClose()

		// eslint-disable-next-line react/destructuring-assignment
		const { _id } = this.props.data
		// const {
		//   accountID,
		// } = this.state

		const data = {
			// accountID,
			otp,
			debtCollectionId: _id,
		}
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 	},
		// }
		onProcessing()
		const res = await api.post('/debt-collections/repayment', data)
		if (res.error) {
			const { error } = res
			onFailure(error)
		} else {
			onSuccess('You have successfully repay this debt', false)
			// onInvalidateData()
			// onUpdateBalance(res.data.transaction_info.transaction_balance_after)
		}
	}

	render() {
		const {
			step,
			disabled,
			// accountID,
		} = this.state
		const {
			show,
			data,
			onClose,
			//
			cardsLoading,
		} = this.props
		return (
			<Template
				width={604}
				name='Repay debt'
				show={show}
				onClose={onClose}
				disabled={disabled}
				loading={cardsLoading}
			>
				{[
					null,
					// <Step1
					//   value={accountID}
					//   onChange={this.handleOnChange}
					//   onClose={onClose}
					//   onNext={this.handleNext}
					// />,
					<Step2
						data={data}
						// onBack={this.handleBack}
						onBack={onClose}
						onNext={this.handleNext}
					/>,
					<Step3
						onRepay={this.handleRepay}
						onDisabled={this.handleDisabled}
						data={data}
					/>,
				][step] || null}
			</Template>
		)
	}
}
RepayDebtModal.defaultProps = {
	show: true,
	data: {
		id: '',
		lenderName: '',
		lenderID: '',
		borrowerName: '',
		borrowerID: '',
		amount: 0,
		message: '',
	},
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	onProcessing: (f) => f,
	//
	cardsLoading: (f) => f,
	// onInvalidateData: (f) => f,
	onFetchCardsData: (f) => f,
	onUpdateBalance: (f) => f,
}
RepayDebtModal.propTypes = {
	show: PropTypes.bool,
	data: PropTypes.shape({
		id: PropTypes.string,
		lenderName: PropTypes.string,
		lenderID: PropTypes.string,
		borrowerName: PropTypes.string,
		borrowerID: PropTypes.string,
		amount: PropTypes.number,
		message: PropTypes.string,
	}),
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	onProcessing: PropTypes.func,
	//
	cardsLoading: PropTypes.bool,
	// onInvalidateData: PropTypes.func,
	onFetchCardsData: PropTypes.func,
	onUpdateBalance: PropTypes.func,
}
const mapStateToProps = (state) => ({
	cardsLoading: state.cards.loading,
})
const mapDispatchToProps = (dispatch) => ({
	// onInvalidateData: () => dispatch(invalidateCardsData()),
	onUpdateBalance: (balance) => dispatch(updateDefaultCardBalance(balance)),
	onFetchCardsData: () => dispatch(fetchCardsDataIfNeeded()),
})
export default connect(mapStateToProps, mapDispatchToProps)(RepayDebtModal)
