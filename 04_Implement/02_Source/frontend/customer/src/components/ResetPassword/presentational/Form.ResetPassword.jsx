import React, { Component } from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import Button from '../../common/presentational/Button.Loading'
import Input from '../../SignIn/presentational/Input.Password'
import api from '../../../api/api'
import { clearStorage } from '../../../utils/utils'

const Wrapper = styled.div`
  background: ${(props) => props.theme.grayGradient};
  border-radius: 25px;
  padding: 60px 54px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 500px;
  box-sizing: border-box;
`
const Title = styled.span`
  font-family: OpenSans-Bold;
  color: #fff;
  font-size: 25px;
  margin-bottom: 54px;
`
const Instruction = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  margin-bottom: 24px;
`
const InputWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 36px;
`

class ResetPasswordForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
      done: false,
    }
    this.handlePassword = this.handlePassword.bind(this)
    this.handleConfimPassword = this.handleConfimPassword.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value,
      error: '',
    })
  }

  handleConfimPassword(event) {
    this.setState({
      confirmPassword: event.target.value,
      error: '',
    })
  }

  handleKeyPress(event) {
    if (event.which === 13 || event.keyCode === 13) {
      this.handleSubmit()
      return false
    }
    return true
  }

  async handleSubmit() {
    const { password, confirmPassword } = this.state
    if (!password || !confirmPassword) {
      this.setState({
        error: 'Required field',
      })
      return
    }
    if (password !== confirmPassword) {
      this.setState({
        error: 'Password does not match confirm password',
      })
      return
    }
    this.setState({ loading: true })
    const data = { password, confirmPassword }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const res = await api.post('/reset-password', data, config)
    if (res.error) {
      const { error } = res
      this.setState({
        error,
        loading: false,
      })
    } else {
      clearStorage()
      this.setState({
        loading: false,
        done: true,
      })
    }
  }

  render() {
    const {
      password,
      confirmPassword,
      error,
      loading,
      done,
    } = this.state

    if (done) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { show: true },
          }}
        />
      )
    }

    return (
      <Wrapper>
        <Title>Create new password</Title>
        <Instruction>Enter the new password for your account</Instruction>
        <Input
          label="New password"
          placeholder="Enter new password"
          value={password}
          error={error}
          icon={false}
          disabled={loading}
          onChange={this.handlePassword}
        />
        <InputWrapper>
          <Input
            label="Confirm password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            error={error}
            icon={false}
            disabled={loading}
            onChange={this.handleConfimPassword}
            onKeyPress={this.handleKeyPress}
          />
        </InputWrapper>
        <ButtonWrapper>
          <Button
            fluid
            name="Confirm password changes"
            loading={loading}
            onClick={this.handleSubmit}
            disabled={loading}
          />
        </ButtonWrapper>
      </Wrapper>
    )
  }
}
export default ResetPasswordForm
