const yaml = require('js-yaml')
import { opendir, readFile } from 'fs/promises'
import avConfig from '../config'
import type { AvDesc } from '../types/AvDesc'
import myAll from "../utils/myAll";

function loadOneInfo(path: string, container: AvDesc[]): Promise<void> {
  return new Promise((resolve, reject) => {
    readFile(path, 'utf-8')
      .then(value => {
        const rawInfo = yaml.load(value) as AvDesc
        container.push(rawInfo)
        resolve()
      })
  })
}

async function loadInfos(): Promise<AvDesc[]> {
  const { workDir, avDir, infoDir } = avConfig
  const infoDirPath = workDir + avDir + infoDir

  const infos: AvDesc[] = []
  const infoNames: string[] = []

  const dir = await opendir(infoDirPath)

  for await (const dirent of dir) {
    const direntName = dirent.name

    if (dirent.isFile() && direntName.endsWith('.yml')) {
      infoNames.push(direntName)
    }
  }

  const ps = infoNames.map(name => loadOneInfo(`${infoDirPath}/${name}`, infos))
  await myAll(ps)

  return infos
}

export default loadInfos
