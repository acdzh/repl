export default class RuntimeError extends Error {
  message: string;

  name: string;

  constructor(message: string) {
    super();
    this.message = message;
    this.name = 'RuntimeError';
  }
}
