import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
  border-radius: 25px;
  padding: 60px 54px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: ${(props) => `${props.width}px`};
  box-sizing: border-box;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 54px;
  width: 100%;
`
const Name = styled.span`
  font-family: OpenSans-Bold;
  color: #fff;
  font-size: 25px;
`
const CancelButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const CancelButtonText = styled.span`
  font-family: OpenSans-Bold;
  color: ${(props) => props.theme.grayMedium};
  text-transform: uppercase;
  margin-left: 10px;
`

const ModalTemplate = ({
  show,
  width,
  name,
  children,
  onClose,
}) => (
  <Backdrop show={show}>
    <Wrapper width={width}>
      <Header>
        <Name>{name}</Name>
        <CancelButton onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="13.5356" y="5.05005" width="2" height="12" transform="rotate(45 13.5356 5.05005)" fill="#7C7F87" />
            <rect x="5.05029" y="6.4646" width="2" height="12" transform="rotate(-45 5.05029 6.4646)" fill="#7C7F87" />
          </svg>
          <CancelButtonText>Cancel</CancelButtonText>
        </CancelButton>
      </Header>
      {children}
    </Wrapper>
  </Backdrop>
)
ModalTemplate.defaultProps = {
  show: false,
  width: 500,
  name: 'Name',
  children: null,
  onClose: (f) => f,
}
ModalTemplate.propTypes = {
  show: PropTypes.bool,
  width: PropTypes.number,
  name: PropTypes.string,
  children: PropTypes.element,
  onClose: PropTypes.func,
}
export default ModalTemplate
