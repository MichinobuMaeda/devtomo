export const fullName = state => name => (name.slice(0, 1) === 'c'
  ? '8' : (name.slice(0, 1) === 'w'
    ? '16' : (name.slice(0, 1) === 'd'
      ? '32' : '64'))
) + '-bit ' + (name.slice(1, 2) === 's'
  ? ' Signed' : ' Unsigned'
) + (name.slice(2, 3) === 'h'
  ? ' Hex'
  : ' Bin'
)
export const maxLenght = state => name => (name.slice(0, 1) === 'c'
  ? 2 : (name.slice(0, 1) === 'w'
    ? 4 : (name.slice(0, 1) === 'd'
      ? 8 : 16))
) * (name.slice(2, 3) === 'h'
  ? 1 : 4
)
// https://www.unicode.org/charts/PDF/U0000.pdf
// https://www.unicode.org/charts/PDF/U0080.pdf
const unreadables = [
  'NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', 'ACK', 'BEL', 'BS', 'TAB', 'LF', 'VT', 'FF', 'CR', 'SO', 'SI',
  'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', 'CAN', 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US',
  'SP', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '<', '=', '>', '?',
  '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '[', '\\', ']', '^', '_',
  '`', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
  'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '{', '|', '}', '`', 'DEL',
  'XXX', 'XXX', 'BPH', 'NBH', 'IND', 'NEL', 'SSA', 'ESA', 'HTS', 'HTJ', 'VTS', 'PLD', 'PLU', 'RI', 'SS2', 'SS3',
  'DCS', 'PU1', 'PU2', 'STS', 'CCH', 'MW', 'SPA', 'EPA', 'SOS', 'XXX', 'SCI', 'CSI', 'ST', 'OSC', 'PM', 'APC',
  'NBSP', '¡', '¢', '£', '¤', '¥', '¦', '§', '¨', '©', 'ª', '«', '¬', 'SHY', '®', '¯'
]
export const unicode = state => c => (c >= 0 && c < 0x00b0) ? unreadables[c] : String.fromCharCode(c)
