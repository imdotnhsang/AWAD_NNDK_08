import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from '../presentational/Select'
import { fetchBanksDataIfNeeded } from '../../../actions/banks'

const TermSelect = ({
	value,
	disabled,
	error,
	onChange,
	//
	loading,
	data,
	fetchingError,
	onFetchData,
}) => {
	// useEffect(() => {
	// 	onFetchData()
	// }, [onFetchData])
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
	loading: false,
	value: '',
	disabled: false,
	data: [],
	error: '',
	associated: false,
	fetchingError: '',
	onChange: (f) => f,
	onFetchData: (f) => f,
}
TermSelect.propTypes = {
	loading: PropTypes.bool,
	value: PropTypes.string,
	disabled: PropTypes.bool,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			text: PropTypes.string,
			value: PropTypes.string,
		})
	),
	error: PropTypes.string,
	// eslint-disable-next-line react/no-unused-prop-types
	associated: PropTypes.bool,
	fetchingError: PropTypes.string,
	onChange: PropTypes.func,
	onFetchData: PropTypes.func,
}
const mapStateToProps = (state, ownProps) => {
	const { loading,  error } = state.banks
	let data = [
		{
			text: '01 Week',
			value: 604800000,
		},
		{
			text: '02 Week',
			value: 604800000 * 2,
		},
	]
	return {
		loading,
		data,
		fetchingError: error,
	}
}
const mapDispatchToProps = (dispatch) => ({
	onFetchData: () => dispatch(fetchBanksDataIfNeeded()),
})
export default connect(mapStateToProps, mapDispatchToProps)(TermSelect)
