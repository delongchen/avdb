import router from "./route";
import { getGoodAvsJSON, getDirtyAvsJSON } from '../VideoFileService/vidoes'
import { parsePostData, saveCover } from './util'
import { insertOneAv } from '../../data/MySql'
import type { AvDesc, DirtyAvDesc } from '../../types/AvDesc'
import { dirtyAvs } from '../VideoFileService/vidoes'
import avConfig from '../../config'
import { rm } from 'fs/promises'

const { workDir, avDir, videoDir, coverDir } = avConfig
const avPath = workDir + avDir
const videoPath = avPath + videoDir + '/'

router.get("/gavs", context => {
  context.set("content-type", "application/json")
  context.body = getGoodAvsJSON()
}).get("/davs", context => {
  context.set("content-type", "application/json")
  context.body = getDirtyAvsJSON()
}).post('/gavs', async context => {
  context.set("content-type", "application/json")
  const data = await parsePostData<AvDesc>(context)
  const {id, performers, cover, hash} = data
  const exist = dirtyAvs.get(hash) as DirtyAvDesc
  const result = { status: 'err' }
  if (exist) {
    const toInsert: AvDesc = { ...exist, id, performers, cover }
    toInsert.isDirty = false
    dirtyAvs.set(hash, toInsert)

    await saveCover(toInsert)
    await insertOneAv(toInsert)
    result.status = 'ok'
  }
  context.body = result
}).post('/del', async context => {
  const data = await parsePostData<AvDesc>(context)
  const { hash } = data
  const exist = dirtyAvs.get(hash) as DirtyAvDesc
  if (exist) {
    await rm(videoPath + exist.video, { force: true })
    context.body = { status: 'ok' }
  } else context.body = { status: 'err' }
})
