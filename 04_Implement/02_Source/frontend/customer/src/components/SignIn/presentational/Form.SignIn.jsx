import React, { Component } from 'react'
import styled from 'styled-components'
import { Link, Redirect } from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha'
import EmailInput from './Input.Email'
import PasswordInput from './Input.Password'
import SubmitButton from '../../common/Button.Loading'
import { isValidEmail, setJwtToStorage, isAuthenticated } from '../../../utils/utils'
import api from '../../../api/api'

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
const ForgotPassword = styled(Link)`
  font-family: OpenSans-Regular;
  font-size: 12px;
  align-self: flex-end;
  margin-bottom: 36px;
  color: #fff;
  text-decoration: none;
  font-family: OpenSans-Regular;
`
const ErrorReCaptcha = styled.div`
  color: ${(props) => props.theme.yellow};
  font-family: OpenSans-Regular;
  font-size: 10px;
  margin-top: 8px;
`
const ReCaptchaWrapper = styled.div`
  align-self: center;
  margin-bottom: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

class SignInModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      reCaptchaKey: null,
      error: '',
      errorReCaptcha: '',
      loading: false,
    }
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleCaptchaChange = this.handleCaptchaChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleEmail(event) {
    this.setState({ email: event.target.value, error: '' })
  }

  handlePassword(event) {
    this.setState({ password: event.target.value, error: '' })
  }

  handleCaptchaChange(reCaptchaKey) {
    if (!reCaptchaKey) {
      this.setState({
        reCaptchaKey,
        errorReCaptcha: 'Expired reCaptcha!',
      })
    } else {
      this.setState({
        reCaptchaKey,
        errorReCaptcha: '',
      })
    }
  }

  async handleSubmit() {
    const {
      email, password, reCaptchaKey,
    } = this.state
    // Required field
    if (!email || !password) {
      this.setState({ error: 'Required field' })
      return
    }
    // Invalid email
    if (!isValidEmail(email)) {
      this.setState({ error: 'Some fields have invalid value' })
      return
    }

    if (!reCaptchaKey) {
      this.setState({ errorReCaptcha: 'Invalid reCaptcha' })
      return
    }

    this.setState({ loading: true })
    const data = {
      email, password, reCaptchaKey,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    try {
      const res = await api.post('/login', data, config)
      const { token } = res.data
      setJwtToStorage(token)
      this.setState({
        loading: false,
      })
    } catch (e) {
      const { status } = e.response
      const { error } = e.response.data
      if (status === 419) {
        this.setState({
          errorReCaptcha: error,
          loading: false,
        })
      } else {
        this.setState({
          error,
          loading: false,
        })
      }
    }
  }

  render() {
    const {
      email, password, error, errorReCaptcha, loading, referer,
    } = this.state

    if (isAuthenticated()) {
      return <Redirect to={referer} />
    }

    return (
      <Wrapper>
        <Title>Sign in</Title>
        <EmailInput
          value={email}
          error={error}
          disabled={loading}
          onChange={this.handleEmail}
        />
        <PasswordInput
          value={password}
          error={error}
          disabled={loading}
          onChange={this.handlePassword}
        />
        <ForgotPassword to="/forgot-password">Forgot password?</ForgotPassword>
        <ReCaptchaWrapper>
          <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={this.handleCaptchaChange}
          />
          {errorReCaptcha && <ErrorReCaptcha>{errorReCaptcha}</ErrorReCaptcha>}
        </ReCaptchaWrapper>
        <SubmitButton
          fluid
          onClick={this.handleSubmit}
          name="Log in"
          loading={loading}
        />
      </Wrapper>
    )
  }
}

export default SignInModal
