import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'
import { connect } from 'react-redux'
import Header from './Table.Header'
import Item from './Table.Item.ReceivedFromOthers'
import Loading from '../../common/presentational/Loading.Table'
import { DebtStatus } from '../../../constants/constants'
import {
  // invalidateDebtsData,
  fecthDebtsDataIfNeeded,
} from '../../../actions/debts'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const Content = styled.div`
  width: 100%;
  height: 590px;
  position: relative;
`

class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
    }
    this.ref = createRef()
    this.hanldeFilter = this.hanldeFilter.bind(this)
  }

  componentDidMount() {
    const {
      loading,
      onFetchData,
    } = this.props
    if (!loading) this.ref.current.scrollArea.scrollTop()
    onFetchData('receivedFromOthers')
  }

  componentDidUpdate() {
    const { loading } = this.props
    if (!loading) this.ref.current.scrollArea.scrollTop()
  }

  hanldeFilter(value) {
    this.setState({
      filter: value,
    })
  }

  render() {
    const {
      data,
      loading,
      onPay,
      onInfo,
      onRemove,
    } = this.props
    const {
      filter,
    } = this.state

    let filteredData = data
    if (filter) {
      filteredData = filteredData.filter((o) => o.status === filter)
    }

    return (
      <Wrapper>
        <Header
          onFilter={this.hanldeFilter}
        />
        <Content>
          {
          loading ? <Loading />
            : (
              <ScrollArea
                speed={0.5}
                horizontal={false}
                style={{ maxHeight: '590px' }}
                verticalScrollbarStyle={{ width: '5px', backgroundColor: '#7C7F87', borderRadius: '10px' }}
                verticalContainerStyle={{
                  width: '5px', backgroundImage: 'linear-gradient(180deg, #26292E 0%, #16181C 100%)', borderRadius: '10px', right: '0px',
                }}
                smoothScrolling
                ref={this.ref}
              >
                {
                  filteredData.map((item, index) => (
                    <Item
                      key={item.id}
                      index={index + 1}
                      accountID={item.lenderID}
                      accountName={item.lenderName}
                      status={item.status}
                      amount={item.amount}
                      lastItem={index === data.length - 1}
                      onPay={() => onPay(item)}
                      onInfo={() => onInfo(item)}
                      onRemove={() => onRemove(item, false)}
                    />
                  ))
                }
              </ScrollArea>
            )
        }
        </Content>
      </Wrapper>
    )
  }
}

Table.defaultProps = {
  data: [],
  loading: false,
  onPay: (f) => f,
  onInfo: (f) => f,
  onRemove: (f) => f,
  //
  // onInvalidateData: (f) => f,
  onFetchData: (f) => f,
}
Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    lenderID: PropTypes.string,
    lenderName: PropTypes.string,
    status: PropTypes.oneOf([
      DebtStatus.UNPAID,
      DebtStatus.PAID,
      DebtStatus.CANCELLED,
    ]),
    amount: PropTypes.number,
  })),
  loading: PropTypes.bool,
  onPay: PropTypes.func,
  onInfo: PropTypes.func,
  onRemove: PropTypes.func,
  //
  // onInvalidateData: PropTypes.func,
  onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  loading: state.debts.receivedFromOthers.loading,
  data: state.debts.receivedFromOthers.data,
})
const mapDispatchToProps = (dispatch) => ({
  // onInvalidateData: (category) => dispatch(invalidateDebtsData(category)),
  onFetchData: (category) => dispatch(fecthDebtsDataIfNeeded(category)),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table)
