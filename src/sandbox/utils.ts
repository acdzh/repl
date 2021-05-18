/* eslint-disable no-bitwise */
// eslint-disable-next-line no-unused-vars
export type AnyFunctionType = (...args: any[]) => any;

export const makeUtf8Print = (print: (arg0: string) => void): ((argo: string) => void) => {
  const buffer: number[] = [];
  return (_chr: string) => {
    if (!_chr && _chr !== 0) {
      return;
    }
    const chr = _chr as unknown as number < 0
      ? (_chr as unknown as number) + 256
      : _chr as unknown as number;
    switch (buffer.length) {
      case 0:
        if (chr < 128) {
          print(String.fromCharCode(chr));
        } else {
          buffer.push(chr);
        }
        break;
      case 1: {
        if (buffer[0] > 191 && buffer[0] < 224) {
          const uni = ((buffer[0] & 31) << 6) | (chr & 63);
          print(String.fromCharCode(uni));
          buffer.length = 0;
        } else {
          buffer.push(chr);
        }
        break;
      }
      case 2:
      {
        const uni = ((buffer[0] & 15) << 12) | ((buffer[1] & 63) << 6) | (chr & 63);
        print(String.fromCharCode(uni));
        buffer.length = 0;
        break;
      }
      default: //
    }
  };
};

export const encodeUtf8 = (str: string): string => {
  const utftext: string[] = [];
  str.split('').forEach((_c) => {
    const c = _c.charCodeAt(0);
    if (c < 128) {
      utftext.push(String.fromCharCode(c));
    } else if (c > 127 && c < 2048) {
      utftext.push(String.fromCharCode((c >> 6) | 192));
      utftext.push(String.fromCharCode((c & 63) | 128));
    } else {
      utftext.push(String.fromCharCode((c >> 12) | 224));
      utftext.push(String.fromCharCode(((c >> 6) & 63) | 128));
      utftext.push(String.fromCharCode((c & 63) | 128));
    }
  });
  return utftext.join('');
};
