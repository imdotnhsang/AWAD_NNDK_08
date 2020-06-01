import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from '../../common/presentational/Input'
import TextArea from '../../common/presentational/TextArea'
import api from '../../../api/api'
import AddButton from '../../common/presentational/Button.Loading'
import BackButton from '../../common/presentational/Button'
import Banner from '../../common/presentational/Banner.Step'
import {
  invalidateDebtsDataCreatedByYou,
  fecthDebtsDataCreatedByYouIfNeeded,
} from '../../../actions/debts'

const InputWrapper = styled.div`
  width: 100%;
  margin-top: 30px;
`
const TextAreaWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
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
const Error = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: ${(props) => props.theme.yellow};
  margin-top: 30px;
`

class Step2AddDebtContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 50000,
      error: '',
      addError: '',
      loading: false,
    }
    this.handleAmount = this.handleAmount.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
  }

  componentDidMount() {
    const {
      value,
    } = this.props
    this.setState({
      amount: value.amount,
    })
  }

  handleAmount(event) {
    const value = parseInt(event.target.value.replace(/\D/g, '') || 0, 10)
    if (value < 50000) {
      this.setState({
        amount: value,
        error: 'Value must be bigger than 50000',
      })
    } else {
      const { onChange } = this.props
      this.setState({
        amount: value,
        error: '',
      })
      onChange({
        amount: value,
      })
    }
  }

  handleMessage(event) {
    const {
      onChange,
    } = this.props
    onChange({
      message: event.target.value,
    })
  }

  async handleAdd() {
    const {
      error,
    } = this.state

    const {
      value,
      onClose,
      //
      invalidateCreatedByYou,
      refreshCreatedByYou,
    } = this.props
    if (!error) {
      this.setState({
        addError: '',
        loading: true,
      })

      const { borrowerID, amount, message } = value
      const data = {
        borrowerID,
        amount,
        message,
      }
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
      const res = await api.post('/debts/create', data, config)
      if (res.error) {
        this.setState({
          addError: res.error,
          loading: false,
        })
      } else {
        onClose()
        invalidateCreatedByYou()
        refreshCreatedByYou()
      }
    }
  }

  render() {
    const {
      amount,
      error,
      addError,
      loading,
    } = this.state
    const {
      value,
      onBack,
    } = this.props
    const { message } = value

    return (
      <>
        <Banner
          index={2}
          name="Debt amount"
          description="Provide the details of the debt amount"
        />
        <InputWrapper>
          <Input
            label="Total amount:"
            placeholder="Enter the total amount of money"
            value={amount}
            onChange={this.handleAmount}
            error={error}
          />
        </InputWrapper>
        <TextAreaWrapper>
          <TextArea
            label="Description:"
            placeholder="Enter some descriptions for the debt"
            value={message}
            onChange={this.handleMessage}
          />
        </TextAreaWrapper>
        {addError && <Error>{addError}</Error>}
        <ButtonWrapper>
          <BackButton
            fluid
            secondary
            name="Back"
            onClick={onBack}
          />
          <AddButton
            fluid
            name="Finish"
            onClick={this.handleAdd}
            loading={loading}
          />
        </ButtonWrapper>
      </>
    )
  }
}
Step2AddDebtContent.defaultProps = {
  value: {
    borrowerID: '',
    amount: 0,
    message: '',
  },
  onChange: (f) => f,
  onBack: (f) => f,
  onClose: (f) => f,
  //
  invalidateCreatedByYou: (f) => f,
  refreshCreatedByYou: (f) => f,
}
Step2AddDebtContent.propTypes = {
  value: PropTypes.shape({
    borrowerID: PropTypes.string,
    amount: PropTypes.number,
    message: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onBack: PropTypes.func,
  onClose: PropTypes.func,
  //
  invalidateCreatedByYou: PropTypes.func,
  refreshCreatedByYou: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  invalidateCreatedByYou: () => dispatch(invalidateDebtsDataCreatedByYou()),
  refreshCreatedByYou: () => dispatch(fecthDebtsDataCreatedByYouIfNeeded()),
})
export default connect(
  null,
  mapDispatchToProps,
)(Step2AddDebtContent)
