import { Context } from 'koa'
import fetch, { FetchError } from 'node-fetch'
import { createWriteStream } from 'fs'
import type { AvDesc } from '../../types/AvDesc'
import avConfig from '../../config'


const { workDir, avDir, coverDir } = avConfig
const avPath = workDir + avDir
const coverPath = avPath + coverDir

function parsePostData<T>(ctx: Context): Promise<T> {
  return new Promise<T>(resolve => {
    let data = ''
    ctx.req.addListener('data', chunk => {
      data += chunk
    })
    ctx.req.addListener('end', () => {
      resolve(JSON.parse(data) as T)
    })
  })
}

function saveCover(av: AvDesc) {
  const { cover, hash } = av
  const saveStream = createWriteStream(`${coverPath}/${hash}.jpg`)

  return fetch(cover).then(res => res.body)
    .then(body => {
      const p = new Promise<void>((resolve, reject) => {
        body.pipe(saveStream)
        body.on('error', reject)
        saveStream.on('finish', resolve)
      })
    }).catch((reason: FetchError) => {
      console.log(reason)
      throw new Error("cover err")
    })
}

export {
  parsePostData,
  saveCover
}
