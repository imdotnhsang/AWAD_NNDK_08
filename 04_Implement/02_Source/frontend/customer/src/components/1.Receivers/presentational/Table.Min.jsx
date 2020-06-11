import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'
import Header from './Table.Header.Min'
import Item from './Table.Item.Min'
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
  height: 218px;
  position: relative;
`

const Table = ({
  data,
  loading,
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
                    key={item._id}
                    nickname={item.nickname}
                    cardNumber={item.account_id}
                    bankName={item.bank_id}
                    lastItem={index === data.length - 1}
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
  data: [],
  loading: false,
}
Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    nickname: PropTypes.string,
    accountID: PropTypes.string,
    bankName: PropTypes.string,
  })),
  loading: PropTypes.bool,
}
export default Table
