import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Template from '../../common/presentational/Template.Modal'
import Button from '../../common/presentational/Button'

const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
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

const SignOutModal = ({
  onClose,
  onSignOut,
}) => (
  <Template
    name="Sign out"
    onClose={onClose}
  >
    <>
      <Text>Are you sure you want to sign out?</Text>
      <ButtonWrapper>
        <Button
          fluid
          secondary
          name="Cancel"
          onClick={onClose}
        />
        <Button
          fluid
          name="Sign out"
          onClick={onSignOut}
        />
      </ButtonWrapper>
    </>
  </Template>
)

SignOutModal.defaultProps = {
  onClose: (f) => f,
  onSignOut: (f) => f,
}
SignOutModal.propTypes = {
  onClose: PropTypes.func,
  onSignOut: PropTypes.func,
}
export default SignOutModal
