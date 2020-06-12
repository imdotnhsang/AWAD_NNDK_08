import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import Template from '../../common/presentational/Template.Modal'
import Button from '../../common/presentational/Button'
import Status from './Status.Debt'
import { DebtStatus } from '../../../constants/constants'
import {
	commaSeparating,
	spaceSeparating,
	aliasFullname,
} from '../../../utils/utils'

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
const ReasonTitle = styled.div`
  width: 100%;
  vertical-align: middle
  text-align: justify;
  margin-bottom: 12px;
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

const InfoModal = ({ show, data, onClose }) => {
	const {
		lender_fullname: lenderName,
		lender_default_account: lenderID,
		borrower_fullname: borrowerName,
		borrower_default_account: borrowerID,
		debt_status: status,
		debt_amount: amount,
		debt_message: message,
		debt_reason_cancel: reasonOfCancel,
		cancelled_by_fullname: cancelledByFullname,
		cancelled_by_id: cancelledById,
	} = data
	return (
		<Template show={show} name='Debt details' onClose={onClose} width={610}>
			<Wrapper>
				<StyledRow>
					<StyledCol md={2}>
						<Text>Lender:</Text>
					</StyledCol>
					<StyledCol md={10}>
						<Text>{`${aliasFullname(lenderName)} / ${spaceSeparating(
							lenderID,
							4
						)} / Eight Bank`}</Text>
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
						)} / Eight Bank`}</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={2}>
						<Text>Amount:</Text>
					</StyledCol>
					<StyledCol md={10}>
						<Text>{`${commaSeparating(amount, 3)} VND`}</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={2}>
						<Text>Message:</Text>
					</StyledCol>
					<StyledCol md={10}>
						<Text>{message || '(empty)'}</Text>
					</StyledCol>
				</StyledRow>
				<StyledRow>
					<StyledCol md={2}>
						<Text>Status:</Text>
					</StyledCol>
					<StyledCol md={10}>
						<Status status={status} />
					</StyledCol>
				</StyledRow>
				{status === DebtStatus.CANCELLED && (
					<>
						<StyledRow>
							<ReasonTitle>
								<Text>Reason of cancellation:</Text>
							</ReasonTitle>
							<StyledCol md={12}>
								<Text>{reasonOfCancel || '(empty)'}</Text>
							</StyledCol>
						</StyledRow>
						<StyledRow>
							<StyledCol md={2}>
								<Text>Cancelled by:</Text>
							</StyledCol>
							<StyledCol md={10}>
								<Text>
									{aliasFullname(cancelledByFullname)}{' '}
									{cancelledById === lenderID ? '(Lender)' : '(Borrower)'}
								</Text>
							</StyledCol>
						</StyledRow>
					</>
				)}
				<Button name='OK' fluid onClick={onClose} />
			</Wrapper>
		</Template>
	)
}
InfoModal.defaultProps = {
	show: false,
	data: {
		id: '',
		lenderName: '',
		lenderID: '',
		borrowerName: '',
		borrowerID: '',
		status: DebtStatus.PAID,
		amount: 0,
		message: '',
		reasonOfCancel: '',
	},
	onClose: (f) => f,
}
InfoModal.propTypes = {
	show: PropTypes.bool,
	data: PropTypes.shape({
		id: PropTypes.string,
		lenderName: PropTypes.string,
		lenderID: PropTypes.string,
		borrowerName: PropTypes.string,
		borrowerID: PropTypes.string,
		status: PropTypes.oneOf([
			DebtStatus.UNPAID,
			DebtStatus.PAID,
			DebtStatus.CANCELLED,
		]),
		amount: PropTypes.number,
		message: PropTypes.string,
		reasonOfCancel: PropTypes.string,
	}),
	onClose: PropTypes.func,
}
export default InfoModal
