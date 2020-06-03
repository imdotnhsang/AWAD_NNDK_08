import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'
import { TransactionStatus } from '../../../constants/constants'

const styleModifiers = ['status']

const Wrapper = styled.div`
  width: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Name = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-family: OpenSans-SemiBold;
  font-size: 15px;
  color: ${(props) => {
    switch (props.status) {
      case TransactionStatus.SUCCESS: return (props.theme.green)
      case TransactionStatus.REFUND: return (props.theme.yellow)
      case TransactionStatus.FAILED: return (props.theme.orange)
      default: return 'transparent'
    }
  }};
  margin-left: 16px;
`

const Status = ({
  status,
}) => (
  <Wrapper>
    {
      (() => {
        switch (status) {
          case TransactionStatus.REFUND:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5 10C5 6.68667 7.68667 4 11 4C14.3133 4 17 6.68667 17 10C17 13.3133 14.3133 16 11 16C9.34 16 7.84667 15.3267 6.76 14.24L7.70667 13.2933C8.54667 14.14 9.71333 14.6667 11 14.6667C13.58 14.6667 15.6667 12.58 15.6667 10C15.6667 7.42 13.58 5.33333 11 5.33333C8.42 5.33333 6.33333 7.42 6.33333 10H8.33333L5.64 12.6867L5.59333 12.5933L3 10H5Z" fill="#FFD351" />
                </svg>
                <Name status={status}>Refund</Name>
              </>
            )
          case TransactionStatus.SUCCESS:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10.4142L5.41421 9L9.65685 13.2426L8.24264 14.6569L4 10.4142Z" fill="#27AE60" />
                  <path d="M14.0711 6L15.4853 7.41421L8.41421 14.4853L7 13.0711L14.0711 6Z" fill="#27AE60" />
                </svg>
                <Name status={status}>Success</Name>
              </>
            )
          case TransactionStatus.FAILED:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13.5355" y="5.05017" width="2" height="12" transform="rotate(45 13.5355 5.05017)" fill="#EF230C" />
                  <rect x="5.05023" y="6.46448" width="2" height="12" transform="rotate(-45 5.05023 6.46448)" fill="#EF230C" />
                </svg>
                <Name status={status}>Failed</Name>
              </>
            )
          default:
            return null
        }
      })()
    }
  </Wrapper>
)
Status.defaultProps = {
  status: TransactionStatus.REFUND,
}
Status.propTypes = {
  status: PropTypes.oneOf([
    TransactionStatus.REFUND,
    TransactionStatus.SUCCESS,
    TransactionStatus.FAILED,
  ]),
}
export default Status
