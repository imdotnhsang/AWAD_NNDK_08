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
  show,
  onClose,
  children,
}) => (
  <Template
    name="SUCCESS!"
    show={show}
    onClose={onClose}
  >
    {children}
    <ButtonWrapper>
      <Button name="OK" fluid onClick={onClose} />
    </ButtonWrapper>
  </Template>
)

Modal.defaultProps = {
  show: false,
  onClose: (f) => f,
  children: null,
}
Modal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.element,
}

export default Modal
