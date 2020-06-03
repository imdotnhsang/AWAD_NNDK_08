import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import { spaceSeparating, resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['lastItem', 'active']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'button'))`
  width: 100%;
  background-color: ${(props) => (props.active ? 'rgba(196, 196, 196, 0.3)' : props.theme.blackDark)};
  margin-bottom: ${(props) => !props.lastItem && '12px'};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  padding: 0px 12px;
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`
const StyledCol = styled(Col)`
  text-align: left;
  vertical-align: middle;
`

const TableItem = ({
  nickname,
  cardNumber,
  bankName,
  lastItem,
  active,
  onClick,
}) => (
  <Wrapper
    lastItem={lastItem}
    active={active}
    onClick={onClick}
  >
    <Row>
      <StyledCol md={4}><Text>{nickname}</Text></StyledCol>
      <StyledCol md={4}><Text>{spaceSeparating(cardNumber, 4)}</Text></StyledCol>
      <StyledCol md={4}><Text>{bankName}</Text></StyledCol>
    </Row>
  </Wrapper>
)

TableItem.defaultProps = {
  nickname: '',
  cardNumber: '',
  bankName: '',
  lastItem: false,
  active: false,
  onClick: (f) => f,
}
TableItem.propTypes = {
  nickname: PropTypes.string,
  cardNumber: PropTypes.string,
  bankName: PropTypes.string,
  lastItem: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func,
}
export default TableItem
