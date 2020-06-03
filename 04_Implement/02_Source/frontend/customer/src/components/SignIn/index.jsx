import React, { useState } from 'react'
import styled from 'styled-components'
import SignInForm from './presentational/Form.SignIn'
import Template from '../common/presentational/Template.SignIn'
import Modal from '../common/presentational/Modal.Success'

const Description = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  line-height: 16px;
`

// eslint-disable-next-line react/prop-types
const SignInPage = ({ location }) => {
  // eslint-disable-next-line react/prop-types
  const { referer, show } = location.state || { referer: '/', show: false }
  const [showModal, setShowModal] = useState(show)

  return (
    <Template>
      <>
        <SignInForm referer={referer} />
        {showModal
          && (
          <Modal onClose={() => setShowModal(false)}>
            <Description>
              You have successfully resetted your password
              <br />
              {' '}
              You can now use your new information to login!
            </Description>
          </Modal>
          )}
      </>
    </Template>
  )
}
export default SignInPage
