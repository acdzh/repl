declare class REPLEngineType {
  constructor(...args: any[]);
}

declare global {
  interface self {
    REPLEngine: REPLEngineType
  }
  interface Window {
    REPLEngine: REPLEngineType
  }
}
