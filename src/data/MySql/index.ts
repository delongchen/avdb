import {endPool, quickQuery} from './MysqlPool'
import type { AvDesc } from '../../types/AvDesc'

async function insertOneAv(av: any) {
  const { performers } = av
  if (typeof performers !== 'string') {
    av.performers = performers.join(',')
  }
  delete av.isDirty
  await quickQuery('insert into avs set ?', av)
}

function getAllAvs() {
  return quickQuery("select * from avs") as Promise<AvDesc[]>
}

function delAv(hash: string) {
  return quickQuery(`delete from avs where hash = "${hash}"`)
}

function getOneAvByHash(hash: string) {
  return quickQuery(`select * from avs where hash = "${hash}"`) as Promise<AvDesc>
}

export {
  insertOneAv,
  getAllAvs,
  delAv,
  getOneAvByHash
}
