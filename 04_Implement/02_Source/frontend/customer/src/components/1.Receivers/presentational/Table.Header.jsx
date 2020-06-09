import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap'

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
const TableHeader = () => (
  <Wrapper>
    <Row>
      <Col md={1} />
      <Col md={4}><Text>Nickname</Text></Col>
      <Col md={3}><Text>Card number</Text></Col>
      <Col md={2}><Text>Bank</Text></Col>
      <Col md={2}><Text>Actions</Text></Col>
    </Row>
  </Wrapper>
)

export default TableHeader
