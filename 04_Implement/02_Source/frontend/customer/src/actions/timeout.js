import { receiveBanksData } from './banks'
import { receiveAccountData } from './account'
import { receiveCardsData, initializedCards } from './cards'
import { receiverDebtsData, initializedDebt } from './debts'
import { receiverHistoryData, initializedHistory } from './history'
import { receiveReceiversData } from './receivers'
import {
	receiverNotificationsData,
	initializedNotification,
} from './notifications'
import { clearStorage } from '../utils/utils'
import { showError } from '../components/common/presentational/Error'

export const loginTimeout = (error) => async (dispatch) => {
	showError('Login timeout ...')
	clearStorage()
	dispatch(
		receiveAccountData({
			email: '',
			full_name: '',
			phone_number: '',
		})
	)

	dispatch(receiveBanksData([]))

	dispatch(
		receiveCardsData({
			defaultAccount: {},
			savingAccounts: [],
		})
	)
	dispatch(initializedCards(false))

	dispatch(receiverDebtsData('createdByYou', []))
	dispatch(initializedDebt('createdByYou', false))
	dispatch(receiverDebtsData('receivedFromOthers', []))
	dispatch(initializedDebt('receivedFromOthers', false))

	dispatch(receiverHistoryData('receive', []))
	dispatch(initializedHistory('receive', false))
	dispatch(receiverHistoryData('transfer', [], false))
	dispatch(initializedHistory('transfer', false))
	dispatch(receiverHistoryData('debtRepaying', [], false))
	dispatch(initializedHistory('debtRepaying', false))

	dispatch(receiverNotificationsData([]))
	dispatch(initializedNotification(false))

	dispatch(receiveReceiversData([]))
	setTimeout(() => (window.location = 'http://localhost:3000/login'), 1500)
}
