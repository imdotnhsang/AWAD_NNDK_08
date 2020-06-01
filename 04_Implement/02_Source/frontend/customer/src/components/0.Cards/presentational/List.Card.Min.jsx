import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import ScrollArea from 'react-scrollbar'
import Item from './Item.Card'

const Wrapper = styled.div`
  width: max-content;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  & > * {
    margin-top: 30px;
  }
  & > *:first-child {
    margin-top: 0;
  }
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
const CardList = ({
  value,
  data,
  loading,
  onClick,
}) => {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.scrollArea.scrollTop()
  })
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <ScrollArea
        speed={0.5}
        horizontal={false}
        style={{ maxHeight: '190px' }}
        verticalScrollbarStyle={{ width: '5px', backgroundColor: '#7C7F87', borderRadius: '10px' }}
        verticalContainerStyle={{
          width: '5px', backgroundImage: 'linear-gradient(180deg, #26292E 0%, #16181C 100%)', borderRadius: '10px', right: '0px',
        }}
        smoothScrolling
        ref={ref}
      >
        <Wrapper>
          {
          data.map((card) => {
            const { service, accountID, balance } = card
            return (
              <Item
                key={accountID}
                service={service}
                cardNumber={accountID}
                balance={balance}
                active={value === accountID}
                onClick={() => { onClick(accountID); ref.current.scrollArea.scrollTop() }}
                disabled={loading}
              />
            )
          })
        }
        </Wrapper>
      </ScrollArea>
      {loading && (
      <Loading width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M6 20C6 12.4477 12.4477 6 20 6C27.5523 6 34 12.4477 34 20C34 20.5523 33.5523 21 33 21C32.4477 21 32 20.5523 32 20C32 13.5523 26.4477 8 20 8C13.5523 8 8 13.5523 8 20C8 20.5523 7.55228 21 7 21C6.44772 21 6 20.5523 6 20Z" fill="#EF230C" />
        <path fillRule="evenodd" clipRule="evenodd" d="M7 19C7.55228 19 8 19.4477 8 20C8 26.4477 13.5523 32 20 32C21.6771 32 24.0108 31.5368 26.1461 30.3721C28.2665 29.2155 30.1478 27.3942 31.0513 24.6838C31.226 24.1598 31.7923 23.8767 32.3162 24.0513C32.8402 24.226 33.1233 24.7923 32.9487 25.3162C31.8522 28.6058 29.5668 30.7845 27.1039 32.1279C24.6559 33.4632 21.9896 34 20 34C12.4477 34 6 27.5523 6 20C6 19.4477 6.44772 19 7 19Z" fill="url(#paint0_linear)" />
        <defs>
          <linearGradient id="paint0_linear" x1="7" y1="20" x2="35" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF230C" stopOpacity="0.81" />
            <stop offset="1" stopColor="#EF230C" stopOpacity="0" />
          </linearGradient>
        </defs>
      </Loading>
      )}
    </div>
  )
}
CardList.defaultProps = {
  value: '',
  data: [],
  loading: false,
  onClick: (f) => f,
}
CardList.propTypes = {
  value: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    accountID: PropTypes.string,
    service: PropTypes.string,
    balance: PropTypes.number,
  })),
  loading: PropTypes.bool,
  onClick: PropTypes.func,
}
export default CardList
