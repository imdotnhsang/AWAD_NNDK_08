import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'
import { DebtStatus } from '../../../constants/constants'

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
      case DebtStatus.PAID: return (props.theme.green)
      case DebtStatus.UNPAID: return (props.theme.yellow)
      case DebtStatus.CANCELLED: return (props.theme.orange)
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
          case DebtStatus.UNPAID:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="5.5" stroke="#E19F34" />
                  <path d="M9 7C9 6.44772 9.44771 6 10 6C10.5523 6 11 6.44772 11 7V11C11 11.5523 10.5523 12 10 12C9.44771 12 9 11.5523 9 11V7Z" fill="#E19F34" />
                  <path d="M11.7619 8.56434C12.2178 8.25266 12.8401 8.36961 13.1518 8.82554C13.4634 9.28148 13.3465 9.90375 12.8906 10.2154L10.5543 11.8125C10.0983 12.1242 9.47606 12.0072 9.16438 11.5513C8.85271 11.0954 8.96965 10.4731 9.42559 10.1614L11.7619 8.56434Z" fill="#E19F34" />
                </svg>
                <Name status={status}>Unpaid</Name>
              </>
            )
          case DebtStatus.PAID:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10.4142L5.41421 9L9.65685 13.2426L8.24264 14.6569L4 10.4142Z" fill="#27AE60" />
                  <path d="M14.0711 6L15.4853 7.41421L8.41421 14.4853L7 13.0711L14.0711 6Z" fill="#27AE60" />
                </svg>
                <Name status={status}>Paid</Name>
              </>
            )
          case DebtStatus.CANCELLED:
            return (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="13.5355" y="5.05017" width="2" height="12" transform="rotate(45 13.5355 5.05017)" fill="#EF230C" />
                  <rect x="5.05023" y="6.46448" width="2" height="12" transform="rotate(-45 5.05023 6.46448)" fill="#EF230C" />
                </svg>
                <Name status={status}>Cancelled</Name>
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
  status: DebtStatus.UNPAID,
}
Status.propTypes = {
  status: PropTypes.oneOf([
    DebtStatus.UNPAID,
    DebtStatus.PAID,
    DebtStatus.CANCELLED,
  ]),
}
export default Status
