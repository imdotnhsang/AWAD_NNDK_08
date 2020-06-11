import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Step1 from './Content.Step1.AddDebt'
import Step2 from '../presentational/Content.Step2.AddDebt'
// import { fetchBanksDataIfNeeded } from '../../../actions/banks'
import { fetchReceiversDataIfNeeded } from '../../../actions/receivers'

class AddDebtModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			borrower: {
				accountName: '',
				accountID: '',
				bankID: '',
				bankName: '',
			},
			amount: 50000,
			message: '',
			step: 0,
			disabled: false,
		}
		this.handleDisabled = this.handleDisabled.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleNext = this.handleNext.bind(this)
		this.handleBack = this.handleBack.bind(this)
	}

	componentDidMount() {
		const { onFetchReceiversData } = this.props
		// onFetchBanksData()
		onFetchReceiversData()
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

	render() {
		const { step, borrower, amount, message, disabled } = this.state

		const {
			onClose,
			onSuccess,
			onFailure,
			//
			// banksLoading,
			receiversLoading,
			onScrollTop,
		} = this.props

		return (
			<Template
				onClose={onClose}
				name='Add debt'
				width={604}
				loading={receiversLoading}
				disabled={disabled}
			>
				{[
					<Step1
						value={borrower}
						onChange={this.handleOnChange}
						onNext={this.handleNext}
						onClose={onClose}
					/>,
					<Step2
						value={{
							borrowerID: borrower.accountID,
							borrowerName: borrower.accountName,
							amount,
							message,
						}}
						onChange={this.handleOnChange}
						onBack={this.handleBack}
						onClose={onClose}
						onSuccess={(v, t) => {
							onSuccess(v, t)
							onScrollTop(true)
						}}
						onFailure={onFailure}
						// onDisabled={this.handleDisabled}
					/>,
				][step] || null}
			</Template>
		)
	}
}
AddDebtModal.defaultProps = {
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	//
	banksLoading: false,
	receiversLoading: false,
	onFetchBanksData: (f) => f,
	onFetchReceiversData: (f) => f,
}
AddDebtModal.propTypes = {
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
	//
	banksLoading: PropTypes.bool,
	receiversLoading: PropTypes.bool,
	// onFetchBanksData: PropTypes.func,
	onFetchReceiversData: PropTypes.func,
}
const mapStateToProps = (state) => ({
	// banksLoading: state.banks.loading,
	receiversLoading: state.receivers.loading,
})
const mapDispatchToProps = (dispatch) => ({
	// onFetchBanksData: () => dispatch(fetchBanksDataIfNeeded()),
	onFetchReceiversData: () => dispatch(fetchReceiversDataIfNeeded()),
})
export default connect(mapStateToProps, mapDispatchToProps)(AddDebtModal)
