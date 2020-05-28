import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.button`
  background: ${(props) => (props.color ? props.color : props.theme.blackMedium)};
  height: 67px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 24px;
  box-shadow: ${(props) => (props.active && '0px 4px 4px #111111')};
`
const Name = styled.span`
  font-family: OpenSans-Bold;
  font-size: 15px;
  color: #fff;
  margin-left: 20px;
  line-height: 16px;
`

const MenuButton = ({
  color,
  active,
  name,
  children,
  onClick,
}) => (
  <Wrapper
    color={color}
    active={active}
    onClick={onClick}
  >
    {children}
    <Name>{name}</Name>
  </Wrapper>
)
MenuButton.defaultProps = {
  color: '',
  active: false,
  name: '',
  children: null,
  onClick: (f) => f,
}
MenuButton.propTypes = {
  color: PropTypes.string,
  active: PropTypes.bool,
  name: PropTypes.string,
  children: PropTypes.element,
  onClick: PropTypes.func,
}
export default MenuButton
