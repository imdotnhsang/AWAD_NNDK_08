import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button.Tab'

const Wrapper = styled.div`
  width: 100%;
  padding: 20px 60px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  &> * {
    margin-right: 120px;
  }
  &> *:last-child {
    margin-right: 0px;
  }
`

const TabMenu = ({
  value,
  data,
  onChange,
}) => (
  <Wrapper>
    {
      data.map((e) => (
        <Button
          key={e.value}
          name={e.name}
          onClick={() => onChange(e.value)}
          active={value === e.value}
        />
      ))
    }
  </Wrapper>
)

TabMenu.defaultProps = {
  value: '',
  data: [],
  onChange: (f) => f,
}
TabMenu.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  ),
  onChange: PropTypes.func,
}
export default TabMenu
