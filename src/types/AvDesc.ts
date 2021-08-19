interface DirtyAvDesc {
  video: string,
  hash: string,
  createTime: number,
  isDirty: boolean,
  size: number
}

interface AvDesc extends DirtyAvDesc{
  id: string,
  performers: string[] | string,
  cover: string,
}


export type {
  AvDesc,
  DirtyAvDesc
}
