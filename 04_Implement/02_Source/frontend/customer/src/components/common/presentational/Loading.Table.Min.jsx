import React from 'react'
import styled, { keyframes } from 'styled-components'

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

const LoadingForTable = () => (
  <Loading width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M4.5 15C4.5 9.33579 9.33579 4.5 15 4.5C20.6642 4.5 25.5 9.33579 25.5 15C25.5 15.4142 25.1642 15.75 24.75 15.75C24.3358 15.75 24 15.4142 24 15C24 10.1642 19.8358 6 15 6C10.1642 6 6 10.1642 6 15C6 15.4142 5.66421 15.75 5.25 15.75C4.83579 15.75 4.5 15.4142 4.5 15Z" fill="#EF230C" />
    <path fillRule="evenodd" clipRule="evenodd" d="M5.25 14.25C5.66421 14.25 6 14.5858 6 15C6 19.8358 10.1642 24 15 24C16.2578 24 18.0081 23.6526 19.6096 22.7791C21.1999 21.9116 22.6109 20.5456 23.2885 18.5128C23.4195 18.1199 23.8442 17.9075 24.2372 18.0385C24.6301 18.1695 24.8425 18.5942 24.7115 18.9872C23.8891 21.4544 22.1751 23.0884 20.3279 24.0959C18.4919 25.0974 16.4922 25.5 15 25.5C9.33579 25.5 4.5 20.6642 4.5 15C4.5 14.5858 4.83579 14.25 5.25 14.25Z" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="5.25" y1="15" x2="26.25" y2="15" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF230C" stopOpacity="0.81" />
        <stop offset="1" stopColor="#EF230C" stopOpacity="0" />
      </linearGradient>
    </defs>
  </Loading>
)

export default LoadingForTable
