import avConfig from '../../config'
import { opendir } from 'fs/promises'
import { addDirtyAv } from './vidoes'

async function loadVideos() {
  const { workDir, avDir, videoDir } = avConfig
  const videoPath = workDir + avDir + videoDir
  const dir = await opendir(videoPath)

  for await (const dirent of dir) {
    const name = dirent.name

    if (dirent.isFile()) {
      await addDirtyAv(name)
    }
  }
}

export default loadVideos
