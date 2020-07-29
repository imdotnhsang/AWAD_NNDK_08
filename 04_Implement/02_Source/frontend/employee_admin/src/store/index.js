import Vue from 'vue'
import Vuex from 'vuex'
import {logIn,logOut} from "@/api/auth.js"
import router from "@/router"
import getters from './getters'
Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
}, {})


const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  isLoadingRedirect: false,
  expired: true,
  userInfo: []
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
    window.localStorage.setItem('fullName',data.fullName)
    window.localStorage.setItem('position',data.position)
    document.cookie = `access_token=${window.localStorage.getItem("wnc_access_token")};refresh_token=${window.localStorage.getItem("wnc_refresh_token")}`;
    state.userInfo.fullName = data.fullName
    state.userInfo.position = data.position
   // document.cookie = `access_token=${window.localStorage.getItem("wnc_access_token")}`;
   if (window.localStorage.getItem('wnc_access_token') != '') {
     state.expired = false
   }
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
  SET_EXPIRED(state,data) {
    state.expired = data
    if (state.expired == true) {
      window.localStorage.setItem('wnc_access_token','')
      window.localStorage.setItem('wnc_refresh_token','')
      router.push("/login")
    }
  }
}

const actions = {
  login(ctx,payload) {
    return new Promise((resolve,reject) => {
      logIn(payload.data).then(response => {
        if (response && !response.error) {
          let data = {
            access_token: response.data.data['access-token'],
            refresh_token: response.data.data['refresh-token'],
            fullName: response.data.data.full_name,
            position: response.data.data.position
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
  }
}


export default new Vuex.Store({
  state,
  modules,
  mutations,
  actions,
  getters
})