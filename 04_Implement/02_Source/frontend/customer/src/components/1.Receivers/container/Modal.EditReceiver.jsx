import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../../common/presentational/Template.Modal'
import Select from '../../common/container/Select.Bank'
import Input from '../../common/presentational/Input'
import Button from '../../common/presentational/Button.Loading'
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
      nickname: '',
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
      onSuccess,
      onFailure,
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
        loading: false,
      })
      onClose()
      onFailure(error)
    } else {
      this.setState({
        loading: false,
      })
      onClose()
      onSuccess('You have successfully updated your receiver\'s information!')
    }
  }

  render() {
    const {
      nickname,
      error,
      loading,
    } = this.state
    const {
      bankID,
      accountID,
      nickname: oldNickname,
      onClose,
      //
      bankLoading,
    } = this.props
    return (
      <Template
        name="Edit receiver"
        onClose={onClose}
        loading={bankLoading}
        disabled={loading}
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
          placeholder={oldNickname}
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
            disabled={loading}
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
  onClose: (f) => f,
  onSuccess: (f) => f,
  onFailure: (f) => f,
  //
  bankLoading: false,
}
EditReceiverModal.propTypes = {
  id: PropTypes.string,
  bankID: PropTypes.string,
  accountID: PropTypes.string,
  nickname: PropTypes.string,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
  //
  bankLoading: PropTypes.bool,
}
const mapStateToProps = (state) => ({
  bankLoading: state.banks.loading,
})
export default connect(
  mapStateToProps,
)(EditReceiverModal)
