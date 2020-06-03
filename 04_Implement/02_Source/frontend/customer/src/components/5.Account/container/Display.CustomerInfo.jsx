import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Loading from '../../common/presentational/Loading.Table'
import {
  fetchAccountDataIfNeeded,
} from '../../../actions/account'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  height: 290px;
`
const InfoWrapper = styled.div`
  width: 100%;
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
`
const StyledRow = styled(Row)`
  padding: 40px 0px;
`
const Display = ({
  account,
  loading,
  onFetchData,
}) => {
  useEffect(() => {
    onFetchData()
  }, [])
  return (
    <Wrapper>
      {
        loading
          ? <Loading />
          : (
            <InfoWrapper>
              <StyledRow>
                <Col md={2}><Text>Name:</Text></Col>
                <Col md={10}><Text>{account.name}</Text></Col>
              </StyledRow>
              <StyledRow>
                <Col md={2}><Text>Phone:</Text></Col>
                <Col md={10}><Text>{account.phone}</Text></Col>
              </StyledRow>
              <StyledRow>
                <Col md={2}><Text>Email:</Text></Col>
                <Col md={10}><Text>{account.email}</Text></Col>
              </StyledRow>
            </InfoWrapper>
          )
      }
    </Wrapper>
  )
}
Display.defaultProps = {
  account: {
    name: '',
    phone: '',
    email: '',
  },
  loading: false,
  onFetchData: (f) => f,
}
Display.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  }),
  loading: PropTypes.bool,
  onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
  loading: state.account.loading,
  account: state.account.account,
})

const mapDispatchToProps = (dispatch) => ({
  onFetchData: () => dispatch(fetchAccountDataIfNeeded()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Display)
