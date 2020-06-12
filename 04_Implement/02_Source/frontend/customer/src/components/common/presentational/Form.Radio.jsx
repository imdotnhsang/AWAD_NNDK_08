import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Item from './Input.Radio'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['vertical']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	display: flex;
	flex-direction: ${(props) => (props.vertical ? 'column' : 'row')};
	justify-content: flex-start;
	align-items: ${(props) => (props.vertical ? 'flex-start' : 'center')};
	& > * {
		margin-left: ${(props) => !props.vertical && '60px'};
		margin-top: ${(props) => props.vertical && '16px'};
	}
	& > *:first-child {
		margin-left: 0;
		margin-top: 0;
	}
`
const RadioForm = ({ data, vertical, value, onChange }) => (
	<Wrapper vertical={vertical}>
		{data.map((item) => (
			<Item
				key={item.id}
				label={item.label}
				selected={value === item.value}
				onClick={() => onChange(item.value)}
			/>
		))}
	</Wrapper>
)
RadioForm.defaultProps = {
	data: [],
	vertical: false,
	value: '',
	onChange: (f) => f,
}
RadioForm.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			value: PropTypes.oneOfType([
				PropTypes.string,
				PropTypes.number,
				PropTypes.bool,
			]),
			label: PropTypes.string,
		})
	),
	vertical: PropTypes.bool,
	value: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.bool,
	]),
	onChange: PropTypes.func,
}

export default RadioForm
