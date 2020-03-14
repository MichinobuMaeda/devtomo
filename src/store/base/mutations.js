const bit = name => (name === 'dec') ? 0 : ((name.slice(0, 1) === 'c') ? 8 : ((name.slice(0, 1) === 'w') ? 16 : 32))
const cols = name => bit(name) / (name.slice(-1) === 'h' ? 4 : 1)
const chars = (c, n) => Array.from(Array(n).keys()).map(i => c).join('')
const lpadding = (c, n, str) => (chars(c, n) + str).slice(-n)
const parser = {
  ec: str => parseInt(str),
  sh: str => parseInt(str, 16) - (/[0-7]/.test(str.slice(0, 1)) ? 0 : (parseInt(str.replace(/./g, 'f'), 16)) + 1),
  uh: str => parseInt(str, 16),
  sb: str => parseInt(str, 2) - (str.slice(0, 1) === '0' ? 0 : parseInt(str.replace(/./g, 'f'), 16)),
  ub: str => parseInt(str, 2)
}
export const setValue = (state, { name, str }) => {
  const val = parser[name.slice(-2)](lpadding('0', cols(name), str))
  if (isNaN(val)) {
    return
  }
  const ng = ''
  state.values.dec = val.toString(10)
  state.values.cuh = val < 0 || val > 0xff ? ng : lpadding('0', 2, val.toString(16))
  state.values.cub = val < 0 || val > 0xff ? ng : lpadding('0', 8, val.toString(2))
  state.values.wuh = val < 0 || val > 0xffff ? ng : lpadding('0', 4, val.toString(16))
  state.values.wub = val < 0 || val > 0xffff ? ng : lpadding('0', 16, val.toString(2))
  state.values.duh = val < 0 || val > 0xffffffff ? ng : lpadding('0', 8, val.toString(16))
  state.values.dub = val < 0 || val > 0xffffffff ? ng : lpadding('0', 32, val.toString(2))
  state.values.csh = val < -0x80 || val > 0x7f ? ng : lpadding('0', 2, (val < 0 ? -1 * (val + 0xff + 1) : val).toString(16))
  state.values.csb = val < -0x80 || val > 0x7f ? ng : lpadding('0', 8, (val < 0 ? -1 * (val + 0xff + 1) : val).toString(2))
  state.values.wsh = val < -0x8000 || val > 0x7fff ? ng : lpadding('0', 4, (val < 0 ? -1 * (val + 0xffff + 1) : val).toString(16))
  state.values.wsb = val < -0x8000 || val > 0x7fff ? ng : lpadding('0', 16, (val < 0 ? -1 * (val + 0xffff + 1) : val).toString(2))
  state.values.dsh = val < -0x80000000 || val > 0x7fffffff ? ng : lpadding('0', 8, (val < 0 ? -1 * (val + 0xffffffff + 1) : val).toString(16))
  state.values.dsb = val < -0x80000000 || val > 0x7fffffff ? ng : lpadding('0', 32, (val < 0 ? -1 * (val + 0xffffffff + 1) : val).toString(2))
}
