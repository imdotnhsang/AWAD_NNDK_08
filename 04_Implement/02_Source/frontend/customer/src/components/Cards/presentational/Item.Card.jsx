import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { fourDigit, spaceSeparating } from '../../../utils/utils'

const Card = styled.div`
  width: 126px;
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
const CardType = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  text-transform: capitalize;
`
const CardNumber = styled(CardType)`
  font-size: 15px;
  margin-bottom: 12px;
`
const Circle = styled.div`
  border-radius: 50%;
  background-color: ${(props) => props.theme.orange};
  width: 15px;
  height: 15px;
  background-color: ${(props) => (props.active ? props.theme.orange : props.theme.blackDark)};
  margin: 0px 24px;
`
const Balance = styled.span`
  font-family: OpenSans-Regular;
  font-size: 20px;
  color: #fff;
`
const Wrapper = styled.button`
  width: 480px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const CardItem = ({
  service,
  cardNumber,
  balance,
  active,
  onClick,
}) => (
  <Wrapper onClick={onClick}>
    <Circle active={active} />
    <Card>
      <CardNumber>{fourDigit(cardNumber)}</CardNumber>
      <CardType>{service.toLowerCase()}</CardType>
    </Card>
    <Balance>
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
  onClick: (f) => f,
}
CardItem.propTypes = {
  service: PropTypes.string,
  cardNumber: PropTypes.string,
  balance: PropTypes.number,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}
export default CardItem
