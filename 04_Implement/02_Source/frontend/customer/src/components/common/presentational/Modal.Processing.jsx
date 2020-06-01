import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Button from './Button'
import { resolveTagFromProps } from '../../../utils/utils'

const styleModifiers = ['show']

const Backdrop = styled(resolveTagFromProps(styleModifiers, 'div'))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.75);
  display: ${(props) => (props.show ? 'block' : 'none')}
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
const Modal = ({
  show,
}) => (
  <Backdrop show={show}>
    <Wrapper>
      <Name>Processing . . .</Name>
      <Loading src="/images/loading.gif" />
    </Wrapper>
  </Backdrop>
)

Modal.defaultProps = {
  show: false,
}
Modal.propTypes = {
  show: PropTypes.bool,
}
export default Modal
