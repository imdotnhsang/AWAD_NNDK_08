import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import NotificationItem from './Notification.Item'
import ScrollArea from 'react-scrollbar'
import Loading from '../../common/presentational/Loading.Table'

const Wrapper = styled.div`
	width: 100%;
	padding: 50px 60px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	box-sizing: border-box;
	justify-content: space-between;
`
const Name = styled.span`
	font-family: OpenSans-Bold;
	color: #fff;
	font-size: 25px;
	margin-right: 60px;
`
const Button = styled.button`
	padding: 16px 24px;
	background-color: ${(props) => props.theme.blackMedium};
	transition: border 0.5s ease-out;
	border: ${(props) => `2px solid ${props.theme.blackMedium}`};
	&:hover {
		border: ${(props) => `2px solid ${props.theme.orange}`};
	}
	border-radius: 10px;
	cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const ButtonName = styled.span`
	font-family: OpenSans-Regular;
	font-size: 15px;
	color: #fff;
	margin-right: 20px;
`
const ButtonNotification = styled.button`
	width: 40px;
	height: 40px;
	position: relative;
	cursor: pointer;
`
const NewNotification = styled.span`
	position: absolute;
	right: 10%;
	top: 10%;
	background: #ef230c;
	width: 6px;
	height: 6px;
	border-radius: 50%;
	display: ${(props) => (props.disabled ? 'none' : 'block')};
`

const PageHeader = ({ name, button, buttonName, onClick }) => {
	const [showNotification, setShowNotification] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleOpenAndCloseNotification = () => {
		setShowNotification(!showNotification)
	}
	const handleCloseNotification = () => {
		setShowNotification(false)
	}

	return (
		<Wrapper>
			<div>
				<Name>{name}</Name>
				{button && (
					<Button onClick={onClick} type='button'>
						<ButtonName>{buttonName}</ButtonName>
						<svg
							width='15'
							height='16'
							viewBox='0 0 15 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<rect x='6.75' y='3.5' width='1.5' height='9' fill='#EF230C' />
							<rect
								x='3'
								y='8.75'
								width='1.5'
								height='9'
								transform='rotate(-90 3 8.75)'
								fill='#EF230C'
							/>
						</svg>
					</Button>
				)}
			</div>
			<ButtonNotification onClick={handleOpenAndCloseNotification}>
				<NewNotification />
				<svg
					width='27'
					height='27'
					viewBox='0 0 9 12'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M8.25 10.0001H0C0 0.6251 1.875 1.37511 4.125 1.37511C6.375 1.37511 8.25 0.6251 8.25 10.0001Z'
						fill='white'
					/>
					<path
						d='M4.125 0.25C3.525 0.25 3.375 0.875 3.375 1.375H4.875C4.875 0.875 4.725 0.25 4.125 0.25Z'
						fill='white'
					/>
					<path d='M3.375 11.125H4.875' stroke='white' />
				</svg>
			</ButtonNotification>
			{showNotification && (
				<ScrollArea
					speed={0.5}
					horizontal={false}
					style={{
						maxHeight: '352px',
						position: 'absolute',
						top: 'calc(50px + 6%)',
						right: '60px',
						borderRadius: '10px',
						transition: '1s',
						background: 'linear-gradient(180deg, #26292E 0%, #16181C 100%)',
					}}
					contentStyle={{
						paddingTop: '10px',
						paddingBottom: '10px',
					}}
					verticalScrollbarStyle={{
						width: '5px',
						backgroundColor: '#7C7F87',
						borderRadius: '10px',
					}}
					verticalContainerStyle={{
						width: '5px',
						backgroundImage:
							'linear-gradient(180deg, #26292E 0%, #16181C 100%)',
						borderRadius: '10px',
						right: '0px',
					}}
					smoothScrolling
				>
					<NotificationItem
						type={0}
						message={
							'Your lender (Justin Doe/ 4089) has removed a debt reminder of you'
						}
						time={Date.now()}
						radiusTop
					></NotificationItem>
					<NotificationItem
						type={1}
						message={
							'Your debtor (Justin Doe/ 4089) has removed a debt reminder of you'
						}
						time={Date.now()}
						radiusTop
					></NotificationItem>
					<NotificationItem
						type={2}
						message={'Your debtor (Justin Doe/ 4089) has repaid a debt to you'}
						time={Date.now()}
					></NotificationItem>
					<NotificationItem
						type={3}
						message={
							'Your lender (Justin Doe/ 4089) has removed a debt reminder of you'
						}
						time={Date.now()}
						radiusBottom
					></NotificationItem>
					<NotificationItem
						type={3}
						message={
							'Your lender (Justin Doe/ 4089) has removed a debt reminder of you'
						}
						time={Date.now()}
						radiusBottom
					></NotificationItem>
					<NotificationItem
						type={3}
						message={
							'Your lender (Justin Doe/ 4089) has removed a debt reminder of you'
						}
						time={Date.now()}
						radiusBottom
					></NotificationItem>
				</ScrollArea>
			)}
		</Wrapper>
	)
}

PageHeader.defaultProps = {
	name: '',
	button: false,
	buttonName: '',
	onClick: (f) => f,
}
PageHeader.propTypes = {
	name: PropTypes.string,
	button: PropTypes.bool,
	buttonName: PropTypes.string,
	onClick: PropTypes.func,
}
export default PageHeader
