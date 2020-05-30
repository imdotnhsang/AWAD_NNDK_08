import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Template from '../common/presentational/Template.Customer'
import Button from '../common/presentational/Button.Loading'
import { fetchCardsDataIfNeeded } from '../../actions/cards'
import { fetchReceiversDataIfNeeded } from '../../actions/receivers'
import InternalModal from './presentational/Modal.Internal'

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
class TransferPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showInternal: false,
      showInterbank: false,
    }
    this.handleOpenInternal = this.handleOpenInternal.bind(this)
    this.handleCloseInternal = this.handleCloseInternal.bind(this)
    this.handleOpenInterban = this.handleOpenInterbank.bind(this)
    this.handleCloseInterbank = this.handleCloseInterbank.bind(this)
  }

  componentDidMount() {
    const {
      onFetchCardsData,
      onFetchReceiversData,
    } = this.props
    onFetchCardsData()
    onFetchReceiversData()
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


  render() {
    const {
      showInternal,
      showInterbank,
    } = this.state

    const {
      loadingCards,
      loadingReceivers,
    } = this.props

    const loading = loadingCards || loadingReceivers

    return (
      <Template
        currentTab={2}
        headerName="Transfer"
      >
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
                onClose={this.handleCloseInternal}
              />
            )
          }
        </Wrapper>
      </Template>
    )
  }
}
TransferPage.defaultProps = {
  loadingCards: false,
  loadingReceivers: false,
  onFetchCardsData: (f) => f,
  onFetchReceiversData: (f) => f,
}
TransferPage.propTypes = {
  loadingCards: PropTypes.bool,
  loadingReceivers: PropTypes.bool,
  onFetchCardsData: PropTypes.func,
  onFetchReceiversData: PropTypes.func,
}

const mapStateToProps = (state) => ({
  loadingCards: state.cards.loading,
  loadingReceivers: state.receivers.loading,
})
const mapDispatchToProps = (dispatch) => ({
  onFetchCardsData: () => dispatch(fetchCardsDataIfNeeded()),
  onFetchReceiversData: () => dispatch(fetchReceiversDataIfNeeded()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TransferPage)
