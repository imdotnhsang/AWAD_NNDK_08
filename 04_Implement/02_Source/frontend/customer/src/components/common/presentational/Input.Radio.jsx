import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['selected', 'fluid']

const Wrapper = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const OuterCircle = styled.div`
  background-color: ${(props) => props.theme.blackDark};
  border-radius: 50%;
  height: 22px;
  width: 22px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`
const InnerCircle = styled(resolveTagFromProps(styleModifiers, 'div'))`
  background-color: ${(props) => (props.selected && props.theme.orange)};
  border-radius: 50%;
  height: 12px;
  width: 12px;
`
const Label = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`

const RadioInput = ({
  label,
  selected,
  onClick,
}) => (
  <Wrapper onClick={onClick} type="button">
    <OuterCircle>
      <InnerCircle selected={selected} />
    </OuterCircle>
    <Label>{label}</Label>
  </Wrapper>
)
RadioInput.defaultProps = {
  label: '',
  selected: false,
  onClick: (f) => f,
}
RadioInput.propTypes = {
  label: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

export default RadioInput
