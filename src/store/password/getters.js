const baseChars = {
  std64set: '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  lgr88set: '!"#$%&\'()*+,-./23456789:;<=>?@ABCDEFGHJKLMNOPRSTUVWXYZ[\\]^_abcdefghijkmnopqrstuvwxyz{|}~',
  all94set: '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
}
export const minLength = () => 4
export const params = state => ({ ...state.params })
export const useChars = state => {
  return baseChars.all94set.split('').map(c => ({
    use: (baseChars[state.params.base] || '').includes(c) &&
      (state.params.useNum || /[^0-9]/.test(c)) &&
      (state.params.useUpr || /[^A-Z]/.test(c)) &&
      (state.params.useLwr || /[^a-z]/.test(c)) &&
      (state.params.useSym || /[0-9A-Za-z]/.test(c)) &&
      (!state.params.avoidSimilarChars || !state.params.similarChars.includes(c)),
    c
  }))
}
