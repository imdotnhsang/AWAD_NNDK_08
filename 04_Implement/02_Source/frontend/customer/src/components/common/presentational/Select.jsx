import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'

const Title = styled.span`
  font-size: 10px;
  margin-bottom: 8px;
  font-family: OpenSans-Regular;
  color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
`
const Value = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%; 
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`
const Wrapper = styled.button`
  background-color: ${(props) => props.theme.blackDark};
  width: 100%;
  opacity: ${(props) => (props.disabled && '0.5')};
`
const Logo = styled.svg`
  transform: ${(props) => (props.show ? 'rotate(180deg)' : 'rotate(0deg)')};
  margin-right: 16px;
  transition: transform 0.5s ease-out;
  margin-left: auto;
`
const List = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.blackDark};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: absolute;
  top: 62px;
  display: ${(props) => (props.show ? 'default' : 'none')};
  min-width: max-content;
  z-index: 1;
`
const Item = styled.button`
  padding: 8px 16px;
  width: 100%;
  margin-bottom: ${(props) => (!props.lastItem && '4px')};
  &:hover {
    background-color: rgba(71, 75, 81, 0.23);
  }
  text-align: left;
  vertical-align: middle;
`
const ItemText = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`
const rotate = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`
const Loading = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${rotate} 2s linear infinite;
`

const Select = ({
  label,
  placeholder,
  loading,
  disabled,
  value,
  data,
  error,
  onChange,
}) => {
  const [show, setShow] = useState(false)

  const handleClick = (v) => {
    setShow(false)
    onChange(v)
  }

  const currentItem = data.find((e) => e.value === value)

  return (
    <div style={{ position: 'relative' }}>
      <Wrapper onClick={() => setShow(!show)} disabled={disabled || loading}>
        <Row>
          <Col style={{ margin: '12px 0', paddingLeft: '16px', paddingRight: '16px' }}>
            {error
              ? <Title error>{error}</Title>
              : <Title>{label}</Title>}
            <Value>{currentItem ? currentItem.text : placeholder}</Value>
          </Col>
          <Logo show={show} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1893 5.25L11.25 6.31066L7.34987 10.2108L6.28921 9.15013L10.1893 5.25Z" fill="white" />
            <path d="M8.41839 9.1307L7.35773 10.1914L3.47703 6.31066L4.53769 5.25L8.41839 9.1307Z" fill="white" />
          </Logo>
        </Row>
      </Wrapper>
      <List show={show}>
        {
          data.map((option, index) => (
            index !== data.length - 1
              ? (
                <Item
                  onClick={() => handleClick(option.value)}
                >
                  <ItemText>{option.text}</ItemText>
                </Item>
              )
              : (
                <Item
                  lastItem
                  onClick={() => handleClick(option.value)}
                >
                  <ItemText>{option.text}</ItemText>
                </Item>
              )
          ))
        }
      </List>
      {
        (loading && !disabled)
          && (
          <Loading width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M3 10C3 6.22386 6.22386 3 10 3C13.7761 3 17 6.22386 17 10C17 10.2761 16.7761 10.5 16.5 10.5C16.2239 10.5 16 10.2761 16 10C16 6.77614 13.2239 4 10 4C6.77614 4 4 6.77614 4 10C4 10.2761 3.77614 10.5 3.5 10.5C3.22386 10.5 3 10.2761 3 10Z" fill="#EF230C" />
            <path fillRule="evenodd" clipRule="evenodd" d="M3.5 9.5C3.77614 9.5 4 9.72386 4 10C4 13.2239 6.77614 16 10 16C10.8385 16 12.0054 15.7684 13.0731 15.1861C14.1333 14.6078 15.0739 13.6971 15.5257 12.3419C15.613 12.0799 15.8961 11.9383 16.1581 12.0257C16.4201 12.113 16.5617 12.3961 16.4743 12.6581C15.9261 14.3029 14.7834 15.3922 13.5519 16.0639C12.3279 16.7316 10.9948 17 10 17C6.22386 17 3 13.7761 3 10C3 9.72386 3.22386 9.5 3.5 9.5Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="3.5" y1="10" x2="17.5" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EF230C" stopOpacity="0.81" />
                <stop offset="1" stopColor="#EF230C" stopOpacity="0" />
              </linearGradient>
            </defs>
          </Loading>
          )
      }
    </div>
  )
}
Select.defaultProps = {
  label: '',
  placeholder: '',
  loading: false,
  disabled: false,
  value: '',
  data: [],
  error: '',
  onChange: (f) => f,
}
Select.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.string,
  })),
  error: PropTypes.string,
  onChange: PropTypes.func,
}
export default Select
