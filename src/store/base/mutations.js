// name.slice(0, 1)
const bitTable = {
  c: 8,
  w: 16,
  d: 32
}
// name.slice(-1)
const baseTable = {
  b: 2,
  c: 10,
  h: 16
}
const bit = name => (name === 'dec') ? 0 : bitTable[name.slice(0, 1)]
const cols = name => bit(name) / (name.slice(-1) === 'h' ? 4 : 1)
const chars = (c, n) => Array.from(Array(n).keys()).map(i => c).join('')
const zeroPadding = (name, str) => (chars('0', cols(name)) + str).slice(cols(name) * -1)
const parser = (name, str) => {
  const val = parseInt(zeroPadding(name, str), baseTable[name.slice(-1)])
  return (name.slice(1, 2) === 's' && val >= Math.pow(2, bit(name)) / 2) ? val - Math.pow(2, bit(name)) : val
}
const inScope = (name, val) => {
  const h = Math.pow(2, bit(name)) / (name.slice(1, 2) === 'u' ? 1 : 2)
  const l = h - Math.pow(2, bit(name))
  return l <= val && val < h
}
const compl = (name, val) => val < 0 ? -1 * (val + Math.pow(2, bit(name))) : val
export const setValue = (state, { name, str }) => {
  const val = parser(name, str)
  if (!isNaN(val)) {
    Object.keys(state.values).forEach(name => {
      if (name === 'dec') {
        state.values[name] = val.toString(10)
      } else {
        state.values[name] = inScope(name, val)
          ? zeroPadding(name, compl(name, val).toString(baseTable[name.slice(-1)]))
          : ''
      }
    })
  }
}
