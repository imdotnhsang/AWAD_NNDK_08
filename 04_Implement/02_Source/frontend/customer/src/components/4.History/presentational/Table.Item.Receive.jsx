import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import {
	spaceSeparating,
	commaSeparating,
	resolveTagFromProps,
	milisecondToDatetime,
	aliasFullname,
} from '../../../utils/utils'

const styleModifiers = ['lastItem']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	width: 100%;
	padding: 24px 0;
	background-color: ${(props) => props.theme.blackDark};
	margin-bottom: ${(props) => !props.lastItem && '20px'};
`
const StyledCol = styled(Col)`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	word-wrap: break-word;
	text-align: justify;
`
const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 15px;
	color: #fff;
`
const InfoWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-item: flex-start;
	& > *:first-child {
		// margin-bottom: 10px;
	}
`
const ActionButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
	opacity: ${(props) => props.disabled && '0.5'};
`
const TableItem = ({
	index,
	accountID,
	accountName,
	amount,
	bankName,
	date,
	message,
	lastItem,
	onOpenMessageModal,
}) => (
	<Wrapper lastItem={lastItem}>
		<Row>
			<StyledCol md={1}>
				<Text>{index}</Text>
			</StyledCol>
			<StyledCol md={3}>
				<InfoWrapper>
					<Text>{aliasFullname(accountName)}</Text>
					<Text>{spaceSeparating(accountID, 4)}</Text>
				</InfoWrapper>
			</StyledCol>
			<StyledCol md={3}>
				<Text>
					{/* <sup style={{ fontSize: '11px', paddingRight: '2px' }}>₫</sup> */}
					+ {commaSeparating(amount, 3)}
				</Text>
			</StyledCol>
			<StyledCol md={2}>
				<Text>{bankName}</Text>
			</StyledCol>
			<StyledCol md={2}>
				<Text>{milisecondToDatetime(date)}</Text>
			</StyledCol>
			<StyledCol md={1}>
				<ActionButton
					onClick={() => {
						onOpenMessageModal(message)
					}}
					type='button'
					disabled={message ? (message.length !== 0 ? false : true) : true}
				>
					<svg
						width='18'
						height='18'
						viewBox='0 0 20 20'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M18 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V20L4 16H18C18.5304 16 19.0391 15.7893 19.4142 15.4142C19.7893 15.0391 20 14.5304 20 14V2C20 1.46957 19.7893 0.960859 19.4142 0.585786C19.0391 0.210714 18.5304 0 18 0ZM4 7H16V9H4V7ZM12 12H4V10H12V12ZM16 6H4V4H16'
							fill='#EF230C'
						/>
					</svg>
				</ActionButton>
			</StyledCol>
		</Row>
	</Wrapper>
)
TableItem.defaultProps = {
	index: 0,
	accountID: '',
	accountName: '',
	amount: 0,
	bankName: '',
	date: 0,
	lastItem: false,
}
TableItem.propTypes = {
	index: PropTypes.number,
	accountID: PropTypes.string,
	accountName: PropTypes.string,
	amount: PropTypes.number,
	bankName: PropTypes.string,
	date: PropTypes.number,
	lastItem: PropTypes.bool,
}
export default TableItem
