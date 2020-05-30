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
  <Loading width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M7.5 25C7.5 15.5596 15.5596 7.5 25 7.5C34.4404 7.5 42.5 15.5596 42.5 25C42.5 25.6904 41.9404 26.25 41.25 26.25C40.5596 26.25 40 25.6904 40 25C40 16.9404 33.0596 10 25 10C16.9404 10 10 16.9404 10 25C10 25.6904 9.44036 26.25 8.75 26.25C8.05964 26.25 7.5 25.6904 7.5 25Z" fill="#EF230C" />
    <path fillRule="evenodd" clipRule="evenodd" d="M8.75 23.75C9.44036 23.75 10 24.3096 10 25C10 33.0596 16.9404 40 25 40C27.0964 40 30.0135 39.4211 32.6827 37.9651C35.3332 36.5194 37.6848 34.2427 38.8141 30.8547C39.0325 30.1998 39.7404 29.8458 40.3953 30.0641C41.0502 30.2825 41.4042 30.9904 41.1859 31.6453C39.8152 35.7573 36.9585 38.4806 33.8798 40.1599C30.8198 41.8289 27.487 42.5 25 42.5C15.5596 42.5 7.5 34.4404 7.5 25C7.5 24.3096 8.05964 23.75 8.75 23.75Z" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="8.75" y1="25" x2="43.75" y2="25" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EF230C" stopOpacity="0.81" />
        <stop offset="1" stopColor="#EF230C" stopOpacity="0" />
      </linearGradient>
    </defs>
  </Loading>
)

export default LoadingForTable
