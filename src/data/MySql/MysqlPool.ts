import { createPool, PoolConnection, MysqlError } from 'mysql'
import avConfig from "../../config";

const pool = createPool({
  connectionLimit: 4,
  ...(avConfig.mysql)
})

const noErr = (fn:any, err?: MysqlError | null) => {
  if (err) {
    fn(err)
    return false
  } else return true
}

const endPool = () => new Promise<void>((resolve, reject) => {
  pool.end(err => {
    if (noErr(reject, err)) {
      console.log('pool end')
      resolve()
    }
  })
})

function getSqlConn() {
  return new Promise<PoolConnection>((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (noErr(reject, err)) {
        resolve(connection)
      }
    })
  })
}

function quickQuery(query: string, v?: any) {
  return new Promise<any>((resolve, reject) => {
    pool.query(query, v, (err, results) => {
      if (noErr(reject, err)) {
        resolve(results)
      }
    })
  })
}

export {
  getSqlConn,
  quickQuery,
  endPool
}
