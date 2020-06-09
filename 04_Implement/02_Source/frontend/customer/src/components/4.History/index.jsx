import React, { Component } from 'react'
import styled from 'styled-components'
import Template from '../common/presentational/Template.Customer'
import MenuTab from '../common/presentational/Menu.Tab'
import TableReceive from './presentational/Table.Receive'
import TableTransfer from './presentational/Table.Transfer'
import TableDebtRepaying from './presentational/Table.DebtRepaying'

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 60px;
  padding-top: 24px;
  // padding-bottom: 67px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

class HistoryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 0,
    }
    this.handleTab = this.handleTab.bind(this)
  }

  handleTab(value) {
    this.setState({
      tab: value,
    })
  }

  render() {
    const {
      tab,
    } = this.state

    const menuTabData = [
      { name: 'Receive', value: 0 },
      { name: 'Transfer', value: 1 },
      { name: 'Debt repaying', value: 2 },
    ]
    return (
      <Template
        currentTab={4}
        headerName="History"
      >
        <>
          <MenuTab
            value={tab}
            data={menuTabData}
            onChange={this.handleTab}
          />
          <Wrapper>
            {
              [
                <TableReceive />,
                <TableTransfer />,
                <TableDebtRepaying />,
              ][tab] || null
            }
          </Wrapper>
        </>
      </Template>
    )
  }
}

export default HistoryPage
