/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-unused-vars
export type ListenerType = (...args: any[]) => void;

class Event {
  private listeners: ListenerType[];

  constructor() {
    this.listeners = [];
  }

  public register(listener: ListenerType): void {
    this.listeners.push(listener);
  }

  public unRegister(listener: ListenerType): void {
    const index = this.listeners.indexOf(listener);
    if (index === -1) {
      return;
    }
    // TODO: replace by splice function
    const rest = this.listeners.slice(index + 1);
    this.listeners.length = index;
    this.listeners.push(...rest);
  }

  public dispatch(...args: any[]): void {
    this.listeners.forEach(
      (callback) => {
        callback(...args);
      },
    );
  }
}

export default Event;
