// Every token is an instruction. Could be:
// Data item: @type = "data"
// (String/Number) @value
// Emoticon: @type = "emoticon"
// (Char) @mouth: The rightmost char end of the token.
// (Char) @nose: The middle char of the token (if any).
// (String) @face: The left side of the emoticon.
// (String) @value: the original token.

export default class Instruction {
  value: string;

  type: string;

  mouth?: string | null;

  nose?: string | null;

  face?: string | null;

  constructor(value: string, type: string) {
    this.value = value;
    this.type = type;

    if (this.type === 'emoticon') {
      const emoticon = this.value.split('');
      this.mouth = emoticon.pop();
      this.nose = emoticon.pop();
      this.face = emoticon.join('');
      if (this.face === '') {
        this.face = this.nose;
        this.nose = null;
      }
    }
  }

  toString(): string {
    return this.value;
  }
}
