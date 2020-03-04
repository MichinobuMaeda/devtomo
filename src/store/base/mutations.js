const parser = {
  ec: val => parseInt(val),
  sh: val => parseInt(val, 16) - (/[0-7]/.test(val.slice(0, 1)) ? 0 : (parseInt(val.replace(/./g, 'f'), 16)) + 1),
  uh: val => parseInt(val, 16),
  sb: val => parseInt(val, 2) - (val.slice(0, 1) === '0' ? 0 : parseInt(val.replace(/./g, 'f'), 16)),
  ub: val => parseInt(val, 2)
}
export const setValue = (state, { name, str }) => {
  const val = parser[name.slice(1, 3)](str)
  const ng = 'Overflow'
  state.values.dec = val
  state.values.cuh = val < 0 || parseInt('ff', 16) < val
    ? ng : ('00' + val.toString(16)).slice(-2)
  state.values.cub = val < 0 || parseInt('ff', 16) < val
    ? ng : ('00000000' + val.toString(2)).slice(-8)
  state.values.wuh = val < 0 || parseInt('ffff', 16) < val
    ? ng : ('0000' + val.toString(16)).slice(-4)
  state.values.wub = val < 0 || parseInt('ffff', 16) < val
    ? ng : ('0000000000000000' + val.toString(2)).slice(-16)
  state.values.duh = val < 0 || parseInt('ffffffff', 16) < val
    ? ng : ('00000000' + val.toString(16)).slice(-8)
  state.values.dub = val < 0 || parseInt('ffffffff', 16) < val
    ? ng : ('00000000000000000000000000000000' + val.toString(2)).slice(-32)
  state.values.csh = val < -parseInt('80', 16) || parseInt('7f', 16) < val
    ? ng : ('00' + (
      val < 0
        ? -1 * (val + parseInt('ff', 16) + 1)
        : val
    ).toString(16)).slice(-2)
  state.values.csb = val < -parseInt('80', 16) || parseInt('7f', 16) < val
    ? ng : ('00000000' + (
      val < 0
        ? (val + parseInt('ff', 16) + 1)
        : val
    ).toString(2)).slice(-8)
  state.values.wsh = val < -parseInt('8000', 16) || parseInt('7fff', 16) < val
    ? ng : ('0000' + (
      val < 0
        ? -1 * (val + parseInt('ffff', 16) + 1)
        : val
    ).toString(16)).slice(-4)
  state.values.wsb = val < -parseInt('8000', 16) || parseInt('7fff', 16) < val
    ? ng : ('0000000000000000' + (
      val < 0
        ? -1 * (val + parseInt('ffff', 16) + 1)
        : val
    ).toString(2)).slice(-16)
  state.values.dsh = val < -parseInt('80000000', 16) || parseInt('7fffffff', 16) < val
    ? ng : ('00000000' + (
      val < 0
        ? -1 * (val + parseInt('ffffffff', 16) + 1)
        : val
    ).toString(16)).slice(-8)
  state.values.dsb = val < -parseInt('80000000', 16) || parseInt('7fffffff', 16) < val
    ? ng : ('00000000000000000000000000000000' + (
      val < 0
        ? -1 * (val + parseInt('ffffffff', 16) + 1)
        : val
    ).toString(2)).slice(-32)
}
