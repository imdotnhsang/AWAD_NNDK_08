import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import Card from './presentational/Card'
import Progress from './presentational/Progress'
import CardList from './presentational/List.Card'
import { selectCard } from '../../actions/cards'
import AddModal from './container/Modal.AddDeposit'
import RemoveModal from './container/Modal.RemoveDeposit'
import CompleteModal from './container/Modal.CompleteDeposit'
import InfoModal from './container/Modal.InfoDeposit'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'

const Wrapper = styled.div`
	width: 100%;
	padding: 0px 60px;
	// padding-bottom: 67px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`
const Text = styled.span`
	font-family: OpenSans-Bold;
	font-size: 15px;
	color: #fff;
	margin-bottom: 45px;
`
const CardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`
const SavingCardSection = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	margin-top: 110px;
`
const Description = styled.span`
	font-family: OpenSans-Regular;
	font-size: 12px;
	color: #fff;
	line-height: 16px;
`
const ActionWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	& > * {
		margin-left: 40px;
	}
	& > *:first-child {
		margin-left: 60px;
	}
`
const ActionButton = styled.button`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

const CardsPage = ({
	currentCard,
	savingCards,
	defaultCard,
	loading,
	onSelectCard,
	onFetchData,
	theme,
}) => {
	const [showAddModal, setShowAddModal] = useState(false)
	const [showRemoveModal, setShowRemoveModal] = useState(false)
	const [showCompleteModal, setShowCompleteModal] = useState(false)
	const [showInfoModal, setShowInfoModal] = useState(false)
	const [showSuccessModal, setShowSuccessModal] = useState(false)
	const [showFailureModal, setShowFailureModal] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [failureMessage, setFailureMessage] = useState('')
	const [scrollTop, setScrollTop] = useState(false)

	const handleOpenAddModal = () => {
		setShowAddModal(true)
	}
	const handleCloseAddModal = () => {
		setShowAddModal(false)
	}

	const handleOpenRemoveModal = () => {
		setShowRemoveModal(true)
	}
	const handleCloseRemoveModal = () => {
		setShowRemoveModal(false)
	}

	const handleOpenCompleteModal = () => {
		setShowCompleteModal(true)
	}
	const handleCloseCompleteModal = () => {
		setShowCompleteModal(false)
	}

	const handleOpenInfoModal = () => {
		setShowInfoModal(true)
	}
	const handleCloseInfoModal = () => {
		setShowInfoModal(false)
	}

	const handleOpenSuccessModal = (message) => {
		setTimeout(() => {
			setShowSuccessModal(true)
			setSuccessMessage(message)
		}, 1000)
		setScrollTop(false)
	}
	const handleCloseSuccessModal = () => {
		setShowSuccessModal(false)
		setSuccessMessage('')
	}

	const handleOpenFailureModal = (message) => {
		setTimeout(() => {
			setShowFailureModal(true)
			setFailureMessage(message)
		}, 1000)
	}
	const handleCloseFailureModal = () => {
		setShowFailureModal(false)
		setFailureMessage('')
	}

	const handleOpenScrollTop = () => {
		setScrollTop(true)
	}
	const handleCloseScrollTop = () => {
		setScrollTop(false)
	}

	const payingCard = defaultCard || {
		accountID: '',
		type: '',
		balance: 0,
		service: 'MASTERCARD',
	}
	const savingCard = (savingCards &&
		savingCards.find((card) => card.account_id === currentCard)) || {
		_id: '',
		account_id: '',
		account_service: 'MASTERCARD',
		balance: 0,
		end_time: 0,
		created_at: 0,
		interest_rate: 0.0,
	}
	const savingCardList = savingCards
	// useEffect(() => {
	// 	onFetchData()
	// }, [onFetchData])
	return (
		<Template
			currentTab={0}
			headerName='Cards'
			headerButton
			headerButtonName='New deposit'
			onHeaderButtonClick={handleOpenAddModal}
		>
			<Wrapper>
				<CardWrapper style={{ marginTop: '44px' }}>
					<Text>Paying card</Text>
					<Card
						cardNumber={payingCard.account_id}
						balance={payingCard.balance}
						service={payingCard.account_service}
						loading={loading}
						date={payingCard.created_at}
						empty={JSON.stringify(defaultCard) === '{}'}
					/>
				</CardWrapper>
				<SavingCardSection>
					<CardWrapper>
						<Text>Saving cards</Text>
						<div style={{ display: 'flex', marginBottom: '24px' }}>
							<Card
								cardNumber={savingCard.account_id}
								balance={savingCard.balance}
								service={savingCard.account_service}
								loading={loading}
								date={savingCard.end_time}
								empty={savingCards.length === 0}
								type={savingCard.account_type}
							/>
							{currentCard !== '' && (
								<ActionWrapper>
									{Date.now() >= savingCard.end_time && (
										<ActionButton
											onClick={handleOpenCompleteModal}
											type='button'
											title={'Complete deposit'}
										>
											<svg
												width='30'
												height='30'
												viewBox='0 0 25 25'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													fillRule='evenodd'
													clipRule='evenodd'
													d='M15 7.5H9.75V17.5H15V7.5ZM16 7.5V17.5H22.5V7.5H16ZM2.5 7.5H8.75V17.5H2.5V7.5ZM12.5 14.375C13.5355 14.375 14.375 13.5355 14.375 12.5C14.375 11.4645 13.5355 10.625 12.5 10.625C11.4645 10.625 10.625 11.4645 10.625 12.5C10.625 13.5355 11.4645 14.375 12.5 14.375Z'
													fill='#EF230C'
												/>
												<path
													d='M17 17.0595L17.9851 16.0793L20.9402 19.0198L19.9552 20L17 17.0595Z'
													fill='white'
												/>
												<path
													d='M24.0149 14L25 14.9802L20.0747 19.8811L19.0896 18.9009L24.0149 14Z'
													fill='white'
												/>
											</svg>
										</ActionButton>
									)}
									{Date.now() < savingCard.end_time && (
										<>
											<ActionButton
												onClick={handleOpenInfoModal}
												type='button'
												title={'Deposit information'}
											>
												<svg
													width='30'
													height='30'
													viewBox='0 0 25 25'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<rect
														x='10.625'
														y='10'
														width='3.75'
														height='10'
														rx='1.875'
														fill='#EF230C'
													/>
													<circle
														cx='12.5'
														cy='6.875'
														r='1.875'
														fill='#EF230C'
													/>
												</svg>
											</ActionButton>
											<ActionButton
												onClick={handleOpenRemoveModal}
												type='button'
												title={'Close Deposit'}
											>
												<svg
													width='30'
													height='30'
													viewBox='0 0 25 25'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M8.30357 18.3333C8.30357 19.25 9.02679 20 9.91071 20H16.3393C17.2232 20 17.9464 19.25 17.9464 18.3333V8.33333H8.30357V18.3333ZM18.75 5.83333H15.9375L15.1339 5H11.1161L10.3125 5.83333H7.5V7.5H18.75V5.83333Z'
														fill='#EF230C'
													/>
												</svg>
											</ActionButton>
										</>
									)}
								</ActionWrapper>
							)}
						</div>
						<Progress
							service={savingCard.account_service}
							term={savingCard.term}
							endTime={savingCard.end_time}
							loading={loading}
							empty={savingCards.length === 0}
						/>
					</CardWrapper>
					{!loading && (
						<CardList
							scrollTop={scrollTop}
							onCloseScrollTop={handleCloseScrollTop}
							value={currentCard}
							data={savingCardList}
							onClick={onSelectCard}
						/>
					)}
				</SavingCardSection>
			</Wrapper>
			{showAddModal && (
				<AddModal
					onScrollTop={handleOpenScrollTop}
					onClose={handleCloseAddModal}
					onSuccess={handleOpenSuccessModal}
					onFailure={handleOpenFailureModal}
				/>
			)}
			{showRemoveModal && (
				<RemoveModal
					id={savingCard._id}
					onScrollTop={handleOpenScrollTop}
					onClose={handleCloseRemoveModal}
					onSuccess={handleOpenSuccessModal}
					onFailure={handleOpenFailureModal}
				/>
			)}
			{showCompleteModal && (
				<CompleteModal
					id={savingCard._id}
					balance={savingCard.balance}
					term={savingCard.term}
					interestRate={savingCard.interest_rate}
					endTime={savingCard.end_time}
					createdAt={savingCard.created_at}
					onScrollTop={handleOpenScrollTop}
					onClose={handleCloseCompleteModal}
					onSuccess={handleOpenSuccessModal}
					onFailure={handleOpenFailureModal}
				/>
			)}
			{showInfoModal && (
				<InfoModal
					id={savingCard._id}
					balance={savingCard.balance}
					term={savingCard.term}
					interestRate={savingCard.interest_rate}
					endTime={savingCard.end_time}
					createdAt={savingCard.created_at}
					onClose={handleCloseInfoModal}
				/>
			)}
			{showSuccessModal && (
				<SuccessModal onClose={handleCloseSuccessModal}>
					<Description>{successMessage}</Description>
				</SuccessModal>
			)}
			{showFailureModal && (
				<FailureModal onClose={handleCloseFailureModal}>
					<Description>
						Something wrong has happened that your action was cancelded
						<br />
						Error message: {failureMessage}
					</Description>
				</FailureModal>
			)}
		</Template>
	)
}

CardsPage.defaultProps = {
	currentCard: '',
	defaultCard: {},
	savingCards: [],
	loading: false,
	onSelectCard: (f) => f,
	onFetchData: (f) => f,
}
CardsPage.propTypes = {
	currentCard: PropTypes.string,
	defaultCard: PropTypes.shape({
		cardNumber: PropTypes.string,
		service: PropTypes.string,
		balance: PropTypes.number,
	}),
	savingCards: PropTypes.arrayOf(
		PropTypes.shape({
			cardNumber: PropTypes.string,
			service: PropTypes.string,
			balance: PropTypes.number,
		})
	),
	loading: PropTypes.bool,
	onSelectCard: PropTypes.func,
	onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
	currentCard: state.cards.currentCard,
	savingCards: state.cards.savingCards,
	defaultCard: state.cards.defaultCard,
	loading: state.cards.loading,
})
const mapDispatchToProps = (dispatch) => ({
	onSelectCard: (value) => dispatch(selectCard(value)),
	// onFetchData: () => dispatch(fetchCardsDataIfNeeded()),
})
export default connect(mapStateToProps, mapDispatchToProps)(CardsPage)
