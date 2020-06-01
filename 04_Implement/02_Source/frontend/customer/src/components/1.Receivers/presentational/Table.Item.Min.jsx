import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import { spaceSeparating, resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['lastItem']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
  width: 100%;
  background-color: ${(props) => props.theme.blackDark};
  margin-bottom: ${(props) => !props.lastItem && '12px'};
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`

const TableItem = ({
  nickname,
  cardNumber,
  bankName,
  lastItem,
}) => (
  <Wrapper lastItem={lastItem}>
    <Row>
      <Col md={4}><Text>{nickname}</Text></Col>
      <Col md={4}><Text>{spaceSeparating(cardNumber, 4)}</Text></Col>
      <Col md={4}><Text>{bankName}</Text></Col>
    </Row>
  </Wrapper>
)

TableItem.defaultProps = {
  nickname: '',
  cardNumber: '',
  bankName: '',
  lastItem: false,
}
TableItem.propTypes = {
  nickname: PropTypes.string,
  cardNumber: PropTypes.string,
  bankName: PropTypes.string,
  lastItem: PropTypes.bool,
}
export default TableItem
