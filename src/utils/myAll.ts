function myAll(ps: Promise<any>[]) {
  return ps.reduce((pre, cur) => {
    return pre.then(() => cur)
  }, Promise.resolve())
}

export default myAll
