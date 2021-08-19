import type { AvDesc, DirtyAvDesc } from '../../types/AvDesc'
import { promises } from "fs";
import avConfig from "../../config";
import getHashOf from './hash'
const { stat } = promises

const dirtyAvsRaw: Map<string, (DirtyAvDesc | AvDesc)> = new Map<string, (DirtyAvDesc | AvDesc)>()

const updateAction = new Set(['set', 'delete', 'clear'])
const bindFns: any = {}
for (const f of ["get", "has", ...updateAction]) {
  bindFns[f] = Reflect.get(dirtyAvsRaw, f).bind(dirtyAvsRaw)
}

let updated = false

const dirtyAvs = new Proxy(dirtyAvsRaw, {
  get(target: Map<string, (DirtyAvDesc | AvDesc)>, p: string | symbol, receiver: any): any {
    if (typeof p === "string" && updateAction.has(p)) {
      updated = true
    }
    return bindFns[p]
  }
})

let dirtyAvsCache: Buffer = Buffer.from('[]')
let goodAvsCache: Buffer = Buffer.from('[]')

function freshCache() {
  if (updated) {
    const good: AvDesc[] = []
    const dirty: DirtyAvDesc[] = []

    for (const [k, v] of dirtyAvsRaw) {
      if (v.isDirty) {
        dirty.push(v)
      } else {
        good.push(v as AvDesc)
      }
    }

    dirtyAvsCache = Buffer.from(JSON.stringify(dirty))
    goodAvsCache = Buffer.from(JSON.stringify(good))
  }
}

function getDirtyAvsJSON() {
  freshCache()
  return dirtyAvsCache
}

function getGoodAvsJSON() {
  freshCache()
  return goodAvsCache
}

const { workDir, avDir, videoDir } = avConfig
const videoPath = workDir + avDir + videoDir
const allowFileFix = new Set<string>(['mp4', 'mkv', 'avi'])

function checkVideoName(name: string) {
  const fileName = name.split('.')
  return (fileName.length === 2 && allowFileFix.has(fileName[1]))
}

async function addDirtyAv(name: string) {
  if (!checkVideoName(name)) return

  const hash = getHashOf(name)
  const fileStat = await stat(`${videoPath}/${name}`)
  const { birthtimeMs, size } = fileStat

  const davDesc: DirtyAvDesc = {
    video: name,
    hash,
    createTime: birthtimeMs,
    isDirty: true,
    size
  }

  dirtyAvs.set(hash, davDesc)
}

export {
  dirtyAvs,
  getDirtyAvsJSON,
  getGoodAvsJSON,
  addDirtyAv
}
