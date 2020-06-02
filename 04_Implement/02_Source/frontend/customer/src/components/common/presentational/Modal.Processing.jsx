import React from 'react'
import styled from 'styled-components'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.75);
`
const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #26292E;
  border-radius: 25px;
  padding: 60px 54px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`
const Name = styled.span`
  font-family: OpenSans-Regular;
  color: #fff;
  font-size: 20px;
  margin-right: 40px;
  width: max-content;
`
const Loading = styled.img`
  width: 100px;
  height: auto;
`
const Modal = () => (
  <Backdrop>
    <Wrapper>
      <Name>Processing . . .</Name>
      <Loading src="/images/loading.gif" />
    </Wrapper>
  </Backdrop>
)
export default Modal
