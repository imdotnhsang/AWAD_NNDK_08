import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.button`
  padding: 16px;
  background-color: ${(props) => (props.secondary ? props.theme.blackMedium : props.theme.orange)};
  width: ${(props) => (props.fluid ? '100%' : 'max-content')};
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: 4px 4px 0px #111111;
    transform: translate(-4px, -4px);
  }
  transition: transform 0.2s linear;
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
  onClick,
}) => (
  <Wrapper
    type="button"
    secondary={secondary}
    fluid={fluid}
    onClick={onClick}
  >
    <Text>{name}</Text>
  </Wrapper>
)

GeneralButton.defaultProps = {
  name: '',
  secondary: false,
  fluid: false,
  onClick: (f) => f,
}
GeneralButton.propTypes = {
  name: PropTypes.string,
  secondary: PropTypes.bool,
  fluid: PropTypes.bool,
  onClick: PropTypes.func,
}

export default GeneralButton
