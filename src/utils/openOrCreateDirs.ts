import { opendir, mkdir } from 'fs/promises'
import myAll from "./myAll";

function openOrCreateDir(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    opendir(path)
      .then(dir => {
        console.log(`dir ${path} exists`)
        dir.close().then(resolve)
      })
      .catch(err => {
        if (err.code === 'ENOENT') {
          console.log(`dir ${path} not exists opening create`)
          mkdir(path).then(() => {
            console.log(`dir ${path} created`)
            resolve()
          })
        } else reject()
      })
  })
}

async function openOrCreateDirs(paths: string[]): Promise<void> {
  if (!paths.length) return
  const ps = paths.map(openOrCreateDir)
  await myAll(ps)
}

export default openOrCreateDirs
