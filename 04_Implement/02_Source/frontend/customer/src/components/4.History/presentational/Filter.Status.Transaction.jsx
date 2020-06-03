import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { TransactionStatus } from '../../../constants/constants'
import Status from './Status.Transaction'

const Wrapper = styled.button`
  width: max-content;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`
const Name = styled.span`
  font-family: OpenSans-SemiBold;
  font-size: 15px;
  color: #fff;
  margin-right: 20px;
`
const Menu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: 54px;
  left: -12px;
  background-color: ${(props) => props.theme.blackDark};
  box-shadow: -4px 4px 6px #EF230C;
  z-index: 1;
`
const Item = styled.button`
  padding: 12px;
  width: 180px;
  &:hover {
    background-color: rgba(71, 75, 81, 0.23);
  }
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`
const Text = styled.div`
  font-family: OpenSans-Regular;
  font-size: 15px;
  color: #fff;
`
class StatusFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
    }
    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleToggleMenu() {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }))
  }

  handleOnClick(value) {
    const {
      onChange,
    } = this.props
    this.setState({
      showMenu: false,
    })
    onChange(value)
  }

  render() {
    const { showMenu } = this.state
    return (
      <div style={{ position: 'relative' }}>
        <Wrapper onClick={this.handleToggleMenu} type="button">
          <Name>Status</Name>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1363 3.5H4.54637C4.34183 3.49961 4.15443 3.61381 4.06099 3.79567C3.96626 3.97997 3.98288 4.20192 4.10391 4.37024L8.34995 10.3517C8.35137 10.3538 8.35291 10.3557 8.35433 10.3578C8.50861 10.5661 8.59213 10.8184 8.59251 11.0776V15.9543C8.59161 16.0986 8.64832 16.2375 8.75001 16.3399C8.85183 16.4423 8.99026 16.5 9.13461 16.5C9.20795 16.4999 9.28064 16.4853 9.34843 16.4571L11.7344 15.5474C11.9481 15.4821 12.09 15.2803 12.09 15.0375V11.0776C12.0904 10.8184 12.1739 10.5661 12.328 10.3578C12.3295 10.3557 12.331 10.3538 12.3324 10.3517L16.5786 4.37011C16.6996 4.20192 16.7162 3.9801 16.6215 3.7958C16.5282 3.61381 16.3407 3.49961 16.1363 3.5V3.5Z" fill="white" />
          </svg>
        </Wrapper>
        { showMenu
          && (
            <Menu>
              <Item onClick={() => this.handleOnClick('')} type="button">
                <Text>All status</Text>
              </Item>
              <Item onClick={() => this.handleOnClick(TransactionStatus.SUCCESS)} type="button">
                <Status status={TransactionStatus.SUCCESS} />
              </Item>
              <Item onClick={() => this.handleOnClick(TransactionStatus.REFUND)} type="button">
                <Status status={TransactionStatus.REFUND} />
              </Item>
              <Item onClick={() => this.handleOnClick(TransactionStatus.FAILED)} type="button">
                <Status status={TransactionStatus.FAILED} />
              </Item>
            </Menu>
          )}
      </div>
    )
  }
}

StatusFilter.defaultProps = {
  onChange: (f) => f,
}
StatusFilter.propTypes = {
  onChange: PropTypes.func,
}
export default StatusFilter
