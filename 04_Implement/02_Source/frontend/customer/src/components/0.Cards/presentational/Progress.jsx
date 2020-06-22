import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps, getPercentOfProgress } from '../../../utils/utils'

const styleModifiers = ['service', 'loading', 'empty']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	width: 275px;
	border-radius: 20px;
	background: linear-gradient(180deg, #26292e 0%, #16181c 100%);
	opacity: ${(props) => (!(props.empty || props.loading) ? 1 : 0)};
	position: relative;
	height: 20px;
`
const Complete = styled(resolveTagFromProps(styleModifiers, 'div'))`
	background-image: ${(props) => {
		if (props.empty || props.loading) return 'none'
		return props.service === 'MASTERCARD'
			? 'linear-gradient(134.46deg, #26292E 5.31%, #EF230C 70.45%)'
			: 'linear-gradient(134.46deg, #26292E 5.31%, #2C41FF 70.45%)'
	}};
	width: ${(props) => props.complete};
	height: 20px;
	position: absolute;
	border-radius: 20px;
`
const BorderComplete = styled.div`
	width: 275px;
	height: 20px;
	position: absolute;
	border-radius: 20px;
	overflow: hidden;
`
const Text = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	position: absolute;
	color: #fff;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`
const Progress = ({ service, term, endTime, loading, empty }) => (
	<Wrapper loading={loading} empty={empty}>
		{!(loading || empty) && (
			<>
				<BorderComplete>
					<Complete
						service={service}
						complete={
							Date.now() >= endTime
								? '100%'
								: getPercentOfProgress(term, Date.now(), endTime)
						}
					/>
				</BorderComplete>
				<Text>
					{Date.now() >= endTime
						? '100%'
						: getPercentOfProgress(term, Date.now(), endTime)}
				</Text>
			</>
		)}
	</Wrapper>
)

Progress.defaultProps = {
	service: 'MASTERCARD',
	complete: '0%',
	loading: false,
	empty: false,
}
Progress.propTypes = {
	service: PropTypes.string,
	complete: PropTypes.string,
	loading: PropTypes.bool,
	empty: PropTypes.bool,
}
export default Progress
