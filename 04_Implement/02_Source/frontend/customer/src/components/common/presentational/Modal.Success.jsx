import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'
import Template from './Template.Modal'

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 36px;
`
const Modal = ({
  onClose,
  children,
}) => (
  <Template
    name="SUCCESS!"
    onClose={onClose}
  >
    <>
      {children}
      <ButtonWrapper>
        <Button name="OK" fluid onClick={onClose} />
      </ButtonWrapper>
    </>
  </Template>
)

Modal.defaultProps = {
  onClose: (f) => f,
  children: null,
}
Modal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.element,
}

export default Modal
