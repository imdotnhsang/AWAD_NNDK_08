import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import RadioForm from '../../common/presentational/Form.Radio'
import Input from '../../common/presentational/Input'
import Banner from '../../common/presentational/Banner.Step'
import Button from '../../common/presentational/Button'
import Table from '../../1.Receivers/presentational/Table.Min.Select'
import SearchButton from '../../common/presentational/Button.Search'
import Display from '../../1.Receivers/presentational/Display'
import Select from '../../common/container/Select.Bank'
import api from '../../../api/api'

const FormWrapper = styled.div`
  width: 100%;
  margin: 30px 0;
`
const Error = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: ${(props) => props.theme.yellow};
  margin-top: 30px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
  & > *:first-child {
    margin-right: 10px;
  }
  & > *:last-child {
    margin-left: 10px;
  }
`
const SearchWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  & > *:last-child {
    margin-left: 30px;
  }
  margin-bottom: 24px;
`
const SelectWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
`
class Step2Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      existedReceiver: {
        id: '',
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      newReceiver: {
        id: '',
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      tab2Input: '',
      tab: 1,
      error: '',
      errorSelect: '',
      loading: false,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
    this.handleTab2Input = this.handleTab2Input.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleRadioForm = this.handleRadioForm.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount() {
    const {
      value,
      receiversData,
    } = this.props
    if (value.accountID) {
      const isExisted = receiversData.findIndex((receiver) => (
        receiver.accountID === value.accountID && receiver.bankID === value.bankID
      )) !== -1
      if (isExisted) {
        this.setState({
          tab: 1,
          existedReceiver: value,
        })
      } else {
        this.setState({
          tab: 2,
          newReceiver: value,
        })
      }
    }
  }

  handleOnChange(value) {
    const { onChange } = this.props
    onChange({
      receiver: value,
    })
  }

  handleTableChange(value) {
    this.setState({
      existedReceiver: value,
    })
    this.handleOnChange(value)
  }

  handleTab2Input(event) {
    this.setState({
      tab2Input: event.target.value.replace(/\D/g, ''),
      error: '',
    })
  }

  handleSelect(value) {
    this.setState((prevState) => ({
      newReceiver: {
        ...prevState.newReceiver,
        bankID: value,
        errorSelect: '',
      },
    }))
  }

  async handleSearch() {
    this.setState({
      errorSelect: '',
      error: '',
    })
    const { tab2Input, newReceiver } = this.state
    const { bankID } = newReceiver
    // eslint-disable-next-line no-restricted-globals
    if (tab2Input.length !== 16 && !isNaN(tab2Input)) {
      this.setState({
        error: 'Invalid value',
      })
      return
    }
    if (!bankID) {
      this.setState({
        errorSelect: 'Please choose a bank',
      })
      return
    }
    this.setState({
      loading: true,
      error: '',
    })

    const data = {
      accountID: tab2Input,
      bankID,
    }
    const res = await api.get('/banks/account', data)
    if (res.error) {
      const { error } = res
      this.setState({
        error,
        loading: false,
      })
    } else {
      const { valid } = res
      if (valid) {
        this.setState({
          loading: false,
          newReceiver: res.data,
        })
        this.handleOnChange(res.data)
      } else {
        this.setState({
          error: 'Invalid card number',
          loading: false,
        })
      }
    }
  }

  handleRadioForm(value) {
    this.setState({
      tab: value,
      error: '',
    })
    const {
      existedReceiver,
      newReceiver,
    } = this.state
    if (value === 1) {
      this.handleOnChange(existedReceiver)
    } else {
      this.handleOnChange(newReceiver)
    }
  }

  handleNext() {
    const {
      tab,
      existedReceiver,
      newReceiver,
    } = this.state

    const {
      onNext,
    } = this.props


    if (tab === 1) {
      if (existedReceiver.accountID) onNext()
      else {
        this.setState({
          error: 'Please choose a receiver',
        })
      }
    } else if (newReceiver.accountID) {
      onNext()
    } else {
      this.setState({
        error: 'Please choose a receiver',
      })
    }
  }

  render() {
    const formData = [
      { id: 1, value: 1, label: 'Existed receiver' },
      { id: 2, value: 2, label: 'New receiver' },
    ]

    const {
      existedReceiver,
      tab2Input,
      newReceiver,
      loading,
      tab,
      error,
      errorSelect,
    } = this.state

    const {
      onBack,
      //
      receiversData,
    } = this.props
    return (
      <>
        <Banner
          index={2}
          name="Receiver"
          description="Provide the information of the receiver"
        />
        <FormWrapper>
          <RadioForm
            data={formData}
            value={tab}
            onChange={this.handleRadioForm}
          />
        </FormWrapper>
        {
          tab === 1
            ? (
              <>
                {/* <div style={{ height: '1px', width: '100%' }} /> */}
                <Table
                  data={receiversData}
                  value={existedReceiver}
                  onChange={this.handleTableChange}
                />
                {error && <Error>{error}</Error> }
              </>
            )
            : (
              <>
                <SelectWrapper>
                  <Select
                    associated
                    value={newReceiver.bankID}
                    error={errorSelect}
                    onChange={this.handleSelect}
                  />
                </SelectWrapper>
                <SearchWrapper>
                  <Input
                    label="Card number"
                    placeholder="Enter the receiver's card number"
                    value={tab2Input || newReceiver.accountID}
                    error={error}
                    onChange={this.handleTab2Input}
                  />
                  <SearchButton
                    onClick={this.handleSearch}
                  />
                </SearchWrapper>
                <Display
                  name={newReceiver.accountName}
                  bankName={newReceiver.bankName}
                  cardNumber={newReceiver.accountID}
                  loading={loading}
                />
              </>
            )
        }
        <ButtonWrapper>
          <Button
            fluid
            secondary
            name="Back"
            onClick={onBack}
          />
          <Button
            fluid
            name="Next"
            onClick={this.handleNext}
          />
        </ButtonWrapper>
      </>
    )
  }
}

Step2Content.defaultProps = {
  value: {
    accountName: '',
    accountID: '',
    bankID: '',
    bankName: '',
  },
  onChange: (f) => f,
  onBack: (f) => f,
  onNext: (f) => f,
  //
  receiversData: [],
}
Step2Content.propTypes = {
  value: PropTypes.shape({
    accountName: PropTypes.string,
    accountID: PropTypes.string,
    bankID: PropTypes.string,
    bankName: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onBack: PropTypes.func,
  onNext: PropTypes.func,
  //
  receiversData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    nickname: PropTypes.string,
    accountID: PropTypes.string,
    bankName: PropTypes.string,
  })),
}

const mapStateToProps = (state) => ({
  receiversData: state.receivers.receivers.filter((receiver) => receiver.bankName !== 'EIGHT.Bank').map((receiver) => ({
    accountName: receiver.nickname,
    accountID: receiver.accountID,
    bankID: receiver.bankID,
    bankName: receiver.bankName,
  })),
})
export default connect(
  mapStateToProps,
)(Step2Content)
