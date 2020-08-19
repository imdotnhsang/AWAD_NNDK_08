import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import ScrollArea from 'react-scrollbar'
import Header from './Table.Header.DebtRepaying'
import Item from './Table.Item.DebtRepaying'
import Loading from '../../common/presentational/Loading.Table'
import { TransactionStatus, DebtType } from '../../../constants/constants'
import {
	invalidateHistoryData,
	fecthHistoryDataIfNeeded,
} from '../../../actions/history'
import { getDebtType } from '../../../utils/utils'

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
			statusFilter: '',
			typeFilter: '',
		}
		this.ref = createRef()
		this.handleDesc = this.handleDesc.bind(this)
		this.handleStatusFilter = this.handleStatusFilter.bind(this)
		this.handleTypeFilter = this.handleTypeFilter.bind(this)
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
		onFetchData('debtRepaying')
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

	handleStatusFilter(value) {
		this.setState({
			statusFilter: value,
		})
	}

	handleTypeFilter(value) {
		this.setState({
			typeFilter: value,
		})
	}

	render() {
		const { desc, typeFilter, statusFilter } = this.state
		const { data, loading } = this.props
		let sortedData = data
		if (typeFilter) {
			sortedData = sortedData.filter((o) => {
				const type = getDebtType(o.from_account_id)
				return type === typeFilter
			})
		}

		if (statusFilter) {
			sortedData = sortedData.filter(
				(o) => o.transaction_status === statusFilter
			)
		}
		if (desc !== null) {
			sortedData = sortedData.sort((a, b) =>
				desc ? a.entry_time - b.entry_time : b.entry_time - a.entry_time
			)
		}
		return (
			<Wrapper>
				<Header
					desc={desc}
					onStatusFilter={this.handleStatusFilter}
					onTypeFilter={this.handleTypeFilter}
					onSort={this.handleDesc}
				/>
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
								sortedData.map((item, index) => {
									const type = getDebtType(item.from_account_id)
									const accountID =
										type === DebtType.LOAN
											? item.to_account_id
											: item.from_account_id
									const accountName =
										type === DebtType.LOAN
											? item.to_fullname
											: item.from_fullname
									return (
										<Item
											key={item._id}
											index={index + 1}
											accountID={accountID}
											accountName={accountName}
											amount={
												type === DebtType.LOAN
													? item.transaction_amount + 1100
													: item.transaction_amount
											}
											status={item.transaction_status}
											type={type}
											date={item.entry_time}
											lastItem={index === data.length - 1}
										/>
									)
								})
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
			lenderID: PropTypes.string,
			lenderName: PropTypes.string,
			borrowerID: PropTypes.string,
			borrowerName: PropTypes.string,
			status: PropTypes.oneOf([
				TransactionStatus.SUCCESS,
				TransactionStatus.FAILED,
				TransactionStatus.REFUND,
			]),
			amount: PropTypes.number,
		})
	),
	loading: PropTypes.bool,
	// onInvalidateDate: PropTypes.func,
	onFetchData: PropTypes.func,
}
const mapStateToProps = (state) => ({
	loading: state.history.debtRepaying.loading,
	data: state.history.debtRepaying.data,
})
const mapDispatchToProps = (dispatch) => ({
	onInvalidateDate: (category) => dispatch(invalidateHistoryData(category)),
	onFetchData: (category) => dispatch(fecthHistoryDataIfNeeded(category)),
})
export default connect(mapStateToProps, mapDispatchToProps)(Table)
