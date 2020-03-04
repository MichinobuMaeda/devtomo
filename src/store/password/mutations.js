const maxRepeat = 10000
export const reset = state => {
  state.result = ''
  state.params = {
    length: 8,
    base: 'std64set',
    useNum: true,
    useUpr: true,
    useLwr: true,
    useSym: true,
    useAll: true,
    avoidSimilarChars: true,
    avoidSameChars: true,
    similarChars: 'Il10O8B3Egqvu!|[]{}'
  }
}
export const saveParam = (state, params) => {
  state.params = { ...params }
}
export const generate = (state, activeChars) => {
  state.result = ''
  const length = Number(state.params.length)
  const chars = activeChars.filter(item => item.use).map(item => item.c)
  if ((length >= 4) && chars) {
    for (var i = 0; i < maxRepeat; ++i) {
      const val = Array.from(Array(length).keys()).map(m => {
        const n = Math.floor(Math.random() * chars.length)
        return chars.slice(n, n + 1)
      }).join('')
      if (state.params.useAll) {
        if (state.params.base === 'manualConf') {
          if (state.params.useNum && !(/[0-9]/.test(val))) { continue }
          if (state.params.useUpr && !(/[A-Z]/.test(val))) { continue }
          if (state.params.useLwr && !(/[a-z]/.test(val))) { continue }
          if (state.params.useSym && !(/[^0-9A-Za-z]/.test(val))) { continue }
        } else {
          if (!(/[0-9]/.test(val))) { continue }
          if (!(/[A-Z]/.test(val))) { continue }
          if (!(/[a-z]/.test(val))) { continue }
          if (!(/[^0-9A-Za-z]/.test(val))) { continue }
        }
      }
      if (state.params.avoidSameChars) {
        if (val.split('').some((c, i) => val.slice(i + 1).includes(c))) { continue }
      }
      state.result = val
      break
    }
  }
}
