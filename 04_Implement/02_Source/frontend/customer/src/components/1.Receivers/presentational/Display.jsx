import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'
import Loading from '../../common/presentational/Loading.Table.Min'

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.blackDark};
  width: 100%;
  padding: 36px 16px;
  box-sizing: border-box;
  opacity: ${(props) => (props.loading && '0.5')};
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`
const Display = ({
  name,
  bankName,
  cardNumber,
  loading,
}) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <Wrapper loading={loading}>
      <Row>
        <Col lg={3}><Text>Name:</Text></Col>
        <Col lg={4}><Text>{name}</Text></Col>
        <Col lg={2}><Text>Bank:</Text></Col>
        <Col lg={3}><Text>{bankName}</Text></Col>
      </Row>
      <Row style={{ marginTop: '32px' }}>
        <Col lg={3}><Text>Card number:</Text></Col>
        <Col lg={9}><Text>{cardNumber}</Text></Col>
      </Row>
    </Wrapper>
    { loading && <Loading />}
  </div>
)
Display.defaultProps = {
  name: '',
  bankName: '',
  cardNumber: '',
  loading: false,
}
Display.propTypes = {
  name: PropTypes.string,
  bankName: PropTypes.string,
  cardNumber: PropTypes.string,
  loading: PropTypes.bool,
}
export default Display
