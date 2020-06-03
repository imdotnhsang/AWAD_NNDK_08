import React, { Component } from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Template from '../common/presentational/Template.Customer'
import { clearStorage } from '../../utils/utils'
import Button from '../common/presentational/Button'
import Display from './container/Display.CustomerInfo'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'
import ChangePasswordModal from './presentational/Modal.ChangePassword'
import SignOutModal from './presentational/Modal.SignOut'

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 60px;
  padding-bottom: 54px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &> *:first-child {
    margin-bottom: 40px;
  }
  width: 190px;
  margin-top: 30px;
`
const Description = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  line-height: 16px;
`

class AccountPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showChangePassword: false,
      showSignOut: false,
      showSuccess: false,
      showFailure: false,
      didSignOut: false,
      failureMessage: '',
    }
    this.handleOpenChangePassword = this.handleOpenChangePassword.bind(this)
    this.handleCloseChangePassword = this.handleCloseChangePassword.bind(this)
    this.handleOpenSignOut = this.handleOpenSignOut.bind(this)
    this.handleCloseSignOut = this.handleCloseSignOut.bind(this)
    this.handleSignOut = this.handleSignOut.bind(this)
    this.handleOpenSuccess = this.handleOpenSuccess.bind(this)
    this.handleCloseSuccess = this.handleCloseSuccess.bind(this)
    this.handleOpenFailure = this.handleOpenFailure.bind(this)
    this.handleCloseFailure = this.handleCloseFailure.bind(this)
  }

  handleOpenChangePassword() {
    this.setState({
      showChangePassword: true,
    })
  }

  handleCloseChangePassword() {
    this.setState({
      showChangePassword: false,
    })
  }

  handleOpenSignOut() {
    this.setState({
      showSignOut: true,
    })
  }

  handleCloseSignOut() {
    this.setState({
      showSignOut: false,
    })
  }

  handleSignOut() {
    clearStorage()
    this.setState({
      didSignOut: true,
    })
  }

  handleOpenSuccess() {
    this.setState({
      showSuccess: true,
    })
  }

  handleCloseSuccess() {
    this.setState({
      showSuccess: false,
    })
  }

  handleOpenFailure(message) {
    this.setState({
      showFailure: true,
      failureMessage: message,
    })
  }

  handleCloseFailure() {
    this.setState({
      showFailure: false,
      failureMessage: '',
    })
  }

  render() {
    const {
      didSignOut,
      showChangePassword,
      showSignOut,
      showSuccess,
      showFailure,
      failureMessage,
    } = this.state
    if (didSignOut) return <Redirect to="/login" />
    return (
      <Template
        currentTab={5}
        headerName="Account"
      >
        <>
          <Wrapper>
            <Display />
            <ButtonWrapper>
              <Button
                fluid
                name="Change password"
                onClick={this.handleOpenChangePassword}
                onSuccess={this.handleOpenSuccess}
                onFailure={this.handleOpenFailure}
              />
              <Button
                fluid
                name="Sign out"
                secondary
                onClick={this.handleOpenSignOut}
              />
            </ButtonWrapper>
          </Wrapper>
          {showChangePassword
            && (
              <ChangePasswordModal
                onClose={this.handleCloseChangePassword}
                onSuccess={this.handleOpenSuccess}
                onFailure={this.handleOpenFailure}
              />
            )}
          {showSignOut
            && (
              <SignOutModal
                onClose={this.handleCloseSignOut}
                onSignOut={this.handleSignOut}
              />
            )}
          {showSuccess
            && (
            <SuccessModal
              onClose={this.handleCloseSuccess}
            >
              <Description>You have successfully changed your password!</Description>
            </SuccessModal>
            )}
          {showFailure
            && (
              <FailureModal
                onClose={this.handleCloseFailure}
              >
                <Description>
                  Something wrong has happened that your action was canceled
                  <br />
                  Error message:
                  {' '}
                  {failureMessage}
                </Description>
              </FailureModal>
            )}
        </>
      </Template>
    )
  }
}

export default AccountPage
