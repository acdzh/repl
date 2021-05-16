import { CommandsType } from '../types/command';

export default (
  commands: CommandsType,
  commandName: string,
  matchCaseInsensitive: boolean,
): boolean => {
  if (matchCaseInsensitive) {
    if (Object.keys(commands).some((command) => new RegExp(`^${commandName}$`, 'gi').test(command))) {
      return true;
    }

    // Command not found
    return false;
  }
  return commandName in commands;
};
