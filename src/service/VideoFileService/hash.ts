import { createHash } from 'crypto'

const hashType = 'sha256'

function getHashOf(name: string) {
  const hash = createHash(hashType)
  hash.update(name)
  return hash.digest("hex")
}

export default getHashOf
