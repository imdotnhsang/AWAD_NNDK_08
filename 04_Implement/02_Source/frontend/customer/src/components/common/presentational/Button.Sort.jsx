import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['desc']

const Wrapper = styled.button`
  width: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const Name = styled.span`
  font-family: OpenSans-SemiBold;
  font-size: 15px;
  color: #fff;
  margin-right: 20px;
`
const Logo = styled(resolveTagFromProps(styleModifiers, 'svg'))`
  transform: ${(props) => (props.desc ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.5s ease-out;
`

const SortButton = ({
  name,
  desc,
  onClick,
}) => (
  <Wrapper onClick={onClick} type="button">
    <Name>{name}</Name>
    <Logo desc={desc} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.1893 5.25L11.25 6.31066L7.34987 10.2108L6.28921 9.15013L10.1893 5.25Z" fill="white" />
      <path d="M8.41839 9.1307L7.35773 10.1914L3.47703 6.31066L4.53769 5.25L8.41839 9.1307Z" fill="white" />
    </Logo>
  </Wrapper>
)
SortButton.defaultProps = {
  name: '',
  desc: false,
  onClick: (f) => f,
}
SortButton.propTypes = {
  name: PropTypes.string,
  desc: PropTypes.bool,
  onClick: PropTypes.func,
}
export default SortButton
