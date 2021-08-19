import {open} from "fs/promises";

function isFileExist(path: string) {
  return new Promise<boolean>(resolve => {
    open(path, 'r').then(file => {
      file.close().then(() => resolve(true))
    }).catch(() => resolve(false))
  })
}

export default isFileExist
