import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 24px;
  width: 100%;
  background-color: ${(props) => props.theme.orange};
`
const Number = styled.span`
  font-family: OpenSans-Bold;
  font-size: 30px;
  color: #fff;
`
const SeparatorLine = styled.div`
  width: 1px;
  height: 60px;
  margin: 0px 24px;
  background-color: #fff;
`
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`
const Name = styled.span`
  font-family: OpenSans-Regular;
  font-size: 20px;
  color: #fff;
  margin-bottom: 16px;
`
const Description = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
`

const StepBanner = ({
  index,
  name,
  description,
}) => (
  <Wrapper>
    <Number>{index}</Number>
    <SeparatorLine />
    <InfoWrapper>
      <Name>{name}</Name>
      <Description>{description}</Description>
    </InfoWrapper>
  </Wrapper>
)
StepBanner.defaultProps = {
  index: 1,
  name: '',
  description: '',
}
StepBanner.propTypes = {
  index: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
}
export default StepBanner
