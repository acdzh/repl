export default class Token {
  type: string;

  value: string;

  number: number;

  match: number;

  constructor(type: string, value: string, number: number) {
    this.type = type;
    this.value = value;
    this.number = number;
    this.match = -1;
  }

  public toString(): string {
    return this.value;
  }
}
