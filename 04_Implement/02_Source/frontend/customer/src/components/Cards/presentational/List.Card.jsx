import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'
import Item from './Item.Card'

const Wrapper = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const ItemWrapper = styled.div`
  margin-bottom: 30px;
`

const CardList = ({
  value,
  data,
  onClick,
}) => (
  <ScrollArea
    horizontal={false}
    style={{ maxHeight: '410px' }}
    verticalScrollbarStyle={{ width: '5px', backgroundColor: '#7C7F87', borderRadius: '10px' }}
    verticalContainerStyle={{
      width: '5px', backgroundImage: 'linear-gradient(180deg, #26292E 0%, #16181C 100%)', borderRadius: '10px', right: '0px',
    }}
  >
    <Wrapper>
      {
        data.map((card, index) => {
          const { service, id, balance } = card
          if (index === data.length - 1) {
            return (
              <Item
                key={id}
                service={service}
                cardNumber={id}
                balance={balance}
                active={value === id}
                onClick={() => onClick(id)}
              />
            )
          }
          return (
            <ItemWrapper>
              <Item
                key={id}
                service={service}
                cardNumber={id}
                balance={balance}
                active={value === id}
                onClick={() => onClick(id)}
              />
            </ItemWrapper>
          )
        })
      }
    </Wrapper>
  </ScrollArea>
)
CardList.defaultProps = {
  value: '',
  data: [],
  onClick: (f) => f,
}
CardList.propTypes = {
  value: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    service: PropTypes.string,
    cardNumber: PropTypes.string,
    balance: PropTypes.number,
  })),
  onClick: PropTypes.func,
}
export default CardList
