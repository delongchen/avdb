import { FileChangeInfo, rm } from "fs/promises";
import isFileExist from '../../utils/isFileExist'
import type { AvDesc } from '../../types/AvDesc'
import avConfig from '../../config'
import loadVideos from './loadVideos'
import { dirtyAvs, addDirtyAv } from './vidoes'
import { getAllAvs, delAv, getOneAvByHash } from '../../data/MySql'
import getHashOf from './hash'

const { workDir, avDir, videoDir, coverDir } = avConfig
const avPath = workDir + avDir + videoDir
const coverPath = workDir + avDir + coverDir

async function handleFileChangeEvent(event: FileChangeInfo<string>) {
  const fileName = event.filename
  const filePath = `${avPath}/${fileName}`

  const fileExist = await isFileExist(filePath)
  if (fileExist) {
    await addAvFile(fileName)
  } else {
    await delAvFile(fileName)
  }
}

async function initVideoService() {
  await loadVideos()
  const avs = await getAllAvs()
  for (const av of avs) {
    av.isDirty = false
    dirtyAvs.set(av.hash, av)
  }
}

async function addAvFile(name: string) {
  await addDirtyAv(name)
}

async function delAvFile(name: string) {
  const hash = getHashOf(name)
  const av = dirtyAvs.get(hash) as AvDesc

  if (av) {
    dirtyAvs.delete(hash)
    if (!av.isDirty) {
      await rm(coverPath + av.cover, { force: true })
      await delAv(hash)
    }
  }
}

export {
  handleFileChangeEvent,
  initVideoService
}
