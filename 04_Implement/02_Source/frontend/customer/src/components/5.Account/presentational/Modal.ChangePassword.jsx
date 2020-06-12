import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Template from '../../common/presentational/Template.Modal'
import Input from '../../SignIn/presentational/Input.Password'
import Button from '../../common/presentational/Button.Loading'
import api from '../../../api/api'

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
class ChangePasswordModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
			error: '',
			newPasswordError: '',
			loading: false,
		}
		this.handleOldPassword = this.handleOldPassword.bind(this)
		this.handleNewPassword = this.handleNewPassword.bind(this)
		this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleOldPassword(event) {
		this.setState({
			currentPassword: event.target.value,
			error: '',
		})
	}

	handleNewPassword(event) {
		this.setState({
			newPassword: event.target.value,
			error: '',
			newPasswordError: '',
		})
	}

	handleConfirmPassword(event) {
		this.setState({
			confirmPassword: event.target.value,
			error: '',
			newPasswordError: '',
		})
	}

	async handleSubmit() {
		const { currentPassword, newPassword, confirmPassword } = this.state
		const { onClose, onSuccess, onFailure } = this.props
		if (!currentPassword || !newPassword || !confirmPassword) {
			this.setState({
				error: 'Required field',
			})
			return
		}
		if (newPassword !== confirmPassword) {
			this.setState({
				newPasswordError: "New password does't match confirm password",
			})
			return
		}
		// Validate account ID
		const data = {
			oldPassword: currentPassword,
			newPassword,
		}
		// const config = {
		//   headers: {
		//     'Content-Type': 'application/x-www-form-urlencoded',
		//   },
		// }
		this.setState({
			loading: true,
			error: '',
			newPasswordError: '',
		})
		const res = await api.put('/customers/change-password', data)
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
			onSuccess()
		}
	}

	render() {
		const {
			currentPassword,
			newPassword,
			confirmPassword,
			error,
			loading,
			newPasswordError,
		} = this.state
		const { onClose } = this.props
		return (
			<Template name='Change password' onClose={onClose} disabled={loading}>
				<Text>Follow the instructions to change your password</Text>
				<InputWrapper>
					<Input
						label='Current password'
						placeholder='Enter your current password'
						value={currentPassword}
						onChange={this.handleOldPassword}
						disabled={loading}
						error={error}
						loading={loading}
						icon={false}
					/>
				</InputWrapper>
				<InputWrapper>
					<Input
						label='New password'
						placeholder='Enter your new password'
						value={newPassword}
						onChange={this.handleNewPassword}
						disabled={loading}
						error={error || newPasswordError}
						icon={false}
					/>
				</InputWrapper>
				<Input
					label='Confirm password'
					placeholder='Re-enter your new password'
					value={confirmPassword}
					error={error || newPasswordError}
					onChange={this.handleConfirmPassword}
					disabled={loading}
					icon={false}
				/>
				<ButtonWrapper>
					<Button
						name='Save changes'
						fluid
						onClick={this.handleSubmit}
						loading={loading}
						disabled={loading}
					/>
				</ButtonWrapper>
			</Template>
		)
	}
}

ChangePasswordModal.defaultProps = {
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
}
ChangePasswordModal.propTypes = {
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
}
export default ChangePasswordModal
