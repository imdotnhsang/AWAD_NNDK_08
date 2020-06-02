import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Template from '../../common/presentational/Template.Modal'
import Step1 from '../container/Content.Step1.AddDebt'
import Step2 from '../container/Content.Step2.AddDebt'

class AddDebtModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      borrower: {
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      amount: 50000,
      message: '',
      step: 0,
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
      borrower,
      amount,
      message,
    } = this.state

    const {
      show,
      onClose,
    } = this.props

    return (
      <Template
        show={show}
        onClose={onClose}
        name="Add debt"
        width={604}
      >
        {
          [
            <Step1
              value={borrower}
              onChange={this.handleOnChange}
              onNext={this.handleNext}
              onClose={onClose}
            />,
            <Step2
              value={{
                borrowerID: borrower.accountID,
                amount,
                message,
              }}
              onChange={this.handleOnChange}
              onBack={this.handleBack}
              onClose={onClose}
            />,
          ][step] || null
        }
      </Template>
    )
  }
}
AddDebtModal.defaultProps = {
  show: false,
  onClose: (f) => f,
}
AddDebtModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
}
export default AddDebtModal
