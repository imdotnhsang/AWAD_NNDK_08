import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import { spaceSeparating, resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['lastItem']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
  width: 100%;
  padding: 24px 0;
  background-color: ${(props) => props.theme.blackDark};
  margin-bottom: ${(props) => !props.lastItem && '20px'};
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
`
const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  &> * {
    margin-left: 40px;
  }
  &> *:first-child {
    margin-left: 0px;
  }
`
const ActionButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

const TableItem = ({
  index,
  nickname,
  cardNumber,
  bankName,
  lastItem,
  onEdit,
  onRemove,
}) => (
  <Wrapper lastItem={lastItem}>
    <Row>
      <Col md={1}><Text>{index}</Text></Col>
      <Col md={3}><Text>{nickname}</Text></Col>
      <Col md={3}><Text>{spaceSeparating(cardNumber, 4)}</Text></Col>
      <Col md={3}><Text>{bankName}</Text></Col>
      <Col md={2}>
        <ActionWrapper>
          <ActionButton type="button" onClick={onEdit}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 16.6151V20H8.38495L18.3683 10.0167L14.9833 6.63172L5 16.6151ZM20.986 7.39897C21.338 7.04694 21.338 6.47827 20.986 6.12623L18.8738 4.01403C18.5217 3.66199 17.9531 3.66199 17.601 4.01403L15.9492 5.66588L19.3341 9.05083L20.986 7.39897Z" fill="#EF230C" />
            </svg>
          </ActionButton>
          <ActionButton type="button" style={{ marginLeft: '60px' }} onClick={onRemove}>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.30357 18.3333C8.30357 19.25 9.02679 20 9.91071 20H16.3393C17.2232 20 17.9464 19.25 17.9464 18.3333V8.33333H8.30357V18.3333ZM18.75 5.83333H15.9375L15.1339 5H11.1161L10.3125 5.83333H7.5V7.5H18.75V5.83333Z" fill="#EF230C" />
            </svg>
          </ActionButton>
        </ActionWrapper>
      </Col>
    </Row>
  </Wrapper>
)

TableItem.defaultProps = {
  index: 0,
  nickname: '',
  cardNumber: '',
  bankName: '',
  lastItem: false,
  onEdit: (f) => f,
  onRemove: (f) => f,
}
TableItem.propTypes = {
  index: PropTypes.number,
  nickname: PropTypes.string,
  cardNumber: PropTypes.string,
  bankName: PropTypes.string,
  lastItem: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
}
export default TableItem
