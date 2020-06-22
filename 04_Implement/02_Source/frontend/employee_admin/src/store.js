import Vue from 'vue'
import Vuex from 'vuex'
import {logIn} from "@/api/auth.js"
Vue.use(Vuex)


const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  }
}

const actions = {
  login({ctx},payload) {
    return new Promise((resolve,reject) => {
      logIn(payload.data).then(response => {
        console.log("Response login: " + response)
        resolve(response)
      }).catch(err => reject(err))
    })
  }
}


export default new Vuex.Store({
  state,
  mutations,
  actions
})