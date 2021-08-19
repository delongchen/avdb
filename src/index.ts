import init from './core/init'

async function boot() {
  await init()
}

boot().then(() => console.log('booted'))
