import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Select from '../../common/container/Select.Bank'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
import { fetchReceiversDataIfNeeded, invalidateReceiversData } from '../../../actions/receivers'
import api from '../../../api/api'

const InputWrapper = styled.div`
  width: 100%;
  margin-bottom: 24px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 36px;
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  margin-bottom: 24px;
`
class EditReceiverModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      loading: false,
    }
    this.handleNickname = this.handleNickname.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleNickname(event) {
    this.setState({
      nickname: event.target.value,
      error: '',
    })
  }

  async handleSubmit() {
    const { id } = this.props
    const {
      nickname,
    } = this.state
    const {
      onClose,
      onInvalidateReceiversData,
      onRefreshReceiversData,
    } = this.props

    if (!nickname) {
      this.setState({
        error: 'Required field',
      })
      return
    }
    // Edit receiver
    const data = {
      id, name: nickname,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    this.setState({
      loading: true,
      error: '',
    })
    const res = await api.post('/receivers/edit', data, config)
    if (res.error) {
      const { error } = res
      this.setState({
        error,
        loading: false,
      })
    } else {
      this.setState({
        error: '',
        loading: false,
      })
      onClose()
      onInvalidateReceiversData()
      onRefreshReceiversData()
    }
  }

  render() {
    const {
      error,
      loading,
    } = this.state
    const {
      bankID,
      accountID,
      nickname,
      show,
      onClose,
    } = this.props
    return (
      <Template
        show={show}
        name="Edit receiver"
        onClose={onClose}
      >
        <Text>Enter the new infomation for this contact</Text>
        <InputWrapper>
          <Select
            disabled
            value={bankID}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            label="Card number"
            placeholder="Enter the receiver's card number"
            value={accountID}
            disabled
          />
        </InputWrapper>
        <Input
          label="Nickname"
          placeholder="Enter the receiver's nickname"
          value={nickname}
          error={error}
          onChange={this.handleNickname}
          disabled={loading}
        />
        <ButtonWrapper>
          <Button
            name="Save changes"
            fluid
            onClick={this.handleSubmit}
            loading={loading}
          />
        </ButtonWrapper>
      </Template>
    )
  }
}

EditReceiverModal.defaultProps = {
  id: '',
  bankID: '',
  accountID: '',
  nickname: '',
  show: true,
  onClose: (f) => f,
  //
  onInvalidateReceiversData: (f) => f,
  onRefreshReceiversData: (f) => f,
}
EditReceiverModal.propTypes = {
  id: PropTypes.string,
  bankID: PropTypes.string,
  accountID: PropTypes.string,
  nickname: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  //
  onInvalidateReceiversData: PropTypes.func,
  onRefreshReceiversData: PropTypes.func,
}
const mapDispatchToProps = (dispatch) => ({
  onInvalidateReceiversData: () => dispatch(invalidateReceiversData()),
  onRefreshReceiversData: () => dispatch(fetchReceiversDataIfNeeded()),
})
export default connect(
  null,
  mapDispatchToProps,
)(EditReceiverModal)
