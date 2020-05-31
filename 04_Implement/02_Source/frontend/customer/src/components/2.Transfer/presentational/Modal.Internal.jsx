import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'
import Step1 from '../container/Content.Step1'
import Step2 from '../container/Content.Step2.Internal'
import Step3 from '../container/Content.Step3'
import Step4 from './Content.Step4'
import Step5 from './Content.Step5'


class InternalModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      senderAccountID: '',
      receiver: {
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      amount: 50000,
      detail: '',
      chargedBySender: true,
      step: 1,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleTransfer = this.handleTransfer.bind(this)
  }

  handleOnChange(value) {
    this.setState({
      ...value,
    })
  }

  handleNext() {
    this.setState((prevState) => ({
      step: prevState.step + 1,
    }))
  }

  handleBack() {
    this.setState((prevState) => ({
      step: prevState.step - 1,
    }))
  }

  async handleTransfer() {
    const {
      onSuccess,
      onFailure,
      onClose,
      onProcessing,
    } = this.props
    onClose()
    const {
      senderAccountID,
      receiver,
      amount,
      detail,
      chargedBySender,
    } = this.state
    const data = {
      senderAccountID,
      receiverAccountID: receiver.accountID,
      receiverBankID: receiver.bankID,
      amount,
      detail,
      chargedBySender,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    onProcessing()
    const res = await api.post('/transfer', data, config)
    if (res.error) {
      const { error } = res
      onFailure(error)
    } else {
      onSuccess()
    }
  }

  render() {
    const {
      step,
      senderAccountID,
      receiver,
      amount,
      detail,
      chargedBySender,
    } = this.state
    const {
      show,
      onClose,
    } = this.props

    return (
      <Template
        width={604}
        name="Internal transfer"
        show={show}
        onClose={onClose}
      >
        {
          [
            null,
            <Step1
              value={senderAccountID}
              onChange={this.handleOnChange}
              onClose={onClose}
              onNext={this.handleNext}
            />,
            <Step2
              value={receiver}
              onChange={this.handleOnChange}
              onBack={this.handleBack}
              onNext={this.handleNext}
            />,
            <Step3
              value={{
                amount,
                detail,
                chargedBySender,
                senderAccountID,
              }}
              onChange={this.handleOnChange}
              onBack={this.handleBack}
              onNext={this.handleNext}
            />,
            <Step4
              value={{
                senderAccountID,
                receiver,
                amount,
                chargedBySender,
              }}
              onBack={this.handleBack}
              onNext={this.handleNext}
            />,
            <Step5
              onTransfer={this.handleTransfer}
            />,
          ][step] || null
        }
      </Template>
    )
  }
}
InternalModal.defaultProps = {
  show: true,
  onClose: (f) => f,
  onSuccess: (f) => f,
  onFailure: (f) => f,
  onProcessing: (f) => f,
}
InternalModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  onProcessing: PropTypes.func,
}
export default InternalModal
