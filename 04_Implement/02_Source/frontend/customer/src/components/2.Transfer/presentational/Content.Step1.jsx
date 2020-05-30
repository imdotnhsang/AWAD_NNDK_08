import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import RadioForm from '../../common/presentational/Form.Radio'
import Input from '../../common/presentational/Input'
import CardsList from '../../0.Cards/presentational/List.Card.Min'
import Banner from '../../common/presentational/Banner.Step'
import CardItem from '../../0.Cards/presentational/Item.Card'
import Button from '../../common/presentational/Button'

const Instruction = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  margin: 30px 0;
`
const FormWrapper = styled.div`
  width: 100%;
  margin: 30px 0;
`
const Error = styled.div`
  font-family: OpenSans-Regular;'
  font-size: 12px;
  color: ${(props) => props.theme.yellow};
  margin: 30px 0;
`
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
  & > *:first-child {
    margin-right: 10px;
  }
  & > *:last-child {
    margin-left: 10px;
  }
`

class Step1Content extends Component {
  constructor(props) {
    super(props)
    this.state = {
      savingCardID: '',
      filter: '',
      tab: 1,
      error: '',
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleRadioForm = this.handleRadioForm.bind(this)
    this.hanldeSavingCardClick = this.hanldeSavingCardClick.bind(this)
    this.handleNext = this.handleNext.bind(this)
  }

  componentDidMount() {
    const {
      value,
      data,
    } = this.props
    if (!value) {
      const item = data.find((card) => card.accountID)
      const { type } = item
      if (type === 'DEFAULT') {
        this.setState({
          tab: 1,
        })
      } else {
        this.setState({
          tab: 2,
          savingCardID: value,
        })
      }
    }
  }

  handleOnChange(value) {
    const { onChange } = this.props
    onChange({
      senderAccoundID: value,
    })
  }

  handleFilter(event) {
    this.setState({
      filter: event.target.value,
    })
  }

  hanldeSavingCardClick(value) {
    this.setState({
      filter: '',
      savingCardID: value,
    })
    this.handleOnChange(value)
  }

  handleRadioForm(value) {
    this.setState({
      tab: value,
      error: '',
    })
    if (value === 1) {
      const { data } = this.props
      const payingCard = data.find((cards) => cards.type === 'DEFAULT')
      const { accountID } = payingCard
      this.handleOnChange(accountID)
    } else {
      const { savingCardID } = this.state
      this.handleOnChange(savingCardID)
    }
  }

  handleNext() {
    const {
      tab,
      savingAccountID,
    } = this.state

    const {
      onNext,
    } = this.props

    if (tab === 1) {
      onNext()
    } else if (savingAccountID) {
      onNext()
    } else {
      this.setState({
        error: 'Please pick a saving card',
      })
    }
  }

  render() {
    const formData = [
      { id: 1, value: 1, label: 'Use your paying card' },
      { id: 2, value: 2, label: 'Use your saving cards' },
    ]

    const {
      filter,
      savingCardID,
      tab,
      error,
    } = this.state

    const {
      onClose,
      //
      data,
    } = this.props
    const payingCard = data.find((card) => card.type === 'DEFAULT') || { accountID: '', service: '', balance: 0 }
    const savingCards = data.filter((card) => card.type === 'SAVING' && card.accountID.includes(filter)) || []
    return (
      <>
        <Banner
          index={1}
          name="Cards"
          description="Please pick a card to proceed this payment"
        />
        <FormWrapper>
          <RadioForm
            data={formData}
            value={tab}
            onChange={this.handleRadioForm}
          />
        </FormWrapper>
        {
          tab === 1
            ? (
              <>
                <div style={{ height: '1px', width: '100%' }} />
                <Instruction style={{ marginTop: '0px' }}>Your paying card:</Instruction>
                <CardItem
                  fluid
                  empty={!payingCard.accountID}
                  service={payingCard.service}
                  cardNumber={payingCard.accountID}
                  balance={payingCard.balance}
                />
              </>
            )
            : (
              <>
                <Input
                  label="Filter"
                  placeholder="Enter card number"
                  value={filter || savingCardID}
                  onChange={this.handleFilter}
                />
                <Instruction>Pick one from your saving card list</Instruction>
                <CardsList
                  value={savingCardID}
                  data={savingCards}
                  onClick={this.hanldeSavingCardClick}
                />
              </>
            )
        }
        {error && <Error>{error}</Error> }
        <ButtonWrapper>
          <Button
            fluid
            secondary
            name="Cancel"
            onClick={onClose}
          />
          <Button
            fluid
            name="Next"
            onClick={this.handleNext}
          />
        </ButtonWrapper>
      </>
    )
  }
}

Step1Content.defaultProps = {
  value: '',
  onChange: (f) => f,
  onClose: (f) => f,
  onNext: (f) => f,
  //
  data: [],
}
Step1Content.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  //
  data: PropTypes.arrayOf(PropTypes.shape({
    accountID: PropTypes.string,
    service: PropTypes.string,
    balance: PropTypes.number,
  })),
}

const mapStateToProps = (state) => ({
  data: state.cards.cards,
})
export default connect(
  mapStateToProps,
)(Step1Content)
