import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import Loading from '../../common/presentational/Loading.Table.Min'
import { resolveTagFromProps, commaSeparating } from '../../../utils/utils'

const styleModifiers = ['loading']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	background-color: ${(props) => props.theme.blackDark};
	width: 100%;
	padding: 36px 16px;
	box-sizing: border-box;
	opacity: ${(props) => props.loading && '0.5'};
`
const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
`
const StyledRow = styled(Row)`
	margin-top: 16px;
	&:first-child {
		margin-top: 0px;
	}
`
const Display = ({ from, to, amount, chargedBySender, loading, detail }) => (
	<div style={{ position: 'relative', width: '100%' }}>
		<Wrapper loading={loading}>
			<StyledRow>
				<Col lg={3}>
					<Text>From:</Text>
				</Col>
				<Col lg={9}>
					<Text>{from}</Text>
				</Col>
			</StyledRow>
			<StyledRow>
				<Col lg={3}>
					<Text>To:</Text>
				</Col>
				<Col lg={9}>
					<Text>{to}</Text>
				</Col>
			</StyledRow>
			<StyledRow>
				<Col lg={3}>
					<Text>Total amount:</Text>
				</Col>
				<Col lg={9}>
					<Text>{commaSeparating(amount, 3)} VND</Text>
				</Col>
			</StyledRow>
			<StyledRow>
				<Col lg={3}>
					<Text>Message:</Text>
				</Col>
				<Col lg={9}>
					<Text>{detail || '(empty)'}</Text>
				</Col>
			</StyledRow>
			<StyledRow>
				<Col lg={3}>
					<Text>Payment fee:</Text>
				</Col>
				<Col lg={9}>
					<Text>
						{chargedBySender
							? 'Charged by the sender (you)'
							: 'Charged by the receiver'}
					</Text>
				</Col>
			</StyledRow>
		</Wrapper>
		{loading && <Loading />}
	</div>
)
Display.defaultProps = {
	from: '',
	to: '',
	amount: 50000,
	chargedBySender: true,
	loading: false,
}
Display.propTypes = {
	from: PropTypes.string,
	to: PropTypes.string,
	amount: PropTypes.number,
	chargedBySender: PropTypes.bool,
	loading: PropTypes.bool,
}
export default Display
