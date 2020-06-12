import React, { Component } from 'react'
import styled from 'styled-components'
import { Link, Redirect } from 'react-router-dom'
import Button from '../../common/presentational/Button.Loading'
import Input from '../../common/presentational/Input'
import { isValidEmail, isNumber, setEmailToStorage } from '../../../utils/utils'
import api from '../../../api/api'

const Wrapper = styled.div`
	background: ${(props) => props.theme.grayGradient};
	border-radius: 25px;
	padding: 60px 54px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: 500px;
	box-sizing: border-box;
`
const Title = styled.span`
	font-family: OpenSans-Bold;
	color: #fff;
	font-size: 25px;
	margin-bottom: 54px;
`
const Instruction = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	line-height: 16px;
	margin-bottom: 24px;
`
const InputWrapper = styled.div`
	width: 100%;
	margin-bottom: 24px;
`
const StyledLink = styled(Link)`
	font-family: OpenSans-Regular;
	font-size: 12px;
	align-self: flex-end;
	margin-bottom: 36px;
	color: #fff;
	text-decoration: none;
	font-family: OpenSans-Regular;
`

class ForgotPasswordForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email: '',
			otp: '',
			error: '',
			loading: false,
			verifyOTPStage: false,
			newPasswordStage: false,
		}
		this.handleEmail = this.handleEmail.bind(this)
		this.handleOTP = this.handleOTP.bind(this)
		this.handleKeyPress = this.handleKeyPress.bind(this)
		this.handleForgotPassword = this.handleForgotPassword.bind(this)
	}

	handleEmail(event) {
		this.setState({
			email: event.target.value,
			error: '',
		})
	}

	handleOTP(event) {
		this.setState({
			otp: event.target.value,
			error: '',
		})
	}

	handleKeyPress(event) {
		if (event.which === 13 || event.keyCode === 13) {
			this.handleForgotPassword()
			return false
		}
		return true
	}

	async handleForgotPassword() {
		const { email, otp, verifyOTPStage } = this.state
		if (!verifyOTPStage) {
			// Required field
			if (!email) {
				this.setState({ error: 'Required field' })
				return
			}
			// Invalid email
			if (!isValidEmail(email)) {
				this.setState({ error: 'Invalid email' })
				return
			}
			this.setState({ loading: true })
			const data = {
				email,
			}
			// const config = {
			//   headers: {
			//     'Content-Type': 'application/x-www-form-urlencoded',
			//   },
			// }
			const res = await api.post('/customers/send-password-otp', data)
			if (res.error) {
				const { error } = res
				this.setState({
					error,
					loading: false,
				})
			} else {
				this.setState({
					verifyOTPStage: true,
					error: '',
					loading: false,
				})
			}
		} else {
			// Required field
			if (!otp) {
				this.setState({ error: 'Required field' })
				return
			}
			// Invalid email
			if (!isNumber(otp)) {
				this.setState({ error: 'Invalid value' })
				return
			}
			this.setState({ loading: true })
			const data = {
				email,
				otp,
			}
			// const config = {
			//   headers: {
			//     'Content-Type': 'application/x-www-form-urlencoded',
			//   },
			// }
			const res = await api.post('/customers/validate-password-otp', data)
			if (res.error) {
				const { error } = res
				this.setState({
					error,
					loading: false,
				})
			} else {
				setEmailToStorage(email)
				this.setState({
					newPasswordStage: true,
					loading: false,
				})
			}
		}
	}

	render() {
		const {
			email,
			otp,
			error,
			loading,
			verifyOTPStage,
			newPasswordStage,
		} = this.state

		if (newPasswordStage) {
			return <Redirect to='/reset-password' />
		}
		return (
			<Wrapper>
				<Title>Forgot password</Title>
				<Instruction>
					{verifyOTPStage
						? 'A OTP code has been sent to your email\nPlease check your inbox and follow the instructions'
						: 'Enter the email address associated with your account'}
				</Instruction>
				<InputWrapper>
					<Input
						label={verifyOTPStage ? 'OTP' : 'Your email'}
						placeholder={
							verifyOTPStage ? 'Enter your OTP code' : 'Enter your email'
						}
						value={verifyOTPStage ? otp : email}
						error={error}
						disabled={loading}
						onChange={verifyOTPStage ? this.handleOTP : this.handleEmail}
						onKeyPress={this.handleKeyPress}
					/>
				</InputWrapper>
				<StyledLink to='/login'>I remembered my password</StyledLink>
				<Button
					fluid
					name={verifyOTPStage ? 'Verify' : 'Reset password'}
					disabled={loading}
					loading={loading}
					onClick={this.handleForgotPassword}
				/>
			</Wrapper>
		)
	}
}

export default ForgotPasswordForm
