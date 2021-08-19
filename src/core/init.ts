import avConfig from '../config'
import openOrCreateDirs from '../utils/openOrCreateDirs'
import { initCleanUp } from './cleanApp'
import initFileWatcher from './FileWatcher'
import { initVideoService } from '../service/VideoFileService'
import { startKoa } from '../service/Koa'

async function init(): Promise<void> {
  initCleanUp()

  const { workDir, avDir, coverDir, videoDir } = avConfig
  const av = workDir + avDir
  const videoPath = av + videoDir

  await openOrCreateDirs([av])
  await openOrCreateDirs([
    av + coverDir,
    videoPath
  ])

  await initVideoService()
  initFileWatcher(videoPath).then(() => console.log("watch finished"))
  await startKoa()
}

export default init
