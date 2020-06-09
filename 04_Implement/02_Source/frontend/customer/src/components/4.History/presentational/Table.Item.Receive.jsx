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

const TableItem = ({
	index,
	accountID,
	accountName,
	amount,
	bankName,
	date,
	lastItem,
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
					{' '}
					<sup style={{ fontSize: '11px', paddingRight: '2px' }}>₫</sup>
					{commaSeparating(amount, 3)}
				</Text>
			</StyledCol>
			<StyledCol md={2}>
				<Text>{bankName}</Text>
			</StyledCol>
			<StyledCol md={3}>
				<Text>{milisecondToDatetime(date)}</Text>
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
