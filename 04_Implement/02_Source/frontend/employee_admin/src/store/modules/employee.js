
import {
  getCustomer,
  getCustomerWithBalance,
  rechargeMoney,
  getTransactionHistory
} from "@/api/employee.js"

import {checkIsExpired} from "@/utils/check.js"
import store from "@/store"

const state = {
    listCustomer: [],
    customerDetail: null,
    listReceiveTransaction: [],
    listTransferTransaction: [],
    listDebtTransaction: []
}

const mutations = {
    SET_LIST_CUSTOMER(state,data) {
      state.listCustomer = data
    },
    SET_CUSTOMER_DETAIL(state, data) {
      state.customerDetail = data
    },
    SET_EXPIRED(state,data) {
      store.commit('SET_EXPIRED',data)
    },
    SET_LIST_RECEIVE_TRANSACTION(state,data) {
      state.listReceiveTransaction = data
    },
    SET_LIST_TRANSFER_TRANSACTION(state,data) {
      state.listTransferTransaction = data
    },
    SET_LIST_DEBT_TRANSACTION(state,data) {
      state.listDebtTransaction = data
    }
}

const actions = {
    getAllCustomer(ctx,payload) {
      return new Promise((resolve,reject) => {
        getCustomer(payload).then(response => {
          if (response && !response.error) {
            if (!payload.noCommitState) {
              ctx.commit('SET_LIST_CUSTOMER',response.data.data)
            }
          } else {
            if (checkIsExpired(response)) {
              ctx.commit('SET_LIST_CUSTOMER',[])
              ctx.commit('SET_EXPIRED',true)
              resolve(response)
              return
            } else {
              if (!payload.noCommitState) {
                ctx.commit('SET_LIST_CUSTOMER',[])
              }
            }
          }
          resolve(response)
        }).catch(err => reject(err))
      })
    },
    getCustomerWithBalance(ctx, payload) {
      return new Promise((resolve, reject) => {
        getCustomerWithBalance(payload).then(response => {
          if (response && !response.error) {
            ctx.commit('SET_CUSTOMER_DETAIL', response.data.data[0])
          } else {
             if (checkIsExpired(response)) {
                ctx.commit('SET_EXPIRED',true)
            //    ctx.commit('SET_CUSTOMER_DETAIL',null)
                resolve(response)
                return
             } else {
              ctx.commit('SET_CUSTOMER_DETAIL',null)
             }
          }
          resolve(response)
        }).catch(err => reject(err))
      })
    },
    rechargeMoney(ctx, payload) {
      return new Promise((resolve, reject) => {
        rechargeMoney(payload).then(response => {
          if (response && !response.error) {

          } else {
            if (checkIsExpired(response)) {
              ctx.commit('SET_EXPIRED',true)
              resolve(response)
              return
            }
          }
          resolve(response)
        }).catch(err => reject(err))
      })
    },
    getTransactionHistory(ctx,payload) {
      return new Promise((resolve,reject) => {
        if (payload.type == 'receive') {
          ctx.commit('SET_LIST_RECEIVE_TRANSACTION',[])
        } else if (payload.type == 'transfer') {
          ctx.commit('SET_LIST_TRANSFER_TRANSACTION',[])
        } else {
          ctx.commit('SET_LIST_DEBT_TRANSACTION',[])
        }
        getTransactionHistory(payload).then(response => {
          if (response && !response.error) {
            if (payload.type == 'receive') {
              ctx.commit('SET_LIST_RECEIVE_TRANSACTION',response.data.data)
            } else if (payload.type == 'transfer') {
              ctx.commit('SET_LIST_TRANSFER_TRANSACTION',response.data.data)
            } else {
              ctx.commit('SET_LIST_DEBT_TRANSACTION',response.data.data)
            }
          } else {
            if (checkIsExpired(response)) {
              ctx.commit('SET_EXPIRED',true)
              resolve(response)
              return
            }else {
             // ctx.commit('SET_LIST_TRANSACTION',[])
            }
          }
          resolve(response)
        }).catch(err => reject(err))
      })
    }
}
  
  
export default ({
    namespaced: true,
    state,
    mutations,
    actions
})
