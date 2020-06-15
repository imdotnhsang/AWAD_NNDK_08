import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ScrollArea from 'react-scrollbar'
import Header from './Table.Header.Receive'
import Item from './Table.Item.Receive'
import Loading from '../../common/presentational/Loading.Table'
import { DebtStatus } from '../../../constants/constants'
import {
	invalidateHistoryData,
	fecthHistoryDataIfNeeded,
} from '../../../actions/history'
import { getAmountFactTransaction } from '../../../utils/utils'

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
`
const Content = styled.div`
	width: 100%;
	height: 590px;
	position: relative;
`
const NoList = styled.p`
	font-family: OpenSans-Regular;
	font-size: 15px;
	color: #fff;
	line-height: 16px;
	text-align: center;
	width: 100%;
`

class Table extends Component {
	constructor(props) {
		super(props)
		this.state = {
			desc: null,
		}
		this.ref = createRef()
		this.handleDesc = this.handleDesc.bind(this)
	}

	componentDidMount() {
		const {
			loading,
			// onInvalidateData,
			onFetchData,
		} = this.props
		if (!loading) {
			this.ref.current.scrollArea.scrollTop()
		}
		// onInvalidateData()
		onFetchData('receive')
	}

	componentDidUpdate() {
		const { loading } = this.props
		if (!loading) {
			this.ref.current.scrollArea.scrollTop()
		}
	}

	handleDesc() {
		this.setState((prevState) => ({
			desc: prevState.desc === null ? false : !prevState.desc,
		}))
	}

	render() {
		const { desc } = this.state
		const { data, loading } = this.props
		let sortedData = data
		if (desc !== null) {
			sortedData = sortedData.sort((a, b) =>
				desc ? a.entry_time - b.entry_time : b.entry_time - a.entry_time
			)
		}
		return (
			<Wrapper>
				<Header desc={desc} onChange={this.handleDesc} />
				<Content>
					{loading ? (
						<Loading />
					) : (
						<ScrollArea
							speed={0.5}
							horizontal={false}
							style={{ maxHeight: '590px' }}
							verticalScrollbarStyle={{
								width: '5px',
								backgroundColor: '#7C7F87',
								borderRadius: '10px',
							}}
							verticalContainerStyle={{
								width: '5px',
								backgroundImage:
									'linear-gradient(180deg, #26292E 0%, #16181C 100%)',
								borderRadius: '10px',
								right: '0px',
							}}
							smoothScrolling
							ref={this.ref}
						>
							{sortedData.length === 0 ? (
								<NoList>No transaction list</NoList>
							) : (
								sortedData.map((item, index) => (
									<Item
										key={item._id}
										index={index + 1}
										accountID={item.from_account_id}
										accountName={item.from_fullname}
										amount={getAmountFactTransaction(
											'receive',
											item.transaction_amount,
											item.transaction_payer,
											item.from_bank_id
										)}
										bankName={item.from_bank_id}
										date={item.entry_time}
										lastItem={index === data.length - 1}
									/>
								))
							)}
						</ScrollArea>
					)}
				</Content>
			</Wrapper>
		)
	}
}

Table.defaultProps = {
	data: [],
	loading: false,
	// onInvalidateDate: (f) => f,
	onFetchData: (f) => f,
}
Table.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			borrowerID: PropTypes.string,
			borrowerName: PropTypes.string,
			status: PropTypes.oneOf([
				DebtStatus.UNPAID,
				DebtStatus.PAID,
				DebtStatus.CANCELLED,
			]),
			amount: PropTypes.number,
		})
	),
	loading: PropTypes.bool,
	// onInvalidateDate: PropTypes.func,
	onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
	loading: state.history.receive.loading,
	data: state.history.receive.data,
})
const mapDispatchToProps = (dispatch) => ({
	onInvalidateDate: (category) => dispatch(invalidateHistoryData(category)),
	onFetchData: (category) => dispatch(fecthHistoryDataIfNeeded(category)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Table)
