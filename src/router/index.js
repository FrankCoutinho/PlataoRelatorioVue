import Vue from 'vue'
import Router from 'vue-router'
import Report from '@/components/Report'
import InputForm from '@/components/InputForm'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'InputForm',
      component: InputForm
    },
    {
      path: '/report',
      name: 'Report',
      component: Report
    }
  ]
})
