import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Template from '../common/presentational/Template.Customer'
import Table from './presentational/Table'
import { fetchReceiversData } from '../../actions/receivers'
import { fetchBanksDataIfNeeded } from '../../actions/banks'
import AddModel from './presentational/Modal.AddReceiver'
import EditModel from './presentational/Modal.EditReceiver'
import RemoveModel from './presentational/Modal.RemoveReceiver'

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
    }
    this.resetSelectedItem = this.resetSelectedItem.bind(this)
    this.handleOpenAddModal = this.handleOpenAddModal.bind(this)
    this.handleCloseAddModal = this.handleCloseAddModal.bind(this)
    this.handleOpenEditModal = this.handleOpenEditModal.bind(this)
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this)
    this.handleOpenRemoveModal = this.handleOpenRemoveModal.bind(this)
    this.handleCloseRemoveModal = this.handleCloseRemoveModal.bind(this)
  }

  componentDidMount() {
    const {
      onFetchData,
      onFetchModalData,
    } = this.props
    onFetchData()
    onFetchModalData()
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

  render() {
    const {
      selectedItem,
      showAddModal,
      showEditModal,
      showRemoveModal,
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
        <Table
          data={data}
          loading={loading}
          onEdit={this.handleOpenEditModal}
          onRemove={this.handleOpenRemoveModal}
        />
        <AddModel
          show={showAddModal}
          onClose={this.handleCloseAddModal}
        />
        <EditModel
          id={selectedItem.id}
          bankID={selectedItem.bankID}
          accountID={selectedItem.accountID}
          nickname={selectedItem.nickname}
          show={showEditModal}
          onClose={this.handleCloseEditModal}
        />
        <RemoveModel
          id={selectedItem.id}
          show={showRemoveModal}
          onClose={this.handleCloseRemoveModal}
        />
      </Template>
    )
  }
}

ReceiversPage.defaultProps = {
  data: [],
  loading: false,
  onFetchData: (f) => f,
  onFetchModalData: (f) => f,
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
  onFetchData: PropTypes.func,
  onFetchModalData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  data: state.receivers.receivers,
  loading: state.receivers.loading,
})
const mapDispatchToProps = (dispatch) => ({
  onFetchData: () => dispatch(fetchReceiversData()),
  onFetchModalData: () => dispatch(fetchBanksDataIfNeeded()),
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReceiversPage)
