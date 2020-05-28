import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Menu from '../container/Menu'

const Wrapper = styled.div`
  width: 100%;
  min-height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const CustomerTemplate = ({
  children,
}) => (
  <Wrapper>
    <Menu />
    {children}
  </Wrapper>
)
CustomerTemplate.defaultProps = {
  children: null,
}
CustomerTemplate.propTypes = {
  children: PropTypes.element,
}
export default CustomerTemplate
