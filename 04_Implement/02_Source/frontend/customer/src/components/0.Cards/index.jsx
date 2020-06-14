import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import Card from './presentational/Card'
import CardList from './presentational/List.Card'
import { selectCard, fetchCardsDataIfNeeded } from '../../actions/cards'

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
// const NoSavingCard = styled.span`
// 	font-family: OpenSans-Regular;
// 	font-size: 15px;
// 	color: #fff;
// 	line-height: 16px;
// `

const CardsPage = ({
	currentCard,
	savingCards,
	defaultCard,
	loading,
	onSelectCard,
	onFetchData,
}) => {
	// console.log(cards)
	const payingCard = defaultCard || {
		accountID: '',
		type: '',
		balance: 0,
		service: 'MASTERCARD',
	}
	const savingCard = (savingCards &&
		savingCards.find((card) => card.account_id === currentCard)) || {
		accountID: '',
		type: '',
		balance: 0,
		service: 'MASTERCARD',
	}
	const savingCardList = savingCards
	// console.log(savingCardList)
	useEffect(() => {
		onFetchData()
	}, [onFetchData])
	return (
		<Template
			currentTab={0}
			headerName='Cards'
			// headerButton
			// headerButtonName='New deposit'
			// onHeaderButtonClick={this.handleOpenAddModal}
		>
			<Wrapper>
				<CardWrapper style={{ marginTop: '44px' }}>
					<Text>Paying card</Text>
					<Card
						cardNumber={payingCard.account_id}
						balance={payingCard.balance}
						service={payingCard.account_service}
						loading={loading}
						empty={defaultCard === {}}
					/>
				</CardWrapper>
				<SavingCardSection>
					<CardWrapper>
						<Text>Saving cards</Text>
						<Card
							cardNumber={savingCard.account_id}
							balance={savingCard.balance}
							service={savingCard.account_service}
							loading={loading}
							empty={savingCards.length === 0}
						/>
					</CardWrapper>
					{!loading && (
						<CardList
							value={currentCard}
							data={savingCardList}
							onClick={onSelectCard}
						/>
					)}
				</SavingCardSection>
			</Wrapper>
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
	savingCard: PropTypes.arrayOf(
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
	onFetchData: () => dispatch(fetchCardsDataIfNeeded()),
})
export default connect(mapStateToProps, mapDispatchToProps)(CardsPage)
