import {getDateFromTimeStamp,formatMoney} from "@/utils/convert"
const getters = {
    listReceiveTransactionToShow(state) {
      if (state.employee.listReceiveTransaction.length == 0) {
        return []
      }
      const n = state.employee.listReceiveTransaction.length
      let result = []
      for (let i=0;i<n;i++) {
          result.push(state.employee.listReceiveTransaction[i])
          result[i].transaction_amount = formatMoney(result[i].transaction_amount)
          result[i].entry_time = getDateFromTimeStamp(result[i].entry_time)
      }
      return result
    },
    listTransferTransactionToShow(state) {
      if (state.employee.listTransferTransaction.length == 0) {
        return []
      }
      const n = state.employee.listTransferTransaction.length
      let result = []
      for (let i=0;i<n;i++) {
          result.push(state.employee.listTransferTransaction[i])
          result[i].transaction_amount = formatMoney(result[i].transaction_amount)
          result[i].entry_time = getDateFromTimeStamp(result[i].entry_time)
      }
      return result
    },
    listDebtTransactionToShow(state) {
      if (state.employee.listDebtTransaction.length == 0) {
        return []
      }
      const n = state.employee.listDebtTransaction.length
      let result = []
      for (let i=0;i<n;i++) {
          result.push(state.employee.listDebtTransaction[i])
          result[i].transaction_amount = formatMoney(result[i].transaction_amount)
          result[i].entry_time = getDateFromTimeStamp(result[i].entry_time)
      }
      return result
    }
}

export default getters