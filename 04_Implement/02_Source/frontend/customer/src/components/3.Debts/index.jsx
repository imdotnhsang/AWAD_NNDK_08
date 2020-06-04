import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import MenuTab from '../common/presentational/Menu.Tab'
import TableCreatedByYou from './presentational/Table.CreatedByYou'
import TableReceivedFromOthers from './presentational/Table.ReceivedFromOthers'
import {
  fecthDebtsDataIfNeeded,
  invalidateDebtsData,
} from '../../actions/debts'
// import {
//   fetchCardsDataIfNeeded,
// } from '../../actions/cards'
import { DebtStatus } from '../../constants/constants'
import RepayModal from './presentational/Modal.RepayDebt'
import AddModal from './container/Modal.AddDebt'
import InfoModal from './presentational/Modal.InfoDebt'
import RemoveModal from './presentational/Modal.RemoveDebt'
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
      // createdByYouAction: true,
      showSuccess: false,
      showFailure: false,
      showProcessing: false,
      successMessage: '',
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

  // eslint-disable-next-line no-unused-vars
  handleOpenSuccessModal(message, createdByYouAction) {
    this.setState({
      showProcessing: false,
    })
    setTimeout(() => {
      this.setState({
        showSuccess: true,
        successMessage: message,
        // createdByYouAction,
      })
    }, 1000)
  }

  handleCloseSuccessModal() {
    // const {
    //   onInvalidateData,
    //   onFetchData,
    // } = this.props
    // const {
    //   createdByYouAction,
    // } = this.state
    this.setState({
      showSuccess: false,
      successMessage: '',
    })
    // if (createdByYouAction) {
    //   onInvalidateData('createdByYou')
    //   onFetchData('createdByYou')
    // } else {
    //   onInvalidateData('receivedFromOthers')
    //   onFetchData('receivedFromOthers')
    // }
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
      failureMessage: '',
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
      successMessage,
      failureMessage,
    } = this.state


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
                  onInfo={this.handleOpenInfoModal}
                  onRemove={this.handleOpenRemoveModal}
                />,
                <TableReceivedFromOthers
                  onPay={this.handleOpenPayModal}
                  onInfo={this.handleOpenInfoModal}
                  onRemove={this.handleOpenRemoveModal}
                />,
              ][tab] || null
            }
          </Wrapper>
          {showAddModal
            && (
              <AddModal
                onClose={this.handleCloseAddModal}
                onSuccess={this.handleOpenSuccessModal}
                onFailure={this.handleOpenFailureModal}
              />
            )}
          {showInfoModal
            && (
              <InfoModal
                data={selectedItem}
                onClose={this.handleCloseInfoModal}
              />
            )}
          {showRemoveModal
            && (
              <RemoveModal
                data={selectedItem}
                onClose={this.handleCloseRemoveModal}
                createdByYouRemove={createdByYouRemove}
                onSuccess={this.handleOpenSuccessModal}
                onFailure={this.handleOpenFailureModal}
              />
            )}
          {showPayModal
            && (
            <RepayModal
              data={selectedItem}
              onClose={this.handleClosePayModal}
              onSuccess={this.handleOpenSuccessModal}
              onFailure={this.handleOpenFailureModal}
              onProcessing={this.handleShowProcessing}
            />
            )}
          {showSuccess
            && (
            <SuccessModal
              onClose={this.handleCloseSuccessModal}
            >
              <Description>{successMessage}</Description>
            </SuccessModal>
            )}
          {showFailure
            && (
              <FailureModal
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
            )}
          {showProcessing
            && (
              <ProcessingModal />
            )}
        </>
      </Template>
    )
  }
}

// ReceiversPage.defaultProps = {
//   onInvalidateData: (f) => f,
//   onFetchData: (f) => f,
// }
// ReceiversPage.propTypes = {
//   onInvalidateData: PropTypes.func,
//   onFetchData: PropTypes.func,
// }

// const mapDispatchToProps = (dispatch) => ({
//   onInvalidateData: (category) => dispatch(invalidateDebtsData(category)),
//   onFetchData: (category) => dispatch(fecthDebtsDataIfNeeded(category)),
// })
// export default connect(
//   null,
//   mapDispatchToProps,
// )(ReceiversPage)

export default ReceiversPage
