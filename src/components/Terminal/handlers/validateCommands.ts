import commandExists from '../utils/commandExists';
import { CommandsType } from '../types/command';

const validateCommands = (
  commands: CommandsType | undefined,
  helpFn: () => void,
  clearFn: () => void,
  options: {
    noDefaults: boolean;
    ignoreCommandCase: boolean;
  },
): CommandsType => {
  const defaultCommands = {
    help: {
      description: 'Show a list of available commands.',
      fn: helpFn,
    },
    clear: {
      description: 'Empty the terminal window.',
      explicitExec: true,
      fn: clearFn,
    },
  };

  if (!commands) {
    return defaultCommands;
  }

  let validCommands: CommandsType;

  // Pre-register defaults
  if (!options.noDefaults) {
    validCommands = { ...defaultCommands };
  } else {
    validCommands = {};
  }

  Object.keys(commands).forEach((c) => {
    // If matching commands case-insensitively
    // ensure that command names are clean to avoid regex DoS
    // JS prop names don't allow weird characters unless quoted
    // but this is just a safety feature
    if (options.ignoreCommandCase && /[^a-zA-Z0-9-_]/gi.test(c)) {
      throw new Error(`Command name '${c}' is invalid; command names can only contain latin characters (A-Z), numbers (0-9) and dashes/underscores (- or _)`);
    }

    const exists = commandExists(validCommands, c, options.ignoreCommandCase);

    // Check that command does not already exist
    if (exists) {
      throw new Error(`Attempting to override existing command '${c}'; please only supply one definition of a certain command, or set the noDefaults property to enable overriding of existing commands`);
    }

    // Check that command contains a function
    if (typeof commands[c].fn !== 'function') {
      throw new Error(`'fn' property of command '${c}' is invalid; expected 'function', got '${typeof commands[c].fn}'`);
    }

    // Add description if missing
    if (!commands[c].description) {
      // eslint-disable-next-line no-param-reassign
      commands[c].description = 'None';
    }

    // Pass validation
    validCommands[c] = commands[c];
  });

  return validCommands;
};

export default validateCommands;
