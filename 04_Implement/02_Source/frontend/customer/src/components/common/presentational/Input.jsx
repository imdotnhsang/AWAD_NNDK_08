import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const Title = styled.span`
  font-size: 10px;
  margin-bottom: 8px;
  font-family: OpenSans-Regular;
  color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
`
const Input = styled.input`
  width: 100%;
`
const Line = styled.div`
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
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.blackDark};
  width: 100%;
  opacity: ${(props) => (props.disabled && '0.5')}
`
const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`
const Loading = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 2s linear infinite;
`

const GeneralInput = ({
  label,
  placeholder,
  value,
  error,
  type,
  disabled,
  loading,
  onChange,
  onKeyPress,
  onBlur,
}) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <Wrapper disabled={disabled || loading}>
      <Col>
        <Row>
          <Col style={{ margin: '12px 0', paddingLeft: '16px', paddingRight: '16px' }}>
            {error
              ? <Title error>{error}</Title>
              : <Title>{label}</Title>}
            <Input
              type={type}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              disabled={disabled}
              onKeyPress={onKeyPress}
              onBlur={onBlur}
            />
          </Col>
        </Row>
        {error ? <Line error /> : <Line />}
      </Col>
    </Wrapper>
    {
      loading
        && (
        <Loading width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3 10C3 6.22386 6.22386 3 10 3C13.7761 3 17 6.22386 17 10C17 10.2761 16.7761 10.5 16.5 10.5C16.2239 10.5 16 10.2761 16 10C16 6.77614 13.2239 4 10 4C6.77614 4 4 6.77614 4 10C4 10.2761 3.77614 10.5 3.5 10.5C3.22386 10.5 3 10.2761 3 10Z" fill="#EF230C" />
          <path fillRule="evenodd" clipRule="evenodd" d="M3.5 9.5C3.77614 9.5 4 9.72386 4 10C4 13.2239 6.77614 16 10 16C10.8385 16 12.0054 15.7684 13.0731 15.1861C14.1333 14.6078 15.0739 13.6971 15.5257 12.3419C15.613 12.0799 15.8961 11.9383 16.1581 12.0257C16.4201 12.113 16.5617 12.3961 16.4743 12.6581C15.9261 14.3029 14.7834 15.3922 13.5519 16.0639C12.3279 16.7316 10.9948 17 10 17C6.22386 17 3 13.7761 3 10C3 9.72386 3.22386 9.5 3.5 9.5Z" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="3.5" y1="10" x2="17.5" y2="10" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF230C" stopOpacity="0.81" />
              <stop offset="1" stopColor="#EF230C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </Loading>
        )
    }
  </div>
)
GeneralInput.defaultProps = {
  label: '',
  placeholder: '',
  value: '',
  error: '',
  type: 'text',
  disabled: false,
  loading: false,
  onChange: (f) => f,
  onKeyPress: (f) => f,
  onBlur: (f) => f,
}
GeneralInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
}
export default GeneralInput
