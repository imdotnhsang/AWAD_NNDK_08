import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'
import Header from './Table.Header.Min'
import Item from './Table.Item.Min.Select'
import Loading from '../../common/presentational/Loading.Table.Min'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) => props.theme.blackDark};
`
const Content = styled.div`
  width: 100%;
  height: 100%;
  min-height: 50px;
  position: relative;
`

const Table = ({
  data,
  loading,
  value,
  onChange,
}) => (
  <Wrapper>
    <Header />
    <Content>
      {
        loading ? <Loading />
          : (
            <ScrollArea
              speed={0.5}
              horizontal={false}
              style={{ maxHeight: '218px' }}
              verticalScrollbarStyle={{ width: '5px', backgroundColor: '#7C7F87', borderRadius: '10px' }}
              verticalContainerStyle={{
                width: '5px', backgroundImage: 'linear-gradient(180deg, #26292E 0%, #16181C 100%)', borderRadius: '10px', right: '0px',
              }}
              smoothScrolling
            >
              {
                data.map((item, index) => (
                  <Item
                    key={item.id}
                    nickname={item.accountNickname}
                    cardNumber={item.accountID}
                    bankName={item.bankID}
                    lastItem={index === data.length - 1}
                    active={item.accountID === value.accountID && item.bankID === value.bankID}
                    onClick={() => onChange(item)}
                  />
                ))
              }
            </ScrollArea>
          )
      }
    </Content>
  </Wrapper>
)
Table.defaultProps = {
  value: {
    id: '',
    accountName: '',
    accountID: '',
    bankID: '',
    bankName: '',
  },
  data: [],
  loading: false,
  onChange: (f) => f,
}
Table.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.string,
    accountName: PropTypes.string,
    accountID: PropTypes.string,
    bankName: PropTypes.string,
    bankID: PropTypes.string,
  }),
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    accountName: PropTypes.string,
    accountID: PropTypes.string,
    bankName: PropTypes.string,
    bankID: PropTypes.string,
  })),
  loading: PropTypes.bool,
  onChange: PropTypes.func,
}
export default Table
