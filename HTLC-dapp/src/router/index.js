import Vue from 'vue'
import Router from 'vue-router'
import HTLCDapp from '@/components/HTLC-dapp'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: 'vue-dapp-demo/',
  routes: [{
    path: '/',
    name: 'HTLCDapp',
    component: HTLCDapp
  }]
})
