import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { fourDigit, spaceSeparating, resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['fluid', 'empty', 'active']

const Card = styled(resolveTagFromProps(styleModifiers, 'div'))`
  width: ${(props) => (props.fluid ? '100%' : '126px')};
  height: 80px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  background-color: ${(props) => props.theme.grayMedium};
  margin-right: 44px;
  border-radius: 15px;
  box-sizing: border-box;
`
const CardType = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  text-transform: capitalize;
  opacity: ${(props) => (props.empty && '0')};
`
const CardNumber = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-family: OpenSans-Regular;  
  font-size: 15px;
  margin-bottom: 12px;
  color: #fff;
  text-transform: capitalize;
  opacity: ${(props) => (props.empty && '0')};
`
const Circle = styled(resolveTagFromProps(styleModifiers, 'div'))`
  border-radius: 50%;
  background-color: ${(props) => props.theme.orange};
  width: 15px;
  height: 15px;
  background-color: ${(props) => (props.active ? props.theme.orange : 'transparent')};
  opacity: ${(props) => (props.empty && '0')};
  margin: 0px 24px;
`
const Balance = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-family: OpenSans-Regular;
  font-size: 20px;
  color: #fff;
  opacity: ${(props) => (props.empty && '0')};
`
const Wrapper = styled.button`
  width: 480px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`

const CardItem = ({
  service,
  cardNumber,
  balance,
  active,
  fluid,
  empty,
  onClick,
}) => (
  <Wrapper onClick={onClick} fluid={fluid} type="button" disabled={empty}>
    <Circle active={active} empty={empty} />
    <Card>
      <CardNumber empty={empty}>{fourDigit(cardNumber)}</CardNumber>
      <CardType empty={empty}>{service.toLowerCase()}</CardType>
    </Card>
    <Balance empty={empty}>
      {spaceSeparating(balance, 3)}
      {' '}
      <b>VND</b>
    </Balance>
  </Wrapper>
)

CardItem.defaultProps = {
  service: 'MASTERCARD',
  cardNumber: '0000000000000000',
  balance: 1000000000000,
  active: false,
  fluid: false,
  empty: false,
  onClick: (f) => f,
}
CardItem.propTypes = {
  service: PropTypes.string,
  cardNumber: PropTypes.string,
  balance: PropTypes.number,
  active: PropTypes.bool,
  fluid: PropTypes.bool,
  empty: PropTypes.bool,
  onClick: PropTypes.func,
}
export default CardItem
