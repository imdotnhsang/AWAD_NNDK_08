import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import ButtonSort from '../../common/presentational/Button.Sort'

const Wrapper = styled.div`
  width: 100%;
  padding: 24px 0;
  border-bottom: 1px solid #000000;
  background-color: ${(props) => props.theme.blackDark};
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
  font-weight: 600;
`
const TableHeader = ({
  desc,
  onChange,
}) => (
  <Wrapper>
    <Row>
      <Col md={1} />
      <Col md={3}><Text>Transferer</Text></Col>
      <Col md={3}><Text>Amount</Text></Col>
      <Col md={2}><Text>Bank</Text></Col>
      <Col md={2}>
        <ButtonSort
          name="Date"
          desc={desc}
          onClick={onChange}
        />
      </Col>
      <Col md={1}><Text>Action</Text></Col>
    </Row>
  </Wrapper>
)
TableHeader.defaultProps = {
  desc: false,
  onChange: (f) => f,
}
TableHeader.propTypes = {
  desc: PropTypes.bool,
  onChange: PropTypes.func,
}

export default TableHeader
