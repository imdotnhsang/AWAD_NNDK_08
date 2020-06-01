import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import MenuTab from '../common/presentational/Menu.Tab'
import TableCreatedByYou from './presentational/Table.CreatedByYou'
import TableReceivedFromOthers from './presentational/Table.ReceivedFromOthers'
import {
  fecthDebtsDataCreatedByYouIfNeeded,
  fecthDebtsDataReceivedFromOthersIfNeeded,
  invalidateDebtsDataReceivedFromOthers,
} from '../../actions/debts'
import {
  fetchCardsDataIfNeeded,
} from '../../actions/cards'
import { DebtStatus } from '../../constants/constants'
import RepayModal from './presentational/Modal.RepayDebt'
import AddModal from './presentational/Modal.AddDebt'
import InfoModal from './presentational/Modal.InfoDebt'
import RemoveModal from './container/Modal.RemoveDebt'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'
import ProcessingModal from '../common/presentational/Modal.Processing'

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 60px;
  padding-top: 24px;
  padding-bottom: 67px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const Description = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  line-height: 16px;
`
class ReceiversPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: {
        id: '',
        lenderName: '',
        lenderID: '',
        borrowerName: '',
        borrowerID: '',
        status: DebtStatus.PAID,
        amount: 0,
        message: '',
        reasonOfCancel: '',
      },
      tab: 0,
      showAddModal: false,
      showPayModal: false,
      showInfoModal: false,
      showRemoveModal: false,
      createdByYouRemove: true,
      showSuccess: false,
      showFailure: false,
      showProcessing: false,
      failureMessage: '',
    }
    this.handleTab = this.handleTab.bind(this)
    this.resetSelectedItem = this.resetSelectedItem.bind(this)
    this.handleOpenAddModal = this.handleOpenAddModal.bind(this)
    this.handleCloseAddModal = this.handleCloseAddModal.bind(this)
    this.handleOpenPayModal = this.handleOpenPayModal.bind(this)
    this.handleClosePayModal = this.handleClosePayModal.bind(this)
    this.handleOpenInfoModal = this.handleOpenInfoModal.bind(this)
    this.handleCloseInfoModal = this.handleCloseInfoModal.bind(this)
    this.handleOpenRemoveModal = this.handleOpenRemoveModal.bind(this)
    this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this)
    this.handleOpenSuccessModal = this.handleOpenSuccessModal.bind(this)
    this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this)
    this.handleOpenFailureModal = this.handleOpenFailureModal.bind(this)
    this.handleCloseFailureModal = this.handleCloseFailureModal.bind(this)
    this.handleShowProcessing = this.handleShowProcessing.bind(this)
  }

  componentDidMount() {
    const {
      onFetchCreatedByYouData,
      onFetchReceivedFromOthersData,
      onFetchAccountsData,
    } = this.props
    onFetchCreatedByYouData()
    onFetchReceivedFromOthersData()
    onFetchAccountsData()
  }

  handleTab(value) {
    this.setState({
      tab: value,
    })
  }

  resetSelectedItem() {
    this.setState({
      selectedItem: {
        id: '',
        lenderName: '',
        lenderID: '',
        borrowerName: '',
        borrowerID: '',
        status: DebtStatus.PAID,
        amount: 0,
        message: '',
        reasonOfCancel: '',
      },
    })
  }

  // Add modal
  handleOpenAddModal() {
    this.resetSelectedItem()
    this.setState({
      showAddModal: true,
    })
  }

  handleCloseAddModal() {
    this.setState({
      showAddModal: false,
    })
  }

  // Pay modal
  handleOpenPayModal(item) {
    this.setState({
      selectedItem: {
        ...item,
      },
      showPayModal: true,
    })
  }

  handleClosePayModal() {
    this.resetSelectedItem()
    this.setState({
      showPayModal: false,
    })
  }

  // Info modal
  handleOpenInfoModal(item) {
    this.setState({
      selectedItem: {
        ...item,
      },
      showInfoModal: true,
    })
  }

  handleCloseInfoModal() {
    this.resetSelectedItem()
    this.setState({
      showInfoModal: false,
    })
  }

  // Remove modal
  handleOpenRemoveModal(item, type) {
    this.setState({
      selectedItem: {
        ...item,
      },
      showRemoveModal: true,
      createdByYouRemove: type,
    })
  }

  handleCloseRemoveModal() {
    this.resetSelectedItem()
    this.setState({
      showRemoveModal: false,
    })
  }

  handleOpenSuccessModal() {
    this.setState({
      showProcessing: false,
    })
    setTimeout(() => {
      this.setState({
        showSuccess: true,
      })
    }, 1000)
  }

  handleCloseSuccessModal() {
    const {
      invalidateReceivedFromOthersData,
      onFetchReceivedFromOthersData,
    } = this.props
    this.setState({
      showSuccess: false,
    })
    invalidateReceivedFromOthersData()
    onFetchReceivedFromOthersData()
  }

  handleOpenFailureModal(message) {
    this.setState({
      showProcessing: false,
    })
    setTimeout(() => {
      this.setState({
        showFailure: true,
        failureMessage: message,
      })
    }, 1000)
  }

  handleCloseFailureModal() {
    this.setState({
      showFailure: false,
    })
  }

  handleShowProcessing() {
    this.setState({
      showProcessing: true,
    })
  }

  render() {
    const {
      tab,
      selectedItem,
      showAddModal,
      showPayModal,
      showInfoModal,
      showRemoveModal,
      createdByYouRemove,
      showSuccess,
      showFailure,
      showProcessing,
      failureMessage,
    } = this.state

    const {
      createdByYouData,
      createdByYouLoading,
      //
      receivedFromOthersData,
      receivedFromOthersLoading,
      //
      accountsDataLoading,
    } = this.props

    const menuTabData = [
      { name: 'Created by you', value: 0 },
      { name: 'Received from others', value: 1 },
    ]
    return (
      <Template
        currentTab={3}
        headerName="Debts"
        headerButton
        headerButtonName="New debt"
        onHeaderButtonClick={this.handleOpenAddModal}
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
                <TableCreatedByYou
                  data={createdByYouData}
                  loading={createdByYouLoading}
                  onInfo={this.handleOpenInfoModal}
                  onRemove={this.handleOpenRemoveModal}
                />,
                <TableReceivedFromOthers
                  data={receivedFromOthersData}
                  loading={receivedFromOthersLoading || accountsDataLoading}
                  onPay={this.handleOpenPayModal}
                  onInfo={this.handleOpenInfoModal}
                  onRemove={this.handleOpenRemoveModal}
                />,
              ][tab] || null
            }

            {/* <Table
              data={data}
              loading={loading}
              onInfo={this.handleOpenInfoModal}
              onRemove={this.handleOpenRemoveModal}
            /> */}
            {/* <AddModel
              show={showAddModal}
              onClose={this.handleCloseAddModal}
            />
            <InfoModel
              id={selectedItem.id}
              bankID={selectedItem.bankID}
              accountID={selectedItem.accountID}
              nickname={selectedItem.nickname}
              show={showInfoModal}
              onClose={this.handleCloseInfoModal}
            />
            <RemoveModel
              id={selectedItem.id}
              show={showRemoveModal}
              onClose={this.handleCloseRemoveModal}
            /> */}
          </Wrapper>
          <AddModal
            show={showAddModal}
            onClose={this.handleCloseAddModal}
          />
          <InfoModal
            show={showInfoModal}
            data={selectedItem}
            onClose={this.handleCloseInfoModal}
          />
          <RemoveModal
            show={showRemoveModal}
            data={selectedItem}
            onClose={this.handleCloseRemoveModal}
            createdByYouRemove={createdByYouRemove}
          />
          {showPayModal
            && (
            <RepayModal
              show={showPayModal}
              data={selectedItem}
              onClose={this.handleClosePayModal}
              onSuccess={this.handleOpenSuccessModal}
              onFailure={this.handleOpenFailureModal}
              onProcessing={this.handleShowProcessing}
            />
            )}
          <SuccessModal
            show={showSuccess}
            onClose={this.handleCloseSuccessModal}
          >
            <Description>Your transaction has been successfully done!</Description>
          </SuccessModal>
          <FailureModal
            show={showFailure}
            onClose={this.handleCloseFailureModal}
          >
            <Description>
              Something wrong has happened that your transaction was canceled
              <br />
              Error message:
              {' '}
              {failureMessage}
            </Description>
          </FailureModal>
          <ProcessingModal
            show={showProcessing}
          />
        </>
      </Template>
    )
  }
}

ReceiversPage.defaultProps = {
  createdByYouData: [],
  createdByYouLoading: false,
  //
  receivedFromOthersData: [],
  receivedFromOthersLoading: false,
  //
  accountsDataLoading: false,
  onFetchCreatedByYouData: (f) => f,
  onFetchReceivedFromOthersData: (f) => f,
  onFetchAccountsData: (f) => f,
  invalidateReceivedFromOthersData: (f) => f,
}
ReceiversPage.propTypes = {
  createdByYouData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      lenderName: PropTypes.string,
      lenderID: PropTypes.string,
      borrowerName: PropTypes.string,
      borrowerID: PropTypes.string,
      status: PropTypes.oneOf([
        DebtStatus.UNPAID,
        DebtStatus.PAID,
        DebtStatus.CANCELLED,
      ]),
      amount: PropTypes.number,
      message: PropTypes.string,
      reasonOfCancel: PropTypes.string,
    }),
  ),
  createdByYouLoading: PropTypes.bool,
  //
  receivedFromOthersData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      lenderName: PropTypes.string,
      lenderID: PropTypes.string,
      borrowerName: PropTypes.string,
      borrowerID: PropTypes.string,
      status: PropTypes.oneOf([
        DebtStatus.UNPAID,
        DebtStatus.PAID,
        DebtStatus.CANCELLED,
      ]),
      amount: PropTypes.number,
      message: PropTypes.string,
      reasonOfCancel: PropTypes.string,
    }),
  ),
  receivedFromOthersLoading: PropTypes.bool,
  accountsDataLoading: PropTypes.bool,
  onFetchCreatedByYouData: PropTypes.func,
  onFetchReceivedFromOthersData: PropTypes.func,
  onFetchAccountsData: PropTypes.func,
  invalidateReceivedFromOthersData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  createdByYouData: state.debts.createdByYou.data,
  createdByYouLoading: state.debts.createdByYou.loading,
  //
  receivedFromOthersData: state.debts.receivedFromOthers.data,
  receivedFromOthersLoading: state.debts.receivedFromOthers.loading,
  //
  accountsDataLoading: state.cards.loading,
})
const mapDispatchToProps = (dispatch) => ({
  onFetchCreatedByYouData: () => dispatch(fecthDebtsDataCreatedByYouIfNeeded()),
  invalidateReceivedFromOthersData: () => dispatch(invalidateDebtsDataReceivedFromOthers()),
  onFetchReceivedFromOthersData: () => dispatch(fecthDebtsDataReceivedFromOthersIfNeeded()),
  onFetchAccountsData: () => dispatch(fetchCardsDataIfNeeded()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiversPage)
