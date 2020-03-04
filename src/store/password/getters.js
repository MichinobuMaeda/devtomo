const standard64Chars = '!#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const larger88Chars = '!"#$%&\'()*+,-./23456789:;<=>?@ABCDEFGHJKLMNOPRSTUVWXYZ[\\]^_abcdefghijkmnopqrstuvwxyz{|}~'
const allReadableChars = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
const baseChars = {
  std64set: standard64Chars,
  lgr88set: larger88Chars,
  manualConf: allReadableChars
}
export const activeChars = state => allReadableChars.split('').map(c => ({
  use: (baseChars[state.params.base] || '').includes(c) &&
    (
      (state.params.base !== 'manualConf') ||
      (
        (state.params.useNum || /[^0-9]/.test(c)) &&
        (state.params.useUpr || /[^A-Z]/.test(c)) &&
        (state.params.useLwr || /[^a-z]/.test(c)) &&
        (state.params.useSym || /[0-9A-Za-z]/.test(c)) &&
        (!state.params.avoidSimilarChars || !state.params.similarChars.includes(c))
      )
    ),
  c
}))
