import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ScrollArea from 'react-scrollbar'
import Header from './Table.Header'
import Item from './Table.Item'
import Loading from '../../common/presentational/Loading.Table'

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

const Table = ({ data, loading, onEdit, onRemove }) => (
	<Wrapper>
		<Header />
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
				>
					{data.length === 0 ? (
						<NoList>No receiver list</NoList>
					) : (
						data.map((item, index) => (
							<Item
								key={item._id}
								index={index + 1}
								nickname={item.nickname}
								fullName={item.full_name}
								cardNumber={item.account_id}
								bankName={item.bank_id}
								lastItem={index === data.length - 1}
								onEdit={() => onEdit(item)}
								onRemove={() => onRemove(item)}
							/>
						))
					)}
				</ScrollArea>
			)}
		</Content>
	</Wrapper>
)
Table.defaultProps = {
	data: [],
	loading: false,
	onEdit: (f) => f,
	onRemove: (f) => f,
}
Table.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string,
			nickname: PropTypes.string,
			accountID: PropTypes.string,
			bankName: PropTypes.string,
		})
	),
	loading: PropTypes.bool,
	onEdit: PropTypes.func,
	onRemove: PropTypes.func,
}
export default Table
