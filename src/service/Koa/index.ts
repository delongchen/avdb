import Koa from 'koa'
const cros = require('@koa/cors')
import router from './route'
import avConfig from '../../config'

import "./avs"

const koa = new Koa

function startKoa(): Promise<void> {
  koa
    .use(cros())
    .use(router.routes())
    .use(router.allowedMethods())

  const { http } = avConfig
  return new Promise(resolve => {
    koa.listen(http, () => {
      console.log(`koa on port: ${http}`)
    })
  })
}

export {
  startKoa
}
