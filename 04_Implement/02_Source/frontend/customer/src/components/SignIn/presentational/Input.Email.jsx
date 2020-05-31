import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['error', 'disabled']

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
  margin-bottom: 30px;
  opacity: ${(props) => (props.disabled && '0.5')}
`

const EmailInput = ({
  value,
  error,
  disabled,
  onChange,
}) => (
  <Wrapper disabled={disabled}>
    <Col>
      <Row>
        {error
          ? (
            <Logo width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.34567 2.25L1.5 12.375H13.1913L7.34567 2.25ZM7.34567 3.75L2.79904 11.625H11.8923L7.34567 3.75Z" fill="#FFD351" />
              <path d="M8.09567 10.5C8.09567 10.9142 7.75988 11.25 7.34567 11.25C6.93146 11.25 6.59567 10.9142 6.59567 10.5C6.59567 10.0858 6.93146 9.75 7.34567 9.75C7.75988 9.75 8.09567 10.0858 8.09567 10.5Z" fill="#FFD351" />
              <path d="M6.59567 6H8.09567V9H6.59567V6Z" fill="#FFD351" />
            </Logo>
          )
          : (
            <Logo width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.3971 3.5C10.3971 4.88071 9.27783 6 7.89711 6C6.5164 6 5.39711 4.88071 5.39711 3.5C5.39711 2.11929 6.5164 1 7.89711 1C9.27783 1 10.3971 2.11929 10.3971 3.5Z" fill="#EF230C" />
              <path d="M7.89711 8L11.7942 14H4L7.89711 8Z" fill="#EF230C" />
            </Logo>
          )}
        <Col style={{ paddingRight: '16px' }}>
          {error
            ? <Title error>{error}</Title>
            : <Title>Your email</Title>}
          <Input placeholder="Enter your email" value={value} onChange={onChange} disabled={disabled} />
        </Col>
      </Row>
      {error ? <Line error /> : <Line />}
    </Col>
  </Wrapper>
)
EmailInput.defaultProps = {
  value: '',
  error: '',
  disabled: false,
  onChange: (f) => f,
}
EmailInput.propTypes = {
  value: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}

export default EmailInput
