import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['active']

const Wrapper = styled.button`
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const Name = styled.span`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
  margin-bottom: 6px;
`
const Line = styled(resolveTagFromProps(styleModifiers, 'div'))`
  height: 2px;
  width: ${(props) => (props.active ? '120%' : '0')};
  background-color: #fff;
  transition: width 0.5s ease-out;
`

const TabButton = ({
  name,
  active,
  onClick,
}) => (
  <Wrapper onClick={onClick} type="button">
    <Name>{name}</Name>
    <Line active={active} />
  </Wrapper>
)
TabButton.defaultProps = {
  name: '',
  active: false,
  onClick: (f) => f,
}
TabButton.propTypes = {
  name: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}
export default TabButton
