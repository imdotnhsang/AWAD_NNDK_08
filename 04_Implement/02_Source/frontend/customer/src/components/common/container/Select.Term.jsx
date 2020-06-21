import React from 'react'
import PropTypes from 'prop-types'
import Select from '../presentational/Select2'

const TermSelect = ({
	value,
	disabled,
	error,
	onChange,
	//
	loading,
	data,
	fetchingError,
}) => {
	return (
		<Select
			label='Term'
			placeholder='Choose a term'
			disabled={disabled}
			loading={loading}
			value={value}
			data={data}
			error={error || fetchingError}
			onChange={onChange}
		/>
	)
}
TermSelect.defaultProps = {
	value: '',
	data: [
		{
			textTerm: '01 Week',
			textInterestRate: '0.2%',
			valueTerm: 604800000,
			valueInterestRate: 0.002,
		},
		{
			textTerm: '02 Weeks',
			textInterestRate: '0.2%',
			valueTerm: 604800000 * 2,
			valueInterestRate: 0.002,
		},
		{
			textTerm: '03 Weeks',
			textInterestRate: '0.2%',
			valueTerm: 604800000 * 3,
			valueInterestRate: 0.002,
		},
		{
			textTerm: '01 Month',
			textInterestRate: '4.2 %',
			valueTerm: 604800000 * 4,
			valueInterestRate: 0.042,
		},
		{
			textTerm: '02 Months',
			textInterestRate: '4.2%',
			valueTerm: 604800000 * 8,
			valueInterestRate: 0.042,
		},
		{
			textTerm: '03 Months',
			textInterestRate: '4.25%',
			valueTerm: 604800000 * 12,
			valueInterestRate: 0.0425,
		},
		{
			textTerm: '04 Months',
			textInterestRate: '4.25%',
			valueTerm: 604800000 * 16,
			valueInterestRate: 0.0425,
		},
		{
			textTerm: '05 Months',
			textInterestRate: '4.25%',
			valueTerm: 604800000 * 20,
			valueInterestRate: 0.0425,
		},
		{
			textTerm: '06 Months',
			textInterestRate: '5.4%',
			valueTerm: 604800000 * 24,
			valueInterestRate: 0.054,
		},
		{
			textTerm: '07 Months',
			textInterestRate: '5.4%',
			valueTerm: 604800000 * 28,
			valueInterestRate: 0.054,
		},
		{
			textTerm: '08 Months',
			textInterestRate: '5.4%',
			valueTerm: 604800000 * 32,
			valueInterestRate: 0.054,
		},
		{
			textTerm: '09 Months',
			textInterestRate: '5.6%',
			valueTerm: 604800000 * 36,
			valueInterestRate: 0.056,
		},
		{
			textTerm: '10 Months',
			textInterestRate: '5.6%',
			valueTerm: 604800000 * 40,
			valueInterestRate: 0.056,
		},
		{
			textTerm: '11 Months',
			textInterestRate: '5.6%',
			valueTerm: 604800000 * 44,
			valueInterestRate: 0.056,
		},
		{
			textTerm: '12 Months',
			textInterestRate: '6.7%',
			valueTerm: 604800000 * 48,
			valueInterestRate: 0.067,
		},
		{
			textTerm: '15 Months',
			textInterestRate: '6.7%',
			valueTerm: 604800000 * 60,
			valueInterestRate: 0.067,
		},
		{
			textTerm: '18 Months',
			textInterestRate: '6.7%',
			valueTerm: 604800000 * 72,
			valueInterestRate: 0.067,
		},
		{
			textTerm: '24 Months',
			textInterestRate: '6.7%',
			valueTerm: 604800000 * 96,
			valueInterestRate: 0.067,
		},
		{
			textTerm: '36 Months',
			textInterestRate: '6.7%',
			valueTerm: 604800000 * 144,
			valueInterestRate: 0.067,
		},
	],
	error: '',
}
TermSelect.propTypes = {
	// value: PropTypes.string,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			// text: PropTypes.string,
			// value: PropTypes.string,
		})
	),
	error: PropTypes.string,
}

export default TermSelect
