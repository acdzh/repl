import { ReactNode } from 'react';

export type CommandType = {
  description?: string;
  usage?: string;
  // eslint-disable-next-line no-unused-vars
  fn: (...args: unknown[]) => ReactNode | void;
  explicitExec?: boolean;
};

export type CommandsType = {
  [propType: string]: CommandType;
};

export type CommandResultType = {
  command: string | null;
  args: string[];
  rawInput: string | null;
  result: ReactNode | null;
}
