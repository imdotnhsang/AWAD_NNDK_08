import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeleteButton from '../../common/presentational/Button.Loading'
import CancelButton from '../../common/presentational/Button'
import Template from '../../common/presentational/Template.Modal'
import api from '../../../api/api'

const Text = styled.span`
  font-family: OpenSans-Regular;
  font-size: 12px;
  color: #fff;
  line-height: 16px;
`
const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 54px;
`
const DeleteWrapper = styled.div`
  width: 100%;
  margin-left: 10px;
`
const CancelWrapper = styled.div`
  width: 100%;
  margin-right: 10px;
`
const RemoveReceiverModal = ({
  id,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const data = {
      id,
    }
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
    const res = await api.delete('/receivers/remove', data, config)
    if (res.error) {
      setLoading(false)
      onClose()
      onFailure(res.error)
    } else {
      setLoading(false)
      onClose()
      onSuccess('You have successfully removed a receiver')
    }
  }
  return (
    <Template
      name="Remove receiver"
      onClose={onClose}
    >
      <Text>
        You are about to remove a receiver
        <br />
        {' '}
        This action cannot be restored
      </Text>
      <ButtonWrapper>
        <CancelWrapper>
          <CancelButton
            name="Cancel"
            secondary
            fluid
            onClick={onClose}
          />
        </CancelWrapper>
        <DeleteWrapper>
          <DeleteButton
            name="Delete"
            fluid
            onClick={handleDelete}
            loading={loading}
          />
        </DeleteWrapper>
      </ButtonWrapper>
    </Template>
  )
}
RemoveReceiverModal.defaultProps = {
  id: '',
  onClose: (f) => f,
  onSuccess: (f) => f,
  onFailure: (f) => f,
}
RemoveReceiverModal.propTypes = {
  id: PropTypes.string,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  onFailure: PropTypes.func,
}
export default RemoveReceiverModal
