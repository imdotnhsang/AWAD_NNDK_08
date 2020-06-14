import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Menu from './Menu'
import Header from './Header.Page'

const OuterWrapper = styled.div`
  width: 100%;
  min-height: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 220px;
`
const PageContent = styled.div`
  width: 100%;
  height: 100%;
`

const CustomerTemplate = ({
  currentTab,
  headerName,
  headerButton,
  headerButtonName,
  onHeaderButtonClick,
  children,
}) => (
  <OuterWrapper>
    <Menu tab={currentTab} />
    <Wrapper>
      <Header
        name={headerName}
        button={headerButton}
        buttonName={headerButtonName}
        onClick={onHeaderButtonClick}
      />
      <PageContent>
        {children}
      </PageContent>
    </Wrapper>
  </OuterWrapper>
)
CustomerTemplate.defaultProps = {
  currentTab: 0,
  headerName: '',
  headerButton: false,
  headerButtonName: '',
  onHeaderButtonClick: (f) => f,
  children: null,
}
CustomerTemplate.propTypes = {
  currentTab: PropTypes.number,
  headerName: PropTypes.string,
  headerButton: PropTypes.bool,
  headerButtonName: PropTypes.string,
  onHeaderButtonClick: PropTypes.func,
  // children: PropTypes.element,
}
export default CustomerTemplate
