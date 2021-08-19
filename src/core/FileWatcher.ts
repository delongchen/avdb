import {FileChangeInfo, watch, open} from 'fs/promises'
import { cleanUpHooks } from '../core/cleanApp'
import { handleFileChangeEvent } from '../service/VideoFileService'

const ac = new AbortController
const { signal } = ac

cleanUpHooks.push(() => {
  ac.abort()
  console.log("watcher aborted")
})

async function initFileWatcher(path: string) {
  const watcher = watch(path, { recursive: false, signal })

  for await (const event of watcher) {
    await handleFileChangeEvent(event)
  }
}

export default initFileWatcher
