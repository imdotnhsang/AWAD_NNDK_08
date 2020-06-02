import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Template from '../common/presentational/Template.Customer'
import Button from '../common/presentational/Button.Loading'
import { fetchCardsDataIfNeeded } from '../../actions/cards'
import { fetchReceiversDataIfNeeded } from '../../actions/receivers'
import { fetchBanksDataIfNeeded } from '../../actions/banks'
import InternalModal from './presentational/Modal.Internal'
import InterbankModal from './presentational/Modal.Interbank'
import SuccessModal from '../common/presentational/Modal.Success'
import FailureModal from '../common/presentational/Modal.Failure'
import ProcessingModal from '../common/presentational/Modal.Processing'
import SaveReceiverModal from './presentational/Modal.SaveReceiver'

const Wrapper = styled.div`
  width: 100%;
  padding-bottom: 67px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const SectionWrapper = styled.div`
  padding: 20px 60px;
  width: 100%;
`
const ImageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
`
const InnerButtonWrapper = styled.div`
  width: 345px;
  margin: 36px 0;
`
const Description = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  line-height: 16px;
`

class TransferPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newReceiver: {
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      showInternal: false,
      showInterbank: false,
      showSuccess: false,
      showFailure: false,
      showProcessing: false,
      showSaveReceiver: false,
      failureMessage: '',
    }
    this.handleNewReceiver = this.handleNewReceiver.bind(this)
    this.handleOpenInternal = this.handleOpenInternal.bind(this)
    this.handleCloseInternal = this.handleCloseInternal.bind(this)
    this.handleOpenInterbank = this.handleOpenInterbank.bind(this)
    this.handleCloseInterbank = this.handleCloseInterbank.bind(this)
    this.handleOpenSuccessModal = this.handleOpenSuccessModal.bind(this)
    this.handleCloseSuccessModal = this.handleCloseSuccessModal.bind(this)
    this.handleOpenFailureModal = this.handleOpenFailureModal.bind(this)
    this.handleCloseFailureModal = this.handleCloseFailureModal.bind(this)
    this.handleShowProcessing = this.handleShowProcessing.bind(this)
    this.handleOpenSaveReceiverModal = this.handleOpenSaveReceiverModal.bind(this)
    this.handleCloseSaveReceiverModal = this.handleCloseSaveReceiverModal.bind(this)
  }

  componentDidMount() {
    const {
      onFetchCardsData,
      onFetchReceiversData,
      onFetchBanksData,
    } = this.props
    onFetchCardsData()
    onFetchReceiversData()
    onFetchBanksData()
  }

  handleNewReceiver(value) {
    this.setState({
      newReceiver: value,
    })
  }

  handleOpenInternal() {
    this.setState({
      showInternal: true,
      showInterbank: false,
    })
  }

  handleCloseInternal() {
    this.setState({
      showInternal: false,
    })
  }

  handleOpenInterbank() {
    this.setState({
      showInterbank: true,
      showInternal: false,
    })
  }

  handleCloseInterbank() {
    this.setState({
      showInterbank: false,
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
    this.setState({
      showSuccess: false,
    })
    const { newReceiver } = this.state
    if (newReceiver.accountID) {
      this.handleOpenSaveReceiverModal()
    }
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

  handleOpenSaveReceiverModal() {
    this.setState({
      showSaveReceiver: true,
    })
  }

  handleCloseSaveReceiverModal() {
    this.setState({
      newReceiver: {
        accountName: '',
        accountID: '',
        bankID: '',
        bankName: '',
      },
      showSaveReceiver: false,
    })
  }

  render() {
    const {
      newReceiver,
      showInternal,
      showInterbank,
      showSuccess,
      showFailure,
      showProcessing,
      showSaveReceiver,
      failureMessage,
    } = this.state

    const {
      loadingCards,
      loadingReceivers,
      loadingBanks,
    } = this.props

    const loading = loadingCards || loadingReceivers || loadingBanks

    return (
      <Template
        currentTab={2}
        headerName="Transfer"
      >
        <>
          <Wrapper>
            <SectionWrapper
              style={{ backgroundImage: 'linear-gradient(90deg, #111111 0%, #EF230C 19.79%, #FFDC00 100%)' }}
            >
              <Row>
                <Col lg={6}>
                  <ImageWrapper>
                    <img src="/images/internal.svg" alt="Internal transfer" />
                  </ImageWrapper>
                </Col>
                <Col lg={6}>
                  <ButtonWrapper>
                    <InnerButtonWrapper>
                      <Button
                        fluid
                        name="EIGHT.Bank internal transfer"
                        onClick={this.handleOpenInternal}
                        loading={showInternal && loading}
                      />
                    </InnerButtonWrapper>
                  </ButtonWrapper>
                </Col>
              </Row>
            </SectionWrapper>
            <SectionWrapper>
              <Row>
                <Col lg={6}>
                  <ImageWrapper>
                    <img src="/images/interbank.svg" alt="Interbank transfer" />
                  </ImageWrapper>
                </Col>
                <Col lg={6}>
                  <ButtonWrapper>
                    <InnerButtonWrapper>
                      <Button
                        fluid
                        secondary
                        name="Interbank transfer"
                        onClick={this.handleOpenInterbank}
                        loading={showInterbank && loading}
                      />
                    </InnerButtonWrapper>
                  </ButtonWrapper>
                </Col>
              </Row>
            </SectionWrapper>
            {
              (showInternal && !loading) && (
                <InternalModal
                  show={showInternal && !loading}
                  onNewReceiver={this.handleNewReceiver}
                  onClose={this.handleCloseInternal}
                  onSuccess={this.handleOpenSuccessModal}
                  onFailure={this.handleOpenFailureModal}
                  onProcessing={this.handleShowProcessing}
                />
              )
            }
            {
              (showInterbank && !loading) && (
                <InterbankModal
                  show={showInterbank && !loading}
                  onNewReceiver={this.handleNewReceiver}
                  onClose={this.handleCloseInterbank}
                  onSuccess={this.handleOpenSuccessModal}
                  onFailure={this.handleOpenFailureModal}
                  onProcessing={this.handleShowProcessing}
                />
              )
            }
          </Wrapper>
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
          <SaveReceiverModal
            show={showSaveReceiver}
            onClose={this.handleCloseSaveReceiverModal}
            data={newReceiver}
          />
        </>
      </Template>
    )
  }
}
TransferPage.defaultProps = {
  loadingCards: false,
  loadingReceivers: false,
  loadingBanks: false,
  onFetchCardsData: (f) => f,
  onFetchReceiversData: (f) => f,
  onFetchBanksData: (f) => f,
}
TransferPage.propTypes = {
  loadingCards: PropTypes.bool,
  loadingReceivers: PropTypes.bool,
  loadingBanks: PropTypes.bool,
  onFetchCardsData: PropTypes.func,
  onFetchReceiversData: PropTypes.func,
  onFetchBanksData: PropTypes.func,
}

const mapStateToProps = (state) => ({
  loadingCards: state.cards.loading,
  loadingReceivers: state.receivers.loading,
  loadingBanks: state.banks.loading,
})
const mapDispatchToProps = (dispatch) => ({
  onFetchCardsData: () => dispatch(fetchCardsDataIfNeeded()),
  onFetchReceiversData: () => dispatch(fetchReceiversDataIfNeeded()),
  onFetchBanksData: () => dispatch(fetchBanksDataIfNeeded()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPage)
