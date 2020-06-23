import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from '../../common/presentational/Button'
import Template from '../../common/presentational/Template.Modal'
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
	margin-top: 32px;
`
const OkayWrapper = styled.div`
	width: 100%;
`
const InfoDeposit = styled.div`
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
const InfoDepositModal = ({
	id,
	term,
	endTime,
	balance,
	interestRate,
	createdAt,
	onClose,
}) => {
	return (
		<Template name='Deposit Information' onClose={onClose}>
			<InfoDeposit>
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
			</InfoDeposit>
			<ButtonWrapper>
				<OkayWrapper>
					<Button name='OK' fluid onClick={onClose} />
				</OkayWrapper>
			</ButtonWrapper>
		</Template>
	)
}
InfoDepositModal.defaultProps = {
	id: '',
	onClose: (f) => f,
}
InfoDepositModal.propTypes = {
	id: PropTypes.string,
	onClose: PropTypes.func,
}
export default InfoDepositModal
