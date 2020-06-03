import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['secondary', 'fluid']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'button'))`
  padding: 16px;
  background-color: ${(props) => (props.secondary ? props.theme.blackMedium : props.theme.orange)};
  width: ${(props) => (props.fluid ? '100%' : 'max-content')};
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: ${(props) => (!props.disabled && '4px 4px 0px #111111')};
    transform: ${(props) => (!props.disabled && 'translate(-4px, -4px)')};
  }
  transition: transform 0.2s linear;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const Text = styled.span`
  color: ${(props) => props.theme.white}; 
  font-family: OpenSans-Regular;
  font-size: 15px;
`

const GeneralButton = ({
  name,
  secondary,
  fluid,
  disabled,
  onClick,
}) => (
  <Wrapper
    type="button"
    secondary={secondary}
    fluid={fluid}
    onClick={onClick}
    disabled={disabled}
  >
    <Text>{name}</Text>
  </Wrapper>
)

GeneralButton.defaultProps = {
  name: '',
  secondary: false,
  disabled: false,
  fluid: false,
  onClick: (f) => f,
}
GeneralButton.propTypes = {
  name: PropTypes.string,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  onClick: PropTypes.func,
}

export default GeneralButton
