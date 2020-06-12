import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import {
	commaSeparating,
	spaceSeparating,
	getMonthYear,
	resolveTagFromProps,
} from '../../../utils/utils'

const styleModifiers = ['loading', 'empty', 'service']

const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	width: 275px;
	padding: 28px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	position: relative;
	background-image: ${(props) => {
		if (props.empty || props.loading) return 'none'
		return props.service === 'MASTERCARD'
			? 'linear-gradient(134.46deg, #111111 21.13%, #EF230C 70.45%)'
			: 'linear-gradient(134.46deg, #111111 21.13%, #2C41FF 70.45%)'
	}};
	background-color: #fff;
	box-sizing: border-box;
	z-index: 2;
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
const Money = styled(resolveTagFromProps(styleModifiers, 'span'))`
	font-family: OpenSans-Regular;
	font-size: 20px;
	color: #fff;
	display: flex;
	letter-spacing: 0.1em;
	margin-top: 24px;
	margin-bottom: 16px;
	opacity: ${(props) => props.empty && '0'};
`
const CardNumber = styled(resolveTagFromProps(styleModifiers, 'span'))`
	font-family: OpenSans-Regular;
	font-size: 15px;
	color: ${(props) => props.theme.grayMedium};
	opacity: ${(props) => (props.loading || props.empty) && '0'};
`
const Date = styled(resolveTagFromProps(styleModifiers, 'span'))`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: ${(props) => props.theme.grayMedium};
	opacity: ${(props) => (props.loading || props.empty) && '0'};
`
const Logo = styled.svg`
	position: absolute;
	bottom: 28px;
	right: 28px;
`
const OuterWrapper = styled.div`
	position: relative;
	&:before {
		content: '';
		width: 215px;
		height: 13px;
		background-image: ${(props) => props.theme.grayGradient};
		border-radius: 10px 10px 0px 0px;
		position: absolute;
		top: -17px;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 0;
	}
	&:after {
		content: '';
		width: 247px;
		height: 20px;
		background-color: ${(props) => props.theme.grayMedium};
		border-radius: 15px 15px 0px 0px;
		position: absolute;
		top: -9px;
		left: 50%;
		transform: translate(-50%, 0);
		z-index: 1;
	}
`
const BankLogo = styled(resolveTagFromProps(styleModifiers, 'svg'))`
	opacity: ${(props) => (props.loading || props.empty) && '0'};
`
const NoCard = styled.p`
	font-family: OpenSans-Regular;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin: 0;
	font-size: 15px;
`

