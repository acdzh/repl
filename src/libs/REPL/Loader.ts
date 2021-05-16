import { SANDBOX_HTML_SRC } from './const';

export default class Loader {
  public head: HTMLHeadElement;

  public body: HTMLBodyElement;

  public iframe: HTMLIFrameElement | null;

  constructor() {
    // eslint-disable-next-line prefer-destructuring
    this.head = document.getElementsByTagName('head')[0];
    // eslint-disable-next-line prefer-destructuring
    this.body = document.getElementsByTagName('body')[0];
    this.iframe = null;
  }

  public createSandbox(
    // eslint-disable-next-line no-unused-vars
    callback: (arg0?: Window | null) => void,
  ): void {
    if (this.iframe) {
      this.body.removeChild(this.iframe);
    }
    this.iframe = document.createElement('iframe');
    this.iframe.src = SANDBOX_HTML_SRC;
    this.iframe.style.display = 'none';
    this.iframe.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      callback(this.iframe!.contentWindow);
    };
    this.body.appendChild(this.iframe);
  }
}
