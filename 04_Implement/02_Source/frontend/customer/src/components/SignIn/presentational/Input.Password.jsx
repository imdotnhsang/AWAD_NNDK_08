import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['error', 'disabled', 'icon']

const Logo = styled.svg`
  margin: 24px 16px;
`
const Title = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-size: 10px;
  margin-bottom: 8px;
  font-family: OpenSans-Regular;
  color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
`
const Input = styled.input`
  width: 100%;
`
const Line = styled(resolveTagFromProps(styleModifiers, 'div'))`
  width: 100%;
  height: 2px;
  background-color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
  transition: background-color 1s ease-in;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`

// eslint-disable-next-line react/jsx-props-no-spreading
const StyledCol = styled(({ icon, ...rest }) => <Col {...rest} />)`
  margin: ${(props) => (!props.icon && '12px 0')};
  padding-left: ${(props) => (!props.icon && '16px')};
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
  background-color: ${(props) => props.theme.blackDark};
  width: 100%;
  opacity: ${(props) => (props.disabled && '0.5')}
`
const EyeButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  margin-left: auto;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

const EmailInput = ({
  label,
  placeholder,
  value,
  error,
  icon,
  disabled,
  onChange,
  onKeyPress,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <Wrapper disabled={disabled}>
      <Col>
        <Row>
          {
            icon && (
              error
                ? (
                  <Logo width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.34567 2.25L1.5 12.375H13.1913L7.34567 2.25ZM7.34567 3.75L2.79904 11.625H11.8923L7.34567 3.75Z" fill="#FFD351" />
                    <path d="M8.09567 10.5C8.09567 10.9142 7.75988 11.25 7.34567 11.25C6.93146 11.25 6.59567 10.9142 6.59567 10.5C6.59567 10.0858 6.93146 9.75 7.34567 9.75C7.75988 9.75 8.09567 10.0858 8.09567 10.5Z" fill="#FFD351" />
                    <path d="M6.59567 6H8.09567V9H6.59567V6Z" fill="#FFD351" />
                  </Logo>
                )
                : (
                  <Logo width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 7C2 6.44772 2.44772 6 3 6H12C12.5523 6 13 6.44772 13 7V12C13 12.5523 12.5523 13 12 13H3C2.44771 13 2 12.5523 2 12V7Z" fill="#EF230C" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 6.5V4.5C10 3.11929 8.88071 2 7.5 2C6.11929 2 5 3.11929 5 4.5V6.5C5 7.88071 6.11929 9 7.5 9C8.88071 9 10 7.88071 10 6.5ZM7.5 1C5.567 1 4 2.567 4 4.5V6.5C4 8.433 5.567 10 7.5 10C9.433 10 11 8.433 11 6.5V4.5C11 2.567 9.433 1 7.5 1Z" fill="#EF230C" />
                  </Logo>
                )
            )
          }
          <StyledCol icon={icon}>
            {error
              ? <Title error>{error}</Title>
              : <Title>{label}</Title>}
            <Input
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              type={showPassword ? 'text' : 'password'}
              disabled={disabled}
              onKeyPress={onKeyPress}
            />
          </StyledCol>
          {showPassword
            ? (
              <EyeButton onClick={() => setShowPassword(false)} type="button">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0)">
                    <path d="M0.75 7.5L0.47265 7.08398L-0.151387 7.5L0.47265 7.91603L0.75 7.5ZM14.25 7.5L14.5274 7.91603L15.1514 7.5L14.5274 7.08398L14.25 7.5ZM8.5 7.5C8.5 8.05228 8.05228 8.5 7.5 8.5V9.5C8.60457 9.5 9.5 8.60457 9.5 7.5H8.5ZM7.5 8.5C6.94772 8.5 6.5 8.05228 6.5 7.5H5.5C5.5 8.60457 6.39543 9.5 7.5 9.5V8.5ZM6.5 7.5C6.5 6.94771 6.94772 6.5 7.5 6.5V5.5C6.39543 5.5 5.5 6.39543 5.5 7.5H6.5ZM7.5 6.5C8.05228 6.5 8.5 6.94771 8.5 7.5H9.5C9.5 6.39543 8.60457 5.5 7.5 5.5V6.5ZM1.02735 7.91603C3.83463 6.0445 5.69348 5.1875 7.5 5.1875C9.30652 5.1875 11.1654 6.0445 13.9726 7.91603L14.5274 7.08398C11.7096 5.2055 9.63098 4.1875 7.5 4.1875C5.36902 4.1875 3.29037 5.2055 0.47265 7.08398L1.02735 7.91603ZM0.47265 7.91603C3.29037 9.79451 5.36902 10.8125 7.5 10.8125C9.63098 10.8125 11.7096 9.79451 14.5274 7.91603L13.9726 7.08398C11.1654 8.9555 9.30652 9.81251 7.5 9.81251C5.69348 9.81251 3.83463 8.9555 1.02735 7.08398L0.47265 7.91603Z" fill="#EF230C" />
                    <rect x="11.4836" y="2.13135" width="1.64817" height="13.184" rx="0.824087" transform="rotate(45 11.4836 2.13135)" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <path d="M0 0H15V15H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </EyeButton>
            )
            : (
              <EyeButton onClick={() => setShowPassword(true)} type="button">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0)">
                    <path d="M0.75 7.5L0.47265 7.08398L-0.151387 7.5L0.47265 7.91603L0.75 7.5ZM14.25 7.5L14.5274 7.91603L15.1514 7.5L14.5274 7.08398L14.25 7.5ZM8.5 7.5C8.5 8.05228 8.05228 8.5 7.5 8.5V9.5C8.60457 9.5 9.5 8.60457 9.5 7.5H8.5ZM7.5 8.5C6.94772 8.5 6.5 8.05228 6.5 7.5H5.5C5.5 8.60457 6.39543 9.5 7.5 9.5V8.5ZM6.5 7.5C6.5 6.94771 6.94772 6.5 7.5 6.5V5.5C6.39543 5.5 5.5 6.39543 5.5 7.5H6.5ZM7.5 6.5C8.05228 6.5 8.5 6.94771 8.5 7.5H9.5C9.5 6.39543 8.60457 5.5 7.5 5.5V6.5ZM1.02735 7.91603C3.83463 6.0445 5.69348 5.1875 7.5 5.1875C9.30652 5.1875 11.1654 6.0445 13.9726 7.91603L14.5274 7.08398C11.7096 5.2055 9.63098 4.1875 7.5 4.1875C5.36902 4.1875 3.29037 5.2055 0.47265 7.08398L1.02735 7.91603ZM0.47265 7.91603C3.29037 9.79451 5.36902 10.8125 7.5 10.8125C9.63098 10.8125 11.7096 9.79451 14.5274 7.91603L13.9726 7.08398C11.1654 8.9555 9.30652 9.81251 7.5 9.81251C5.69348 9.81251 3.83463 8.9555 1.02735 7.08398L0.47265 7.91603Z" fill="#EF230C" />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <path d="M0 0H15V15H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </EyeButton>
            )}
        </Row>
        {error ? <Line error /> : <Line />}
      </Col>
    </Wrapper>
  )
}
EmailInput.defaultProps = {
  label: 'Your password',
  placeholder: 'Enter your password',
  value: '',
  error: '',
  icon: true,
  disabled: false,
  onChange: (f) => f,
  onKeyPress: (f) => f,
}
EmailInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
}

export default EmailInput