const Card = ({ service, balance, cardNumber, date, loading, empty }) => (
	<OuterWrapper>
		<Wrapper service={service} loading={loading} empty={empty}>
			{loading && (
				<Loading
					width='40'
					height='40'
					viewBox='0 0 40 40'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M6 20C6 12.4477 12.4477 6 20 6C27.5523 6 34 12.4477 34 20C34 20.5523 33.5523 21 33 21C32.4477 21 32 20.5523 32 20C32 13.5523 26.4477 8 20 8C13.5523 8 8 13.5523 8 20C8 20.5523 7.55228 21 7 21C6.44772 21 6 20.5523 6 20Z'
						fill='#EF230C'
					/>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M7 19C7.55228 19 8 19.4477 8 20C8 26.4477 13.5523 32 20 32C21.6771 32 24.0108 31.5368 26.1461 30.3721C28.2665 29.2155 30.1478 27.3942 31.0513 24.6838C31.226 24.1598 31.7923 23.8767 32.3162 24.0513C32.8402 24.226 33.1233 24.7923 32.9487 25.3162C31.8522 28.6058 29.5668 30.7845 27.1039 32.1279C24.6559 33.4632 21.9896 34 20 34C12.4477 34 6 27.5523 6 20C6 19.4477 6.44772 19 7 19Z'
						fill='url(#paint0_linear)'
					/>
					<defs>
						<linearGradient
							id='paint0_linear'
							x1='7'
							y1='20'
							x2='35'
							y2='20'
							gradientUnits='userSpaceOnUse'
						>
							<stop stopColor='#EF230C' stopOpacity='0.81' />
							<stop offset='1' stopColor='#EF230C' stopOpacity='0' />
						</linearGradient>
					</defs>
				</Loading>
			)}
			{!loading && empty && <NoCard>No card</NoCard>}
			<BankLogo
				loading={loading}
				empty={empty}
				width='87'
				height='15'
				viewBox='0 0 87 15'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M7.46939 4.52929V6.17321H1.81421V8.91308H6.89326V10.4681H1.81421V13.2376H7.65132V14.8816H0.025177V4.52929H7.46939Z'
					fill='white'
				/>
				<path
					d='M9.94518 4.52929H11.7342V14.8816H9.94518V4.52929Z'
					fill='white'
				/>
				<path
					d='M22.0064 9.84612H23.7954V13.3857C22.7948 14.4619 21.3645 15 19.5048 15C17.9381 15 16.6241 14.4965 15.5628 13.4894C14.5116 12.4823 13.986 11.2086 13.986 9.6684C13.986 8.12814 14.5217 6.8446 15.5931 5.81777C16.6746 4.79094 17.9785 4.27752 19.5048 4.27752C21.031 4.27752 22.2995 4.71195 23.3102 5.58081L22.3551 6.91372C21.9407 6.56815 21.5212 6.33119 21.0967 6.20283C20.6823 6.0646 20.1971 5.99549 19.6412 5.99549C18.5698 5.99549 17.6702 6.33612 16.9425 7.01739C16.2147 7.68878 15.8509 8.57738 15.8509 9.68321C15.8509 10.7792 16.2046 11.6628 16.9122 12.3342C17.6197 12.9957 18.4738 13.3265 19.4744 13.3265C20.4852 13.3265 21.3292 13.1142 22.0064 12.6897V9.84612Z'
					fill='white'
				/>
				<path
					d='M26.1429 14.8816V4.52929H27.932V9.01675H33.1929V4.52929H34.982V14.8816H33.1929V10.6459H27.932V14.8816H26.1429Z'
					fill='white'
				/>
				<path
					d='M41.9311 6.12878V14.8816H40.142V6.12878H36.9278V4.52929H45.1453V6.12878H41.9311Z'
					fill='white'
				/>
				<path
					d='M46.0534 14.6742C45.8412 14.457 45.735 14.1954 45.735 13.8893C45.735 13.5832 45.8412 13.3265 46.0534 13.1192C46.2758 12.9019 46.5436 12.7933 46.857 12.7933C47.1703 12.7933 47.4381 12.9019 47.6605 13.1192C47.8829 13.3265 47.9941 13.5832 47.9941 13.8893C47.9941 14.1954 47.8829 14.457 47.6605 14.6742C47.4381 14.8914 47.1703 15 46.857 15C46.5436 15 46.2758 14.8914 46.0534 14.6742Z'
					fill='white'
				/>
				<path
					d='M55.0937 14.8816H50.4543V4.52929H54.5782C55.2959 4.52929 55.9124 4.61321 56.4279 4.78106C56.9535 4.94891 57.3426 5.176 57.5953 5.46233C58.0805 5.99549 58.3231 6.59777 58.3231 7.26916C58.3231 8.07878 58.0603 8.68106 57.5347 9.07599C57.3426 9.21422 57.2112 9.30308 57.1405 9.34257C57.0697 9.37219 56.9434 9.4265 56.7615 9.50549C57.4184 9.64371 57.939 9.93498 58.3231 10.3793C58.7173 10.8137 58.9144 11.3567 58.9144 12.0084C58.9144 12.7291 58.6617 13.366 58.1563 13.9189C57.56 14.5607 56.5391 14.8816 55.0937 14.8816ZM52.2434 8.82422H54.5176C55.8113 8.82422 56.4582 8.39473 56.4582 7.53574C56.4582 7.04207 56.3016 6.68663 55.9882 6.46941C55.6749 6.2522 55.1897 6.14359 54.5327 6.14359H52.2434V8.82422ZM52.2434 13.2673H55.0482C55.7052 13.2673 56.2055 13.1685 56.5492 12.971C56.903 12.7637 57.0798 12.3786 57.0798 11.8159C57.0798 10.8976 56.3268 10.4385 54.8208 10.4385H52.2434V13.2673Z'
					fill='white'
				/>
				<path
					d='M67.451 14.8816H65.9046V13.83C65.2375 14.61 64.3429 15 63.221 15C62.3821 15 61.6847 14.768 61.1287 14.304C60.5829 13.8399 60.31 13.2228 60.31 12.4527C60.31 11.6727 60.6032 11.0902 61.1894 10.7051C61.7756 10.32 62.5691 10.1275 63.5697 10.1275H65.7681V9.83131C65.7681 8.78473 65.1718 8.26144 63.9791 8.26144C63.2311 8.26144 62.4528 8.52802 61.6442 9.06118L60.8862 8.02447C61.8666 7.26422 62.9784 6.8841 64.2217 6.8841C65.1718 6.8841 65.945 7.12106 66.5413 7.59498C67.1478 8.05903 67.451 8.7946 67.451 9.80169V14.8816ZM65.753 11.9492V11.2827H63.8426C62.6196 11.2827 62.0081 11.6579 62.0081 12.4083C62.0081 12.7933 62.1597 13.0895 62.4629 13.2969C62.7662 13.4943 63.1856 13.5931 63.7213 13.5931C64.2671 13.5931 64.7422 13.445 65.1465 13.1488C65.5508 12.8526 65.753 12.4527 65.753 11.9492Z'
					fill='white'
				/>
				<path
					d='M71.5129 10.6162V14.8816H69.8149V7.00258H71.5129V8.43916C71.7859 7.95536 72.1598 7.57523 72.6349 7.29878C73.1201 7.02232 73.6406 6.8841 74.1965 6.8841C75.1062 6.8841 75.839 7.15562 76.3949 7.69865C76.9609 8.24169 77.2439 9.02662 77.2439 10.0535V14.8816H75.5459V10.557C75.5459 9.10561 74.9293 8.37992 73.6962 8.37992C73.1099 8.37992 72.5995 8.57245 72.1649 8.95751C71.7303 9.3327 71.5129 9.88561 71.5129 10.6162Z'
					fill='white'
				/>
				<path
					d='M81.3145 14.8816H79.6164V3.89246H81.3145V10.3497L84.5894 7.00258H86.7726L83.71 10.1275L87 14.8816H84.9381L82.5426 11.4308L81.3145 12.6452V14.8816Z'
					fill='white'
				/>
				<path d='M0 1.62911V0H41.2388L45.1808 1.62911H0Z' fill='#EF230C' />
			</BankLogo>
			<Money empty={empty}>
				<sup>
					<sup>₫</sup>
				</sup>
				{commaSeparating(balance, 3)}
			</Money>
			<CardNumber loading={loading} empty={empty}>
				{spaceSeparating(cardNumber, 3)}
			</CardNumber>
			<Date loading={loading} empty={empty}>
				{getMonthYear(date)}
			</Date>
			{!(loading || empty) &&
				(service === 'MASTERCARD' ? (
					<Logo
						width='30'
						height='19'
						viewBox='0 0 30 19'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<ellipse
							cx='9.59355'
							cy='9.1797'
							rx='8.85105'
							ry='9.01197'
							fill='#F66071'
						/>
						<ellipse
							cx='20.2148'
							cy='9.1797'
							rx='8.85105'
							ry='9.01197'
							fill='#FFA522'
						/>
					</Logo>
				) : (
					<Logo
						width='56'
						height='18'
						viewBox='0 0 56 18'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<g clipPath='url(#clip0)'>
							<path
								d='M24.101 17.7403H19.5955L22.4135 0.315796H26.9187L24.101 17.7403Z'
								fill='white'
							/>
							<path
								d='M40.4335 0.741707C39.5449 0.389148 38.1354 -0.00012207 36.3925 -0.00012207C31.9432 -0.00012207 28.8101 2.37245 28.7909 5.76451C28.7539 8.26717 31.0341 9.6572 32.7395 10.4917C34.4826 11.3444 35.0751 11.9009 35.0751 12.661C35.0574 13.8283 33.6666 14.3664 32.3695 14.3664C30.5707 14.3664 29.6069 14.089 28.1422 13.4395L27.5489 13.1611L26.9185 17.0725C27.9752 17.5539 29.922 17.9812 31.9432 17.9999C36.6707 17.9999 39.7484 15.664 39.7848 12.0492C39.8028 10.0657 38.5988 8.54582 36.003 7.30385C34.4272 6.50659 33.4621 5.969 33.4621 5.15326C33.4806 4.41168 34.2784 3.65211 36.0572 3.65211C37.5219 3.61491 38.598 3.96697 39.4133 4.31929L39.8208 4.50431L40.4335 0.741707Z'
								fill='white'
							/>
							<path
								d='M46.4216 11.5674C46.7926 10.5664 48.2203 6.69217 48.2203 6.69217C48.2016 6.72938 48.5906 5.67268 48.8131 5.02398L49.128 6.52538C49.128 6.52538 49.9811 10.6962 50.1664 11.5674C49.4623 11.5674 47.3115 11.5674 46.4216 11.5674ZM51.9829 0.315796H48.498C47.4233 0.315796 46.6068 0.63066 46.1432 1.76151L39.451 17.74H44.1783C44.1783 17.74 44.9566 15.5894 45.1239 15.1263C45.6425 15.1263 50.2413 15.1263 50.9085 15.1263C51.0378 15.738 51.4461 17.74 51.4461 17.74H55.6176L51.9829 0.315796Z'
								fill='white'
							/>
							<path
								d='M15.8324 0.315796L11.4201 12.1976L10.938 9.78785C10.1222 7.00729 7.56389 3.98626 4.70892 2.48412L8.75042 17.7218H13.5148L20.5965 0.315796H15.8324Z'
								fill='white'
							/>
							<path
								d='M7.32294 0.315796H0.0741579L0 0.667863C5.65451 2.11382 9.39937 5.59926 10.938 9.78859L9.36217 1.78048C9.10274 0.667616 8.30548 0.352505 7.32294 0.315796Z'
								fill='#FAA61A'
							/>
						</g>
						<defs>
							<clipPath id='clip0'>
								<path d='M0 0H55.6177V18H0V0Z' fill='white' />
							</clipPath>
						</defs>
					</Logo>
				))}
		</Wrapper>
	</OuterWrapper>
)

Card.defaultProps = {
	service: 'MASTERCARD',
	balance: 0,
	cardNumber: '000000000000000',
	date: 1590655820911,
	loading: false,
	empty: false,
}
Card.propTypes = {
	service: PropTypes.string,
	balance: PropTypes.number,
	cardNumber: PropTypes.string,
	date: PropTypes.number,
	loading: PropTypes.bool,
	empty: PropTypes.bool,
}
export default Card
