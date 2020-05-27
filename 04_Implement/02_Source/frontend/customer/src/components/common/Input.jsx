import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Title = styled.span`
  font-size: 10px;
  margin-bottom: 8px;
  font-family: OpenSans-Regular;
  color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
`
const Input = styled.input`
  width: 100%;
`
const Line = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${(props) => (props.error ? props.theme.yellow : props.theme.grayMedium)};
  transition: background-color 1s ease-in;
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
const Wrapper = styled.div`
  background-color: ${(props) => props.theme.blackDark};
  width: 100%;
  opacity: ${(props) => (props.disabled && '0.5')}
`
const GeneralInput = ({
  label,
  placeholder,
  value,
  error,
  type,
  disabled,
  onChange,
}) => (
  <Wrapper disabled={disabled}>
    <Col>
      <Row>
        <Col style={{ margin: '12px 0', paddingLeft: '16px', paddingRight: '16px' }}>
          {error
            ? <Title error>{error}</Title>
            : <Title>{label}</Title>}
          <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
          />
        </Col>
      </Row>
      {error ? <Line error /> : <Line />}
    </Col>
  </Wrapper>
)
GeneralInput.defaultProps = {
  label: '',
  placeholder: '',
  value: '',
  error: '',
  type: 'text',
  disabled: false,
  onChange: (f) => f,
}
GeneralInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
}
export default GeneralInput
