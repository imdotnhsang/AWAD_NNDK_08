
import {getCustomer} from "@/api/employee.js"


const state = {
    listCustomer: []
}

const mutations = {
    SET_LIST_CUSTOMER(state,data) {
      state.listCustomer = data
    }
}

const actions = {
    getAllCustomer(ctx,payload) {
      return new Promise((resolve,reject) => {
        getCustomer(payload).then(response => {
          if (response && !response.error) {
            ctx.commit('SET_LIST_CUSTOMER',response.data.data)
          } else {
            ctx.commit('SET_LIST_CUSTOMER',[])
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
