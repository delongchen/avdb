type CleanUpHook = () => void

const cleanUpHooks: CleanUpHook[] = []

function initCleanUp() {
  process.stdin.resume();

  process.on('SIGINT', cleanUp)
}

function cleanUp() {
  console.log('exiting')
  for (const hook of cleanUpHooks) {
    hook()
  }
}

export {
  initCleanUp,
  cleanUpHooks,
}
