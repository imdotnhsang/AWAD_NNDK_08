import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Template from '../../common/presentational/Template.Modal'
import TextArea from '../../common/presentational/TextArea'
import SubmitButton from '../../common/presentational/Button.Loading'
import CancelButton from '../../common/presentational/Button'
import api from '../../../api/api'

const Instruction = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
`
const TextAreaWrapper = styled.div`
  width: 100%;
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

class RemoveDebtModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reasonOfCancel: '',
      loading: false,
    }
    this.handleReason = this.handleReason.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleReason(event) {
    this.setState({
      reasonOfCancel: event.target.value,
    })
  }

  async handleDelete() {
    const { reasonOfCancel } = this.state
    this.setState({
      loading: true,
    })
    // eslint-disable-next-line react/destructuring-assignment
    const { id } = this.props.data
    const {
      createdByYouRemove,
      onClose,
      onSuccess,
      onFailure,
    } = this.props

    const data = {
      id,
      reasonOfCancel,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const res = await api.post('/debts/remove', data, config)
    if (res.error) {
      this.setState({
        loading: false,
      })
      onClose()
      onFailure(res.error)
    } else {
      this.setState({
        loading: false,
      })
      onClose()
      onSuccess('You have successfully removed this debt reminder', createdByYouRemove)
    }
  }

  render() {
    const {
      show,
      onClose,
    } = this.props
    const {
      reasonOfCancel,
      loading,
    } = this.state

    return (
      <Template
        show={show}
        name="Debt cancellation"
        onClose={onClose}
      >
        <>
          <Instruction>
            You are about to remove a debt! This action cannot be restore.
            <br />
            Appropriate notifications will be sent to relevant accounts.
          </Instruction>
          <TextAreaWrapper>
            <TextArea
              value={reasonOfCancel}
              label="Reason"
              placeholder="Enter the reason of this debt's cancellation"
              onChange={this.handleReason}
            />
          </TextAreaWrapper>
          <ButtonWrapper>
            <CancelButton
              fluid
              secondary
              name="Cancel"
              onClick={onClose}
            />
            <SubmitButton
              name="Delete"
              fluid
              loading={loading}
              onClick={this.handleDelete}
            />
          </ButtonWrapper>
        </>
      </Template>
    )
  }
}
RemoveDebtModal.defaultProps = {
  data: {
    id: '',
  },
  show: false,
  createdByYouRemove: true,
  onClose: (f) => f,
  onSuccess: (f) => f,
  onFailure: (f) => f,
}
RemoveDebtModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  show: PropTypes.bool,
  createdByYouRemove: PropTypes.bool,
  onClose: PropTypes.func,
  //
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
}
export default RemoveDebtModal
