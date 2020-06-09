import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'
import ButtonSort from '../../common/presentational/Button.Sort'
import Filter from './Filter.Status.Transaction'

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
  onFilter,
  onSort,
}) => (
  <Wrapper>
    <Row>
      <Col md={1} />
      <Col md={3}><Text>Receiver</Text></Col>
      <Col md={2}><Text>Amount</Text></Col>
      <Col md={2}><Text>Bank</Text></Col>
      <Col md={2}>
        <Filter
          onChange={onFilter}
        />
      </Col>
      <Col md={2}>
        <ButtonSort
          name="Date"
          desc={desc}
          onClick={onSort}
        />
      </Col>
    </Row>
  </Wrapper>
)
TableHeader.defaultProps = {
  desc: false,
  onSort: (f) => f,
  onFilter: (f) => f,
}
TableHeader.propTypes = {
  desc: PropTypes.bool,
  onSort: PropTypes.func,
  onFilter: PropTypes.func,
}

export default TableHeader
