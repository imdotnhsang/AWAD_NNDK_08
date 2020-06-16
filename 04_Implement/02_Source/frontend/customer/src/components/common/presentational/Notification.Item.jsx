import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { milisecondToDatetime } from '../../../utils/utils'

const Wrapper = styled.div`
	width: 350px;
	// background-color: ${(props) => props.theme.blackMedium};
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`
const LogoWrapper = styled.div`
	padding: 16px 16px;
`
const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	padding-right: 10px;
`
const Text = styled.span`
	font-family: OpenSans-Regular;
	color: #fff;
	font-size: 12px;
	line-height: 16px;
`
const Icon = [
	{
		name: 'lender-remove-debt',
		component: (
			<svg
				width='30'
				height='30'
				viewBox='0 0 30 30'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M23.25 24.0002H6.75C6.75 5.25021 10.5 6.75022 15 6.75022C19.5 6.75022 23.25 5.25021 23.25 24.0002Z'
					fill='#27AE60'
				/>
				<path
					d='M15 4.5C13.8 4.5 13.5 5.75 13.5 6.75H16.5C16.5 5.75 16.2 4.5 15 4.5Z'
					fill='#27AE60'
				/>
				<path d='M13.5 26.25H16.5' stroke='#27AE60' strokeLinecap='round' />
				<path
					d='M20.0303 22.5909C19.7374 22.298 19.7374 21.8231 20.0303 21.5302C20.3232 21.2373 20.7981 21.2373 21.091 21.5302L24.273 24.7122C24.5659 25.0051 24.5659 25.48 24.273 25.7729C23.9801 26.0658 23.5052 26.0658 23.2123 25.7729L20.0303 22.5909Z'
					fill='white'
				/>
				<path
					d='M23.2123 21.5303C23.5052 21.2374 23.9801 21.2374 24.273 21.5303C24.5659 21.8232 24.5659 22.2981 24.273 22.591L21.091 25.773C20.7981 26.0659 20.3232 26.0659 20.0303 25.773C19.7375 25.4801 19.7375 25.0052 20.0303 24.7123L23.2123 21.5303Z'
					fill='white'
				/>
			</svg>
		),
	},
	{
		name: 'debtor-remove-debt',
		component: (
			<svg
				width='30'
				height='30'
				viewBox='0 0 30 30'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M23.25 24.0002H6.75C6.75 5.25021 10.5 6.75022 15 6.75022C19.5 6.75022 23.25 5.25021 23.25 24.0002Z'
					fill='#EF230C'
				/>
				<path
					d='M15 4.5C13.8 4.5 13.5 5.75 13.5 6.75H16.5C16.5 5.75 16.2 4.5 15 4.5Z'
					fill='#EF230C'
				/>
				<path d='M13.5 26.25H16.5' stroke='#EF230C' strokeLinecap='round' />
				<path
					d='M20.0303 22.5909C19.7374 22.298 19.7374 21.8231 20.0303 21.5302C20.3232 21.2373 20.7981 21.2373 21.091 21.5302L24.273 24.7122C24.5659 25.0051 24.5659 25.48 24.273 25.7729C23.9801 26.0658 23.5052 26.0658 23.2123 25.7729L20.0303 22.5909Z'
					fill='white'
				/>
				<path
					d='M23.2123 21.5303C23.5052 21.2374 23.9801 21.2374 24.273 21.5303C24.5659 21.8232 24.5659 22.2981 24.273 22.591L21.091 25.773C20.7981 26.0659 20.3232 26.0659 20.0303 25.773C19.7375 25.4801 19.7375 25.0052 20.0303 24.7123L23.2123 21.5303Z'
					fill='white'
				/>
			</svg>
		),
	},
	{
		name: 'repay',
		component: (
			<svg
				width='30'
				height='30'
				viewBox='0 0 30 30'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M3 9C3 7.34315 4.34315 6 6 6H24C25.6569 6 27 7.34315 27 9V12H3V9Z'
					fill='#2D9CDB'
				/>
				<path
					d='M3 13.5H27V21C27 22.6569 25.6569 24 24 24H6C4.34315 24 3 22.6569 3 21V13.5Z'
					fill='#2D9CDB'
				/>
				<path
					d='M26.4107 20.3788C26.7036 20.086 27.1784 20.086 27.4713 20.3788C27.7642 20.6717 27.7642 21.1466 27.4713 21.4395L24.2894 24.6215C23.9965 24.9144 23.5216 24.9144 23.2287 24.6215C22.9358 24.3286 22.9358 23.8537 23.2287 23.5608L26.4107 20.3788Z'
					fill='white'
				/>
				<path
					d='M21.5303 23.0302C21.2374 22.7373 21.2374 22.2624 21.5303 21.9696C21.8232 21.6767 22.2981 21.6767 22.591 21.9696L24.1867 23.5652C24.4795 23.8581 24.4795 24.333 24.1867 24.6259C23.8938 24.9188 23.4189 24.9188 23.126 24.6259L21.5303 23.0302Z'
					fill='white'
				/>
			</svg>
		),
	},
	{
		name: 'transfer',
		component: (
			<svg
				width='30'
				height='30'
				viewBox='0 0 30 30'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M6 10.5001L10.5 6.60303V14.3973L6 10.5001Z' fill='#F1C40F' />
				<path d='M10.5 9.00014H24V12.0001H10.5V9.00014Z' fill='#F1C40F' />
				<path d='M24 19.5001L19.5 23.3973V15.603L24 19.5001Z' fill='#F1C40F' />
				<path d='M6 18.0001H19.5V21.0001H6V18.0001Z' fill='#F1C40F' />
			</svg>
		),
	},
]
const NotificationItem = ({ type, message, time }) => {
	let icon = null
	switch (type) {
		case 1:
			icon = Icon[1].component
			break
		case 2:
			icon = Icon[2].component
			break
		case 3:
			icon = Icon[3].component
			break
		default: {
			icon = Icon[0].component
			break
		}
	}
	return (
		<Wrapper>
			<LogoWrapper>{icon}</LogoWrapper>
			<ContentWrapper>
				<Text>{message}</Text>
				<Text>{milisecondToDatetime(time)}</Text>
			</ContentWrapper>
		</Wrapper>
	)
}
NotificationItem.defaultProps = {
	type: 1,
	message: '',
	time: new Date().getTime(),
}
NotificationItem.propTypes = {
	type: PropTypes.number,
	message: PropTypes.string,
	time: PropTypes.number,
}
export default NotificationItem
