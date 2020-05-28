import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { toast } from 'react-toastify'

const Wrapper = styled.div`
  width: 350px;
  background-color: ${(props) => props.theme.blackMedium};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const LogoWrapper = styled.div`
  padding: 16px 16px;
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
`
const Error = ({
  message,
}) => (
  <Wrapper>
    <LogoWrapper>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M14.6913 4.5L3.00001 24.75H26.3827L14.6913 4.5ZM14.6913 7.5L5.59808 23.25H23.7846L14.6913 7.5Z" fill="#F1C40F" />
        <path d="M16.1913 21C16.1913 21.8284 15.5198 22.5 14.6913 22.5C13.8629 22.5 13.1913 21.8284 13.1913 21C13.1913 20.1716 13.8629 19.5 14.6913 19.5C15.5198 19.5 16.1913 20.1716 16.1913 21Z" fill="#F1C40F" />
        <path d="M13.1913 12H16.1913V18H13.1913V12Z" fill="#F1C40F" />
      </svg>
    </LogoWrapper>
    <Text>{message}</Text>
  </Wrapper>
)

Error.defaultProps = {
  message: '',
}
Error.propTypes = {
  message: PropTypes.string,
}
export default Error

export const showError = (message) => {
  toast(<Error message={message} />)
}
