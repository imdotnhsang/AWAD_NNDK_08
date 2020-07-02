import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import Template from '../../common/presentational/Template.Modal'
import Button from '../../common/presentational/Button'
import { aliasFullname } from '../../../utils/utils'
const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	padding-bottom: 18px;
`
const StyledRow = styled(Row)`
	width: 100%;
	margin: 0;
	justify-content: center;
`
const StyledCol = styled(Col)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: flex-start;
	word-wrap: break-word;
	text-align: center;
	padding: 0;
`
const InfoMessage = styled.div`
	background: #111;
	width: 100%;
	padding: 30px 16px 12px 16px;
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
	const {} = data
	return (
		<Template show={show} name='Transaction messages' onClose={onClose}>
			<Wrapper>
				<InfoMessage>
					<StyledRow>
						<StyledCol md={10}>
							<Text>{aliasFullname(data.message)}</Text>
						</StyledCol>
					</StyledRow>
				</InfoMessage>
				<Button name='OK' fluid onClick={onClose} />
			</Wrapper>
		</Template>
	)
}
InfoModal.defaultProps = {
	show: false,
	data: {
		id: '',
	},
	onClose: (f) => f,
}
InfoModal.propTypes = {
	show: PropTypes.bool,
	data: PropTypes.shape({
		message: PropTypes.string,
	}),
	onClose: PropTypes.func,
}
export default InfoModal
