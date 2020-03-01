import Vue from 'vue'
import Vuex from 'vuex'
// import password from './password'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // password
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
})

export default store
