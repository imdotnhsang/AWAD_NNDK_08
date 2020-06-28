import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Banner from '../../common/presentational/Banner.Step'
import VerifyButton from '../../common/presentational/Button.Loading'
import Input from '../../common/presentational/Input'
// import { getEmailFromStorage } from '../../../utils/utils'
// import api from '../../../api/api'

const Instruction = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	margin: 30px 0;
	line-height: 16px;
`
const ButtonWrapper = styled.div`
	width: 100%;
	margin-top: 36px;
`

class Step5Content extends Component {
	constructor(props) {
		super(props)
		this.state = {
			otp: '',
			loading: false,
			error: '',
		}
		this.handleOTP = this.handleOTP.bind(this)
		this.handleFinish = this.handleFinish.bind(this)
		this.handleEnterKey = this.handleEnterKey.bind(this)
	}

	handleOTP(event) {
		this.setState({
			otp: event.target.value,
			error: '',
		})
	}

	async handleFinish() {
		const { onDisabled } = this.props
		this.setState({
			error: '',
			loading: true,
		})
		// onDisabled(true)
		const { otp } = this.state
		// eslint-disable-next-line no-restricted-globals
		if (otp.length !== 6 || isNaN(otp)) {
			this.setState({
				loading: false,
				error: 'Invalid value',
			})
		} else {
			// const data = {
			//   email: getEmailFromStorage(),
			//   otp,
			// }
			// const config = {
			//   headers: {
			//     'Content-Type': 'application/x-www-form-urlencoded',
			//   },
			// }
			// const res = await api.post('/otp/validate', data, config)
			// if (res.error) {
			//   const { error } = res
			//   this.setState({
			//     loading: false,
			//     error,
			//   })
			// } else {
			//   const { valid } = res
			//   if (valid) {
			//     this.setState({
			//       loading: false,
			//     })
			const { onTransfer } = this.props
			onTransfer(otp)
			//   } else {
			//     this.setState({
			//       loading: false,
			//       error: 'Invalid OTP code',
			//     })
			//   }
			// }
			// onDisabled(false)
		}
	}

	handleEnterKey(e) {
		if (e.key === 'Enter') {
			this.handleFinish()
		}
	}

	render() {
		const { otp, loading, error } = this.state
		return (
			<>
				<Banner
					// index={5}
					index={4}
					name='Finish'
					description='Finish your payment by verifying your payment using OTP code'
				/>
				<Instruction>
					A OTP code has been sent to your email
					<br />
					Please check your inbox and follow the instructions
				</Instruction>
				<Input
					label='OTP:'
					placeholder='Enter the OTP code'
					value={otp}
					error={error}
					onChange={this.handleOTP}
					onKeyDown={this.handleEnterKey}
				/>
				<ButtonWrapper>
					<VerifyButton
						fluid
						name='Finish'
						onClick={this.handleFinish}
						loading={loading}
						disabled={loading}
					/>
				</ButtonWrapper>
			</>
		)
	}
}
Step5Content.defaultProps = {
	onDisabled: (f) => f,
	onTransfer: (f) => f,
}
Step5Content.propTypes = {
	onDisabled: PropTypes.func,
	onTransfer: PropTypes.func,
}
export default Step5Content
