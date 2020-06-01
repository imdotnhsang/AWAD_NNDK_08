import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'

const Wrapper = styled.div`
  width: 100%;
  padding: 12px;
  border-bottom: 1px solid #000000;
  background-color: ${(props) => props.theme.blackDark};
`
const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  font-weight: 600;
`
const TableHeader = () => (
  <Wrapper>
    <Row>
      <Col md={4}><Text>Name</Text></Col>
      <Col md={4}><Text>Card number</Text></Col>
      <Col md={4}><Text>Bank</Text></Col>
    </Row>
  </Wrapper>
)

export default TableHeader
