import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import Header from '../common/presentational/Header.Page'
import Card from './presentational/Card'
import CardList from './presentational/List.Card'
import { selectCard, fetchCardsData } from '../../actions/cards'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 220px;
`
const PageContent = styled.div`
  width: 100%;
  padding: 0px 60px;
  padding-bottom: 67px;
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

const CardsPage = ({
  currentCard,
  cards,
  loading,
  onSelectCard,
  onFetchData,
}) => {
  const payingCard = cards.find((card) => card.type === 'DEFAULT') || {
    id: '', type: '', balance: 0, service: 'MASTERCARD',
  }
  const savingCard = cards.find((card) => card.id === currentCard) || {
    id: '', type: '', balance: 0, service: 'MASTERCARD',
  }
  const savingCardList = cards.filter((card) => card.type === 'SAVING')
  useEffect(() => {
    onFetchData()
  }, [])
  return (
    <Template>
      <Wrapper>
        <Header name="Cards" />
        <PageContent>
          <CardWrapper style={{ marginTop: '44px' }}>
            <Text>Paying card</Text>
            <Card
              cardNumber={payingCard.id}
              balance={payingCard.balance}
              service={payingCard.service}
              loading={loading}
            />
          </CardWrapper>
          <SavingCardSection>
            <CardWrapper>
              <Text>Saving cards</Text>
              <Card
                cardNumber={savingCard.id}
                balance={savingCard.balance}
                service={savingCard.service}
                loading={loading}
              />
            </CardWrapper>
            {!loading
              && (
              <CardList
                value={currentCard}
                data={savingCardList}
                onClick={onSelectCard}
              />
              )}
          </SavingCardSection>
        </PageContent>
      </Wrapper>
    </Template>
  )
}

CardsPage.defaultProps = {
  currentCard: '',
  cards: [],
  loading: false,
  onSelectCard: (f) => f,
  onFetchData: (f) => f,
}
CardsPage.propTypes = {
  currentCard: PropTypes.string,
  cards: PropTypes.arrayOf(PropTypes.shape({
    service: PropTypes.string,
    cardNumber: PropTypes.string,
    balance: PropTypes.number,
  })),
  loading: PropTypes.bool,
  onSelectCard: PropTypes.func,
  onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  currentCard: state.cards.currentCard,
  cards: state.cards.cards,
  loading: state.cards.loading,
})
const mapDispatchToProps = (dispatch) => ({
  onSelectCard: (value) => dispatch(selectCard(value)),
  onFetchData: () => dispatch(fetchCardsData()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CardsPage)
