import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import TextArea from '../../common/presentational/TextArea'
import SubmitButton from '../../common/presentational/Button.Loading'
import CancelButton from '../../common/presentational/Button'
import api from '../../../api/api'
import {
  invalidateDebtsDataCreatedByYou,
  invalidateDebtsDataReceivedFromOthers,
  fecthDebtsDataCreatedByYouIfNeeded,
  fecthDebtsDataReceivedFromOthersIfNeeded,
} from '../../../actions/debts'

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
const Error = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: ${(props) => props.theme.yellow};
  margin-top: 30px;
`

class RemoveDebtModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reasonOfCancel: '',
      loading: false,
      error: '',
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
      error: '',
    })
    // eslint-disable-next-line react/destructuring-assignment
    const { id } = this.props.data
    const {
      createdByYouRemove,
      onClose,
      invalidateCreatedByYou,
      invalidateReceivedFromOthers,
      refreshCreatedByYou,
      refreshReceivedFromOthers,
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
        error: res.error,
      })
    } else {
      this.setState({
        loading: false,
      })
      onClose()
      if (createdByYouRemove) {
        invalidateCreatedByYou()
        refreshCreatedByYou()
      } else {
        invalidateReceivedFromOthers()
        refreshReceivedFromOthers()
      }
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
      error,
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
          {error && <Error>{error}</Error>}
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
  //
  invalidateCreatedByYou: (f) => f,
  invalidateReceivedFromOthers: (f) => f,
  refreshCreatedByYou: (f) => f,
  refreshReceivedFromOthers: (f) => f,
}
RemoveDebtModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
  }),
  show: PropTypes.bool,
  createdByYouRemove: PropTypes.bool,
  onClose: PropTypes.func,
  //
  invalidateCreatedByYou: PropTypes.func,
  invalidateReceivedFromOthers: PropTypes.func,
  refreshCreatedByYou: PropTypes.func,
  refreshReceivedFromOthers: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  invalidateCreatedByYou: () => dispatch(invalidateDebtsDataCreatedByYou()),
  invalidateReceivedFromOthers: () => dispatch(invalidateDebtsDataReceivedFromOthers()),
  refreshCreatedByYou: () => dispatch(fecthDebtsDataCreatedByYouIfNeeded()),
  refreshReceivedFromOthers: () => dispatch(fecthDebtsDataReceivedFromOthersIfNeeded()),
})
export default connect(
  null,
  mapDispatchToProps,
)(RemoveDebtModal)
