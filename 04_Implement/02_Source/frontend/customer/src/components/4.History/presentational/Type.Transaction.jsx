import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'
import { DebtType } from '../../../constants/constants'

const styleModifiers = ['type']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px;
  width: 124px;
  background-color: ${(props) => (props.type === DebtType.LOAN ? props.theme.orange : props.theme.green)}
`

const Name = styled.span`
  font-family: OpenSans-SemiBold;
  font-size: 15px;
  color: #fff;
`

const Status = ({
  type,
}) => (
  <Wrapper type={type}>
    <Name>{type}</Name>
  </Wrapper>
)
Status.defaultProps = {
  type: DebtType.LOAN,
}
Status.propTypes = {
  type: PropTypes.oneOf([
    DebtType.LOAN,
    DebtType.DEBT,
  ]),
}
export default Status
