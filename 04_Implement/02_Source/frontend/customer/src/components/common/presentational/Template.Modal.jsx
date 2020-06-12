import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['loading', 'width']

const Backdrop = styled(resolveTagFromProps(styleModifiers, 'div'))`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.75);
`
const Wrapper = styled(resolveTagFromProps(styleModifiers, 'div'))`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-image: ${(props) => props.theme.grayGradient};
	border-radius: 25px;
	padding: 60px 54px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	width: ${(props) => !props.loading && `${props.width}px`};
	box-sizing: border-box;
`
const Header = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 54px;
	width: 100%;
`
const Name = styled.span`
	font-family: OpenSans-Bold;
	color: #fff;
	font-size: 25px;
`
const CancelButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const CancelButtonText = styled.span`
	font-family: OpenSans-Bold;
	color: ${(props) => props.theme.grayMedium};
	text-transform: uppercase;
	margin-left: 10px;
`
const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`
const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`
const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`
const LoadingDot = styled.div`
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
	& div {
		position: absolute;
		top: 33px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #fff;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	& div:nth-child(1) {
		left: 8px;
		animation: ${ldsEllipsis1} 0.6s infinite;
	}
	& div:nth-child(2) {
		left: 8px;
		animation: ${ldsEllipsis2} 0.6s infinite;
	}
	& div:nth-child(3) {
		left: 32px;
		animation: ${ldsEllipsis2} 0.6s infinite;
	}
	& div:nth-child(4) {
		left: 56px;
		animation: ${ldsEllipsis3} 0.6s infinite;
	}
`
const LoadingWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
`
const MainText = styled.span`
	font-family: OpenSans-Regular;
	color: #fff;
	font-size: 20px;
	margin-right: 40px;
	width: max-content;
`
const SubText = styled.span`
	font-family: OpenSans-Regular;
	color: #fff;
	font-weight: 300;
	font-size: 15px;
	margin-right: 40px;
	width: max-content;
	margin-top: 20px;
`
const SubWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`
const ModalTemplate = ({
	width,
	name,
	loading,
	children,
	onClose,
	disabled,
}) => (
	<Backdrop>
		<Wrapper width={width} loading={loading}>
			{loading ? (
				<LoadingWrapper>
					<SubWrapper>
						<MainText>Please wait</MainText>
						<SubText>
							We&apos;re getting things ready for you{' '}
							<span role='img' aria-label='emoji'>
								&#128516;
							</span>
						</SubText>
					</SubWrapper>
					<LoadingDot>
						<div />
						<div />
						<div />
						<div />
					</LoadingDot>
				</LoadingWrapper>
			) : (
				<>
					<Header>
						<Name>{name}</Name>
						<CancelButton onClick={onClose} type='button' disabled={disabled}>
							<svg
								width='20'
								height='20'
								viewBox='0 0 20 20'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<rect
									x='13.5356'
									y='5.05005'
									width='2'
									height='12'
									transform='rotate(45 13.5356 5.05005)'
									fill='#7C7F87'
								/>
								<rect
									x='5.05029'
									y='6.4646'
									width='2'
									height='12'
									transform='rotate(-45 5.05029 6.4646)'
									fill='#7C7F87'
								/>
							</svg>
							<CancelButtonText>Cancel</CancelButtonText>
						</CancelButton>
					</Header>
					{children}
				</>
			)}
		</Wrapper>
	</Backdrop>
)
ModalTemplate.defaultProps = {
	width: 500,
	name: 'Name',
	children: null,
	loading: false,
	disabled: false,
	onClose: (f) => f,
}
ModalTemplate.propTypes = {
	width: PropTypes.number,
	name: PropTypes.string,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	// children: PropTypes.array,
	onClose: PropTypes.func,
}
export default ModalTemplate
