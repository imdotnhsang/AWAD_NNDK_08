import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Display from './Display'
import BackButton from '../../common/presentational/Button'
import ConfirmButton from '../../common/presentational/Button.Loading'
import Banner from '../../common/presentational/Banner.Step'
import {
  getNameFromStorage,
  spaceSeparating,
  getEmailFromStorage,
} from '../../../utils/utils'
import api from '../../../api/api'

const Instruction = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  margin: 30px 0;
  line-height: 16px;
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
  line-height: 16px;
`

class Step4Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      error: '',
    }
    this.handleConfirm = this.handleConfirm.bind(this)
  }

  async handleConfirm() {
    this.setState({
      loading: true,
      error: '',
    })
    const {
      onNext,
    } = this.props
    const data = {
      email: getEmailFromStorage(),
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const res = await api.post('/otp/send', data, config)
    if (res.error) {
      const { error } = res
      this.setState({
        loading: false,
        error,
      })
    } else {
      this.setState({
        loading: false,
      })
      onNext()
    }
  }

  render() {
    const {
      loading,
      error,
    } = this.state
    const {
      value,
      onBack,
    } = this.props
    const {
      senderAccountID,
      receiver,
      amount,
      chargedBySender,
    } = value
    const from = `${spaceSeparating(senderAccountID, 4)} / ${getNameFromStorage()} / EIGHT.Bank`
    const to = `${spaceSeparating(receiver.accountID, 4)} / ${receiver.accountName} / ${receiver.bankName}`
    return (
      <>
        <Banner
          index={4}
          name="Confirm"
          description="Re-check the payment details"
        />
        <Instruction>
          Your detailed payment information is below
          <br />
          Please check carefully before finishing the payment process
        </Instruction>
        <Display
          from={from}
          to={to}
          amount={amount}
          chargedBySender={chargedBySender}
        />
        {error && <Error>{error}</Error>}
        <ButtonWrapper>
          <BackButton
            fluid
            secondary
            name="Back"
            onClick={onBack}
          />
          <ConfirmButton
            fluid
            name="Confirm"
            loading={loading}
            onClick={this.handleConfirm}
          />
        </ButtonWrapper>
      </>
    )
  }
}

Step4Content.defaultProps = {
  value: {
    senderAccountID: '',
    receiver: {
      accountName: '',
      accountID: '',
      bankID: '',
      bankName: '',
    },
    amount: 50000,
    chargedBySender: true,
  },
  onNext: (f) => f,
  onBack: (f) => f,
}
Step4Content.propTypes = {
  value: PropTypes.shape({
    senderAccountID: PropTypes.string,
    receiver: {
      accountName: PropTypes.string,
      accountID: PropTypes.string,
      bankID: PropTypes.string,
      bankName: PropTypes.string,
    },
    amount: PropTypes.number,
    chargedBySender: PropTypes.bool,
  }),
  onNext: PropTypes.func,
  onBack: PropTypes.func,
}

export default Step4Content
