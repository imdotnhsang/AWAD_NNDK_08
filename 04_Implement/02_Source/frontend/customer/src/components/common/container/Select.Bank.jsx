import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from '../presentational/Select'
import { fetchBanksDataIfNeeded } from '../../../actions/banks'

const BankSelect = ({
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
  useEffect(() => {
    onFetchData()
  }, [])
  return (
    <Select
      label="Bank"
      placeholder="Choose a bank"
      disabled={disabled}
      loading={loading}
      value={value}
      data={data}
      error={error || fetchingError}
      onChange={onChange}
    />
  )
}
BankSelect.defaultProps = {
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
BankSelect.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
  })),
  error: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  associated: PropTypes.bool,
  fetchingError: PropTypes.string,
  onChange: PropTypes.func,
  onFetchData: PropTypes.func,
}
const mapStateToProps = (state, ownProps) => {
  const { loading, banks, error } = state.banks
  let data = banks.map((bank) => ({ text: bank.name, value: bank.id }))
  if (ownProps.associated) data = data.filter((e) => e.text !== 'EIGHT.Bank')
  return ({
    loading,
    data,
    fetchingError: error,
  })
}
const mapDispatchToProps = (dispatch) => ({
  onFetchData: () => dispatch(fetchBanksDataIfNeeded()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BankSelect)
