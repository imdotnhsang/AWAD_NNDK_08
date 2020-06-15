import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Display from '../../1.Receivers/presentational/Display'
import api from '../../../api/api'
import Button from '../../common/presentational/Button'
import ButtonLoading from '../../common/presentational/Button.Loading'
import Input from '../../common/presentational/Input'
import {
	// invalidateReceiversData,
	addAReceiver,
} from '../../../actions/receivers'

const Instruction = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	margin-bottom: 30px;
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

class SaveReceiverModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			nickname: '',
			loading: false,
			step: 0,
		}
		this.handleNext = this.handleNext.bind(this)
		this.handleAdd = this.handleAdd.bind(this)
		this.handleNickname = this.handleNickname.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
	}

	handleNext() {
		const { accountName } = this.props.data
		this.setState((prevState) => ({
			step: prevState.step + 1,
			nickname: accountName,
		}))
	}

	handleNickname(event) {
		this.setState({
			nickname: event.target.value,
		})
	}

	async handleAdd() {
		const { nickname } = this.state
		const {
			onClose,
			onSuccess,
			onFailure,
			//
			// invalidateData,
			onAddAReceiver,
		} = this.props
		// eslint-disable-next-line react/destructuring-assignment
		const { accountID, bankID, accountName } = this.props.data
		console.log(this.props.data)
		// Validate account ID
		const data = {
			fullName: accountName,
			bankName: this.props.data.bankName,
			bankId: bankID,
			accountId: accountID,
			nickname,
		}
		// const config = {
		//   headers: {
		//     'Content-Type': 'application/x-www-form-urlencoded',
		//   },
		// }
		this.setState({
			loading: true,
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
				loading: false,
			})
			onClose()
			// invalidateData()
			onSuccess('You have successfully added a new receiver')
			console.log(res.data)
			onAddAReceiver(res.data)
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleAdd()
		}
	}

	render() {
		const { nickname, loading, step } = this.state
		const { show, data, onClose } = this.props
		const { accountName, accountID, bankName } = data
		return (
			<Template width={604} name='New receiver' show={show} onClose={onClose}>
				{[
					<>
						<Instruction>
							You have just made a payment to a new receiver
							<br />
							Do you want to save this receiver for your future transactions?
						</Instruction>
						<Display
							name={accountName}
							bankName={bankName}
							cardNumber={accountID}
						/>
						<ButtonWrapper>
							<Button secondary fluid onClick={onClose} name='Cancel' />
							<Button fluid name='Save' onClick={this.handleNext} />
						</ButtonWrapper>
					</>,
					<>
						<Instruction>Get your new receiver a nickname!</Instruction>
						<Input
							label='Nickname'
							placeholder={accountName}
							value={nickname}
							onChange={this.handleNickname}
							onKeyDown={this.handleEnterKey}
						/>
						<ButtonWrapper>
							<Button secondary fluid onClick={onClose} name='Cancel' />
							<ButtonLoading
								fluid
								name='Save'
								onClick={this.handleAdd}
								loading={loading}
							/>
						</ButtonWrapper>
					</>,
				][step] || null}
			</Template>
		)
	}
}
SaveReceiverModal.defaultProps = {
	show: false,
	data: {
		accountID: '',
		accountName: '',
		bankID: '',
		bankName: '',
	},
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	//
	// invalidateData: (f) => f,
	onAddAReceiver: (f) => f,
}
SaveReceiverModal.propTypes = {
	show: PropTypes.bool,
	data: PropTypes.shape({
		accountID: PropTypes.string,
		accountName: PropTypes.string,
		bankID: PropTypes.string,
		bankName: PropTypes.string,
	}),
	onClose: PropTypes.func,
	onSuccess: (f) => f,
	onFailure: (f) => f,
	//
	// invalidateData: PropTypes.func,
	onAddAReceiver: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
	// invalidateData: () => dispatch(invalidateReceiversData()),
	onAddAReceiver: (data) => dispatch(addAReceiver(data)),
})
export default connect(null, mapDispatchToProps)(SaveReceiverModal)
