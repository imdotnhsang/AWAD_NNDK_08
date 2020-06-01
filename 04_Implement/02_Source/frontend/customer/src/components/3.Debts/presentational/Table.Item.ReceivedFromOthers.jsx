import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import Status from './Status'
import { spaceSeparating, resolveTagFromProps } from '../../../utils/utils'
import { DebtStatus } from '../../../constants/constants'

const styleModifiers = ['lastItem']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
  width: 100%;
  padding: 24px 0;
  background-color: ${(props) => props.theme.blackDark};
  margin-bottom: ${(props) => !props.lastItem && '20px'};
`

const StyledCol = styled(Col)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  word-wrap: break-word;
  text-align: justify;
`

const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: flex-start;
  &> *:first-child {
    margin-bottom: 10px;
  }
`
const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 20px;
`
const ActionButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${((props) => (props.disabled && '0.5'))};
`

const TableItem = ({
  index,
  accountID,
  accountName,
  status,
  amount,
  lastItem,
  onPay,
  onInfo,
  onRemove,
}) => (
  <Wrapper lastItem={lastItem}>
    <Row>
      <StyledCol md={1}>
        <Text>{index}</Text>
      </StyledCol>
      <StyledCol md={3}>
        <InfoWrapper>
          <Text>{accountName}</Text>
          <Text>{spaceSeparating(accountID, 4)}</Text>
        </InfoWrapper>
      </StyledCol>
      <StyledCol md={3}>
        <Text>
          {spaceSeparating(amount, 3)}
          {' '}
          VND
        </Text>
      </StyledCol>
      <StyledCol md={3}>
        <Status status={status} />
      </StyledCol>
      <StyledCol md={2}>
        <ActionWrapper>
          <ActionButton onClick={onPay} type="button" disabled={status === DebtStatus.CANCELLED || status === DebtStatus.PAID}>
            {
              (status === DebtStatus.CANCELLED || status === DebtStatus.PAID)
                ? (
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 8C2.5 6.34315 3.84315 5 5.5 5H19.5C21.1569 5 22.5 6.34315 22.5 8V10H2.5V8Z" fill="#26292E" />
                    <path d="M2.5 11.25H22.5V17C22.5 18.6569 21.1569 20 19.5 20H5.5C3.84315 20 2.5 18.6569 2.5 17V11.25Z" fill="#26292E" />
                  </svg>
                )
                : (
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 8C2.5 6.34315 3.84315 5 5.5 5H19.5C21.1569 5 22.5 6.34315 22.5 8V10H2.5V8Z" fill="url(#paint0_linear)" />
                    <path d="M2.5 11.25H22.5V17C22.5 18.6569 21.1569 20 19.5 20H5.5C3.84315 20 2.5 18.6569 2.5 17V11.25Z" fill="url(#paint1_linear)" />
                    <defs>
                      <linearGradient id="paint0_linear" x1="2.5" y1="8" x2="23" y2="8" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#EF230C" />
                        <stop offset="1" stopColor="#FFD351" />
                      </linearGradient>
                      <linearGradient id="paint1_linear" x1="3" y1="15" x2="22.5" y2="15" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#EF230C" />
                        <stop offset="1" stopColor="#FFD351" />
                      </linearGradient>
                    </defs>
                  </svg>
                )
            }
          </ActionButton>
          <ActionButton onClick={onInfo} type="button">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10.625" y="10" width="3.75" height="10" rx="1.875" fill="#EF230C" />
              <circle cx="12.5" cy="6.875" r="1.875" fill="#EF230C" />
            </svg>
          </ActionButton>
          <ActionButton onClick={onRemove} type="button">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.30357 18.3333C8.30357 19.25 9.02679 20 9.91071 20H16.3393C17.2232 20 17.9464 19.25 17.9464 18.3333V8.33333H8.30357V18.3333ZM18.75 5.83333H15.9375L15.1339 5H11.1161L10.3125 5.83333H7.5V7.5H18.75V5.83333Z" fill="#EF230C" />
            </svg>
          </ActionButton>
        </ActionWrapper>
      </StyledCol>
    </Row>
  </Wrapper>
)
TableItem.defaultProps = {
  index: 0,
  accountID: '',
  accountName: '',
  status: DebtStatus.UNPAID,
  amount: 0,
  lastItem: false,
  onPay: (f) => f,
  onInfo: (f) => f,
  onRemove: (f) => f,
}
TableItem.propTypes = {
  index: PropTypes.number,
  accountID: PropTypes.string,
  accountName: PropTypes.string,
  status: PropTypes.oneOf([
    DebtStatus.UNPAID,
    DebtStatus.PAID,
    DebtStatus.CANCELLED,
  ]),
  amount: PropTypes.number,
  lastItem: PropTypes.bool,
  onPay: PropTypes.func,
  onInfo: PropTypes.func,
  onRemove: PropTypes.func,
}

export default TableItem
