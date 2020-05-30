import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Template from '../../common/presentational/Template.Modal'
import Step1 from './Content.Step1'
import Step2 from './Content.Step2'


class InternalModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      senderAccoundID: '',
      receiver: {
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      amount: 0,
      detail: '',
      step: 1,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
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

  render() {
    const {
      step,
      senderAccoundID,
      receiverAccountID,
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
              value={senderAccoundID}
              onChange={this.handleOnChange}
              onClose={onClose}
              onNext={this.handleNext}
            />,
            <Step2
              value={receiverAccountID}
              onChange={this.handleOnChange}
              onBack={this.handleBack}
              onNext={this.handleNext}
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
}
InternalModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
}
export default InternalModal
