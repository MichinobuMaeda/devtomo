export const initialize = state => {
  state.result = ''
  state.params = {
    length: 8,
    base: 'std64set',
    useNum: true,
    useUpr: true,
    useLwr: true,
    useSym: true,
    avoidSimilarChars: false,
    similarChars: 'Il10O8B3Egqvu!|[]{}'
  }
}
export const update = (state, params) => {
  state.params = { ...params }
}
