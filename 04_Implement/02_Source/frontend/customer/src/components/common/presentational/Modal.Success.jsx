import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.75);
  display: ${(props) => (props.show ? 'block' : 'none')}
`
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: ${(props) => props.theme.grayGradient};
  display: flex;
  flex-direction: column;
  justify-conten: center;
  align-items: flex-start;
  padding: 60px 54px;
  box-sizing: border-box;
  width: 500px;
  border-radius: 25px;
`
const Title = styled.span`
  font-family: OpenSans-Bold;
  font-size: 25px;
  color: #fff;
  margin-bottom: 40px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 36px;
`
const Modal = ({
  show,
  onClose,
  children,
}) => (
  <Backdrop show={show}>
    <Wrapper>
      <Title>SUCCESS</Title>
      {children}
      <ButtonWrapper>
        <Button name="OK" fluid onClick={onClose} />
      </ButtonWrapper>
    </Wrapper>
  </Backdrop>
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
