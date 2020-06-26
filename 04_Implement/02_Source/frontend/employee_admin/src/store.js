import Vue from 'vue'
import Vuex from 'vuex'
import {logIn,logOut} from "@/api/auth.js"
import {getCustomer} from "@/api/employee.js"
Vue.use(Vuex)


const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  isLoadingRedirect: false,
  listCustomer: []
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
  },
  LOGIN(state,data) {
    window.localStorage.setItem('wnc_access_token',data['access_token'])
    window.localStorage.setItem('wnc_refresh_token',data['refresh_token'])
    document.cookie = `access_token=${window.localStorage.getItem("wnc_access_token")};refresh_token=${window.localStorage.getItem("wnc_refresh_token")}`;
   // document.cookie = `access_token=${window.localStorage.getItem("wnc_access_token")}`;
  },
  LOADING_REDIRECT(state, {isLoadingRedirect, time}) {
    if (isLoadingRedirect) {
        state.isLoadingRedirect = true;
        if (time > 0) {
            setTimeout(() => {
                state.isLoadingRedirect = false;
            },time)
        }
    } else {
        if (time > 0) {
            setTimeout(() => {
                state.isLoadingRedirect = false;
            },time)
        } else {
            state.isLoadingRedirect = false;
        }
    }
  },
  SET_LIST_CUSTOMER(state,data) {
    state.listCustomer = data
  }
}

const actions = {
  login(ctx,payload) {
    return new Promise((resolve,reject) => {
      logIn(payload.data).then(response => {
        if (response && !response.error) {
          let data = {
            access_token: response.data.data['access-token'],
            refresh_token: response.data.data['refresh-token']
          }
          ctx.commit('LOGIN',data)
        } else {
          let data = {
            access_token: '',
            refresh_token: ''
          }
          ctx.commit('LOGIN',data)
        }
        resolve(response)
      }).catch(err => reject(err))
    })
  },
  logout(ctx) {
    return new Promise((resolve,reject) => {
      logOut().then(response => {
        if (response && !response.error) {
          let data = {
            access_token: '',
            refresh_token: ''
          }
          ctx.commit('LOGIN',data)
        } else {

        }
        resolve(response)
      })
    })
  },
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


export default new Vuex.Store({
  state,
  mutations,
  actions
})