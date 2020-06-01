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
import { resolveTagFromProps } from '../../../utils/utils'
import { MINIMUM_BALANCE } from '../../../constants/constants'

const styleModifiers = ['error']

const Instruction = styled(resolveTagFromProps(styleModifiers, 'span'))`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  margin: 30px 0;
  color: ${(props) => (props.error ? props.theme.yellow : '#fff')};
`
const FormWrapper = styled.div`
  width: 100%;
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
const Error = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: ${(props) => props.theme.yellow};
  margin-top: 30px;
  line-height: 16px;
`

class Step1RepayContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      savingCardID: '',
      filter: '',
      tab: 1,
      error: '',
      balanceError: '',
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
      debtAmount,
    } = this.props
    if (value) {
      const item = data.find((card) => card.accountID === value)
      const { type, balance } = item
      if (type === 'DEFAULT') {
        this.setState({
          tab: 1,
        })
      } else {
        this.setState({
          tab: 2,
          savingCardID: value,
          filter: value,
        })
      }
      if (debtAmount > (balance - MINIMUM_BALANCE)) {
        this.setState({
          balanceError: 'The selected card cannot afford this debt payment',
        })
      }
    } else {
      const payingCard = data.find((card) => card.type === 'DEFAULT')
      const { accountID } = payingCard
      this.handleOnChange(accountID)
    }
  }

  handleOnChange(value) {
    const { onChange, data, debtAmount } = this.props
    onChange({
      accountID: value,
    })
    if (value) {
      const card = data.find((e) => e.accountID === value)
      const { balance } = card
      if (debtAmount > (balance - MINIMUM_BALANCE)) {
        this.setState({
          balanceError: 'The selected card cannot afford this debt payment',
        })
      }
    }
  }

  handleFilter(event) {
    this.setState({
      filter: event.target.value.replace(/\D/g, ''),
      error: '',
    })
  }

  hanldeSavingCardClick(value) {
    this.setState({
      filter: value,
      savingCardID: value,
      error: '',
      balanceError: '',
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
      savingCardID,
      balanceError,
    } = this.state

    const {
      onNext,
    } = this.props
    if (!balanceError) {
      if (tab === 1) {
        onNext()
      } else if (savingCardID) {
        onNext()
      } else {
        this.setState({
          error: 'Please pick a saving card',
        })
      }
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
      balanceError,
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
          name="Card"
          description="Select a card to repay this debt"
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
                {/* <div style={{ height: '1px', width: '100%' }} /> */}
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
                  label="Card number filter:"
                  placeholder="Enter the card number"
                  value={filter}
                  onChange={this.handleFilter}
                />
                <Instruction error={error}>{ error || 'Pick one from your saving card list (required)'}</Instruction>
                <CardsList
                  value={savingCardID}
                  data={savingCards}
                  onClick={this.hanldeSavingCardClick}
                />
              </>
            )
        }
        {balanceError && <Error>{balanceError}</Error>}
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

Step1RepayContent.defaultProps = {
  value: '',
  debtAmount: 50000,
  onChange: (f) => f,
  onClose: (f) => f,
  onNext: (f) => f,
  //
  data: [],
}
Step1RepayContent.propTypes = {
  value: PropTypes.string,
  debtAmount: PropTypes.number,
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
)(Step1RepayContent)
