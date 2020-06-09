import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import Table from './presentational/Table'
import { fetchReceiversDataIfNeeded, invalidateReceiversData } from '../../actions/receivers'
import AddModal from './container/Modal.AddReceiver'
import EditModal from './container/Modal.EditReceiver'
import RemoveModal from './presentational/Modal.RemoveReceiver'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'

const Wrapper = styled.div`
  width: 100%;
  padding: 0px 60px;
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
        nickname: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      showAddModal: false,
      showEditModal: false,
      showRemoveModal: false,
      showSuccessModal: false,
      showFailureModal: false,
      successMessage: '',
      failureMessage: '',
    }
    this.resetSelectedItem = this.resetSelectedItem.bind(this)
    this.handleOpenAddModal = this.handleOpenAddModal.bind(this)
    this.handleCloseAddModal = this.handleCloseAddModal.bind(this)
    this.handleOpenEditModal = this.handleOpenEditModal.bind(this)
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this)
    this.handleOpenRemoveModal = this.handleOpenRemoveModal.bind(this)
    this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this)
    this.handleOpenSuccessModal = this.handleOpenSuccessModal.bind(this)
    this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this)
    this.handleOpenFailureModal = this.handleOpenFailureModal.bind(this)
    this.handleCloseFailureModal = this.handleCloseFailureModal.bind(this)
  }

  componentDidMount() {
    const {
      onFetchData,
    } = this.props
    onFetchData()
  }

  resetSelectedItem() {
    this.setState({
      selectedItem: {
        id: '',
        nickname: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
    })
  }

  // Add modal
  handleOpenAddModal() {
    this.setState({
      showAddModal: true,
    })
  }

  handleCloseAddModal() {
    this.setState({
      showAddModal: false,
    })
  }

  // Edit modal
  handleOpenEditModal(item) {
    this.setState({
      selectedItem: {
        ...item,
      },
      showEditModal: true,
    })
  }

  handleCloseEditModal() {
    this.resetSelectedItem()
    this.setState({
      showEditModal: false,
    })
  }

  // Remove modal
  handleOpenRemoveModal(item) {
    this.setState({
      selectedItem: {
        ...item,
      },
      showRemoveModal: true,
    })
  }

  handleCloseRemoveModal() {
    this.resetSelectedItem()
    this.setState({
      showRemoveModal: false,
    })
  }

  //
  handleOpenSuccessModal(message) {
    setTimeout(() => {
      this.setState({
        showSuccessModal: true,
        successMessage: message,
      })
    }, 1000)
  }

  handleCloseSuccessModal() {
    // const {
    //   onInvalidateData,
    //   onFetchData,
    // } = this.props
    this.setState({
      showSuccessModal: false,
      successMessage: '',
    })
    // onInvalidateData()
    // onFetchData()
  }

  handleOpenFailureModal(message) {
    setTimeout(() => {
      this.setState({
        showFailureModal: true,
        failureMessage: message,
      })
    }, 1000)
  }

  handleCloseFailureModal() {
    this.setState({
      showFailureModal: false,
      failureMessage: '',
    })
  }

  render() {
    const {
      selectedItem,
      showAddModal,
      showEditModal,
      showRemoveModal,
      showSuccessModal,
      showFailureModal,
      successMessage,
      failureMessage,
    } = this.state
    const {
      data,
      loading,
    } = this.props
    return (
      <Template
        currentTab={1}
        headerName="Receivers"
        headerButton
        headerButtonName="New receiver"
        onHeaderButtonClick={this.handleOpenAddModal}
      >
        <>
          <Wrapper>
            <Table
              data={data}
              loading={loading}
              onEdit={this.handleOpenEditModal}
              onRemove={this.handleOpenRemoveModal}
            />
          </Wrapper>
          {showAddModal
            && (
              <AddModal
                onClose={this.handleCloseAddModal}
                onSuccess={this.handleOpenSuccessModal}
                onFailure={this.handleOpenFailureModal}
              />
            )}
          {showEditModal
            && (
              <EditModal
                id={selectedItem._id}
                bankID={selectedItem.bank}
                accountID={selectedItem.accountID}
                nickname={selectedItem.nickname}
                onClose={this.handleCloseEditModal}
                onSuccess={this.handleOpenSuccessModal}
                onFailure={this.handleOpenFailureModal}
              />
            )}
          {showRemoveModal
            && (
              <RemoveModal
                id={selectedItem.id}
                onClose={this.handleCloseRemoveModal}
                onSuccess={this.handleOpenSuccessModal}
                onFailure={this.handleOpenFailureModal}
              />
            )}
          {showSuccessModal
            && (
              <SuccessModal
                onClose={this.handleCloseSuccessModal}
              >
                <Description>{successMessage}</Description>
              </SuccessModal>
            )}
          {showFailureModal
            && (
              <FailureModal
                onClose={this.handleCloseFailureModal}
              >
                <Description>
                  Something wrong has happened that your action was cancelded
                  <br />
                  Error message:
                  {' '}
                  {failureMessage}
                </Description>
              </FailureModal>
            )}
        </>
      </Template>
    )
  }
}

ReceiversPage.defaultProps = {
  data: [],
  loading: false,
  //
  onFetchData: (f) => f,
  // onInvalidateData: (f) => f,
}
ReceiversPage.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    nickname: PropTypes.string,
    accountID: PropTypes.string,
    bankName: PropTypes.string,
    lastItem: PropTypes.bool,
  })),
  loading: PropTypes.bool,
  //
  onFetchData: PropTypes.func,
  // onInvalidateData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  data: state.receivers.receivers,
  loading: state.receivers.loading,
})
const mapDispatchToProps = (dispatch) => ({
  // onInvalidateData: () => dispatch(invalidateReceiversData()),
  onFetchData: () => dispatch(fetchReceiversDataIfNeeded()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiversPage)
