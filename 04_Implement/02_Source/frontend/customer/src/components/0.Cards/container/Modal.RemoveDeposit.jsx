import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeleteButton from '../../common/presentational/Button.Loading'
import CancelButton from '../../common/presentational/Button'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'

const Text = styled.span`
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
	margin-top: 54px;
`
const DeleteWrapper = styled.div`
	width: 100%;
	margin-left: 10px;
`
const CancelWrapper = styled.div`
	width: 100%;
	margin-right: 10px;
`
const RemoveDepositModal = ({
	id,
	onClose,
	onSuccess,
	onFailure,
	onScrollTop,
}) => {
	const [loading, setLoading] = useState(false)
	const handleDelete = async () => {
		setLoading(true)
		const data = {
			depositId: id,
		}
		const res = await api.delete('/accounts/delete-saving-account', data)
		if (res.error) {
			setLoading(false)
			onClose()
			onFailure(res.error)
		} else {
			setLoading(false)
			onClose()
			onScrollTop()
			onSuccess('You have successfully removed a deposit')
		}
	}
	return (
		<Template name='Remove deposit' disabled={loading} onClose={onClose}>
			<Text>
				You are about to remove a deposit
				<br /> This action cannot be restored
			</Text>
			<ButtonWrapper>
				<CancelWrapper>
					<CancelButton
						name='Cancel'
						secondary
						fluid
						disabled={loading}
						onClick={onClose}
					/>
				</CancelWrapper>
				<DeleteWrapper>
					<DeleteButton
						name='Delete'
						fluid
						onClick={handleDelete}
						loading={loading}
						disabled={loading}
					/>
				</DeleteWrapper>
			</ButtonWrapper>
		</Template>
	)
}
RemoveDepositModal.defaultProps = {
	id: '',
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
}
RemoveDepositModal.propTypes = {
	id: PropTypes.string,
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
}
export default RemoveDepositModal
