import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeleteButton from '../../common/presentational/Button.Loading'
import CancelButton from '../../common/presentational/Button'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'
import {
	getDayMonthYear,
	commaSeparating,
	getTermText,
	getInterestEarned,
} from '../../../utils/utils'
import { Row, Col } from 'react-bootstrap'

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
const CompleteInfo = styled.div`
	margin-top: 24px;
	background: #111;
	width: 100%;
	padding: 30px 16px 12px 16px;
`
const StyledRow = styled(Row)`
	width: 100%;
	margin: 0;
	padding-bottom: 18px;
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
const CompleteDepositModal = ({
	id,
	term,
	endTime,
	balance,
	interestRate,
	createdAt,
	onClose,
	onSuccess,
	onFailure,
	onScrollTop,
}) => {
	const [loading, setLoading] = useState(false)
	const handleComplete = async () => {
		setLoading(true)
		const data = {
			depositId: id,
    }
		const res = await api.post('/accounts/complete-saving-account', data)
		if (res.error) {
			setLoading(false)
			onClose()
			onFailure(res.error)
		} else {
			setLoading(false)
			onClose()
			onScrollTop()
			onSuccess('You have successfully completed a deposit')
		}
	}
	return (
		<Template name='Complete deposit' disabled={loading} onClose={onClose}>
			<Text>
				An deposit account has successfully been completed! The account’s
				details is below.
			</Text>
			<CompleteInfo>
				<StyledRow>
					<StyledCol md={7}>
						<Text>Previous balance as of {getDayMonthYear(createdAt)}: </Text>
					</StyledCol>
					<StyledCol md={5}>
						<Text>{commaSeparating(balance, 3)} VND</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={7}>
						<Text>Term: </Text>
					</StyledCol>
					<StyledCol md={5}>
						<Text>{getTermText(term)}</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={7}>
						<Text>Interest rate: </Text>
					</StyledCol>
					<StyledCol md={5}>
						<Text>{interestRate * 100} %</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={7}>
						<Text>Interest earned: </Text>
					</StyledCol>
					<StyledCol md={5}>
						<Text>
							{commaSeparating(
								getInterestEarned(balance, term, interestRate),
								3
							)}{' '}
							VND
						</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={7}>
						<Text>Statement balance as of {getDayMonthYear(endTime)}: </Text>
					</StyledCol>
					<StyledCol md={5}>
						<Text>
							{commaSeparating(
								balance + getInterestEarned(balance, term, interestRate),
								3
							)}{' '}
							VND
						</Text>
					</StyledCol>
				</StyledRow>
			</CompleteInfo>
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
						name='Complete'
						fluid
						onClick={handleComplete}
						loading={loading}
						disabled={loading}
					/>
				</DeleteWrapper>
			</ButtonWrapper>
		</Template>
	)
}
CompleteDepositModal.defaultProps = {
	id: '',
	onClose: (f) => f,
	onSuccess: (f) => f,
	onFailure: (f) => f,
}
CompleteDepositModal.propTypes = {
	id: PropTypes.string,
	onClose: PropTypes.func,
	onSuccess: PropTypes.func,
	onFailure: PropTypes.func,
}
export default CompleteDepositModal
