import type { MysqlConfig } from './MysqlConfig'

interface AvConfig {
  workDir: string,
  avDir:string,
  videoDir: string,
  coverDir: string,
  mysql: MysqlConfig,
  http: number
}

export type {
  AvConfig
}
