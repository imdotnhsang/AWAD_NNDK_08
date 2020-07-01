import {getDateFromTimeStamp,formatMoney} from "@/utils/convert"
const getters = {
    listTransactionToShow(state) {
      if (state.employee.listTransaction.length == 0) {
        return []
      }
      const n = state.employee.listTransaction.length
      const result = []
      for (let i=0;i<n;i++) {
          result.push(state.employee.listTransaction[i])
          result[i].transaction_amount = formatMoney(result[i].transaction_amount)
          result[i].entry_time = getDateFromTimeStamp(result[i].entry_time)
      }
      return result
    }
}

export default getters