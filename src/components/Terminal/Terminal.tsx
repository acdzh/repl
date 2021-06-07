/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

// Components
import Event from '@libs/Event';
import useEvent from '@hooks/useEvent';
import useRenderController from '@hooks/useRenderController';
import clsx from 'clsx';
import TerminalMessage from './TerminalMessage';
import { CommandsType, CommandResultType } from './types/command';

// Handlers
import handleValidateCommands from './handlers/validateCommands';
import handleScrollHistory from './handlers/scrollHistory';
import handleParseEOL from './handlers/parseEOL';

// Utils
import commandExists from './utils/commandExists';
import TerminalEcho from './TerminalEcho';

import './styles/terminal.scss';

type MatchingType = {
  couples: string[][];
  singles: string[];
};

const needEndWrap = (str: string, matchings: MatchingType) : {
  shouldWrap: boolean;
  leftSybolCount: number;
} => {
  const c = {} as {
    [propType: string]: number;
  };
  matchings.couples.forEach((couple) => {
    c[couple[0]] = 0;
    c[couple[1]] = 0;
  });
  matchings.singles.forEach((single) => {
    c[single] = 0;
  });
  for (let i = 0; i < str.length; i += 1) {
    if (c[str[i]] || c[str[i]] === 0) {
      c[str[i]] += 1;
    }
  }
  return {
    shouldWrap:
      matchings.couples.some((couple) => c[couple[0]] !== c[couple[1]])
      || matchings.singles.some((single) => c[single] % 2 === 1),
    leftSybolCount:
    matchings.couples.reduce((pre, curCouple) => pre + c[curCouple[0]] - c[curCouple[1]], 0),
  };
};

type TerminalPropsType = {
  loading?: boolean;
  theme?: 'dark' | 'light';
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  inputAreaStyle?: React.CSSProperties;
  promptLabelStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputTextStyle?: React.CSSProperties;

  className?: string;
  contentClassName?: string;
  inputAreaClassName?: string;
  promptLabelClassName?: string;
  inputClassName?: string;
  inputTextClassName?: string;

  autoFocus?: boolean;
  isDangerMode?: boolean;
  // (undefined signifies default behaviour)
  // Not offering individual options for message styling as messages only have
  // one uniform style for the entire element per the spec
  styleEchoBack?:
    // Only persist label style
    'labelOnly'
    // Only persist text style
    | 'textOnly'
    // Inherit entire prompt style
    | 'fullInherit'
    // Inherit message style
    | 'messageInherit';
  locked?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  disableOnProcess?: boolean;
  hidePromptWhenDisabled?: boolean;
  ignoreCommandCase?: boolean;
  noDefaults?: boolean;
  noEchoBack?: boolean;
  noHistory?: boolean;
  noAutoScroll?: boolean;
  noNewlineParsing?: boolean;

  welcomeMessage?: boolean| string[] | string;
  promptLabel?: React.ReactNode;
  promptWrapLabel?: React.ReactNode;
  errorText?: string;
  defaultPromptValue?: string;

  matchings?: MatchingType;
  commands?: CommandsType;
  // eslint-disable-next-line no-unused-vars
  commandCallback?: (arg0: CommandResultType) => unknown;
  // eslint-disable-next-line no-unused-vars
  outerCommander?: (arg0: string) => React.ReactNode | void;

  messageStyle?: React.CSSProperties;
  messageClassName?: string;

  updateEvent?: Event;
};

type MessageLineType = {
  message: React.ReactNode;
  isEcho: boolean;
};

const Terminal: React.FC<TerminalPropsType> = ({
  loading = false,

  theme = 'dark',
  style,
  contentStyle,
  inputAreaStyle,
  promptLabelStyle,
  inputStyle,

  className,
  contentClassName,
  inputAreaClassName,
  promptLabelClassName,
  inputClassName,

  autoFocus = false,
  isDangerMode = false,
  locked = false,
  readOnly = false,
  disabled = false,
  disableOnProcess = false,
  hidePromptWhenDisabled = false,
  ignoreCommandCase = false,
  noDefaults = false,
  noEchoBack = false,
  noHistory = false,
  noAutoScroll = false,
  noNewlineParsing = false,

  welcomeMessage = false,
  promptLabel = '$',
  promptWrapLabel = '...',
  errorText,
  defaultPromptValue = '',

  matchings = {
    couples: [['(', ')'], ['{', '}'], ['[', ']']],
    singles: ['\'', '"'],
  },
  commands,
  commandCallback,
  outerCommander = () => <span className="terminal-token-error">error</span>,

  messageStyle,
  messageClassName,

  updateEvent,
}) => {
  const [_commands, setCommands] = useState<CommandsType>({});
  const [stdout, setStdout] = useState<MessageLineType[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyPosition, setHistoryPosition] = useState<number | null>(null);
  const [previousHistoryPosition, setPreviousHistoryPosition] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [isWrap, setIsWrap] = useState(false);
  const [lastPromptPart, setLastPromptPart] = useState('');
  const terminalRootRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const { flag, reRender } = useRenderController();

  const pushToHistory = (rawInput: string) => {
    setHistory([...history, rawInput]);
    setHistoryPosition(null);
  };

  const pushToStdout = (message: React.ReactNode, options?: {
    rawInput: string;
    isEcho: boolean;
  }) => {
    if (locked) stdout.pop();
    stdout.push({ message, isEcho: options?.isEcho || false });
    if (options?.rawInput) pushToHistory(options?.rawInput);
    setStdout(stdout);
  };

  const getStdout = () => (noNewlineParsing ? stdout : handleParseEOL(stdout)).map((line, i) => (
    <TerminalMessage
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      content={line.message}
      isDangerMode={isDangerMode}
      className={!line.isEcho ? messageClassName : undefined}
      style={!line.isEcho ? messageStyle : undefined}
    />
  ));

  // const getPromptStdOut = () => ()

  const clearStdout = () => {
    setStdout([]);
  };

  const clearInput = () => {
    setHistoryPosition(null);
    if (terminalInputRef.current) {
      terminalInputRef.current.value = '';
    }
  };

  const focusTerminal = useCallback(() => {
    // Only focus the terminal if text isn't being copied
    // Only focus if input is there (Goes away for read-only terminals)
    if (!loading && !(window.getSelection()?.type === 'Range') && terminalInputRef.current) {
      terminalInputRef.current.focus();
    }
  }, [terminalInputRef]);

  /* istanbul ignore next: Covered by interactivity tests */
  const scrollToBottom = useCallback(() => {
    const rootNode = terminalRootRef.current;
    // This may look ridiculous
    // but it is necessary to decouple execution for just a millisecond
    // in order to scroll all the way
    if (rootNode) {
      setTimeout(() => {
        rootNode.scrollTop = rootNode.scrollHeight;
      }, 1);
    }
  }, [terminalRootRef]);

  const showWelcomeMessage = () => {
    if (typeof welcomeMessage === 'boolean') {
      pushToStdout('Welcome to the React terminal! Type \'help\' to get a list of commands.');
    } else if (Array.isArray(welcomeMessage)) {
      welcomeMessage.map((item) => pushToStdout(item));
    } else pushToStdout(welcomeMessage);
  };

  const showHelp = () => {
    Object.keys(_commands).forEach((c) => {
      const cmdObj = _commands[c];
      const usage = cmdObj.usage ? ` - ${cmdObj.usage}` : '';
      pushToStdout(`${c} - ${cmdObj.description}${usage}`);
    });
  };

  const validateCommands = () => {
    const validCommands = handleValidateCommands(
      commands,
      showHelp,
      clearStdout,
      { noDefaults, ignoreCommandCase },
    );
    setCommands(validCommands);
  };

  const processCommand = () => {
    setProcessing(true);
    (async () => {
      // Initialise command result object
      const commandResult: CommandResultType = {
        command: null,
        args: [],
        rawInput: null,
        result: null,
      };
      const rawInput = lastPromptPart;

      if (!noHistory && !isWrap) {
        pushToHistory(rawInput);
      }

      if (!noEchoBack) {
        // Mimic native terminal by echoing command back
        pushToStdout(
          <TerminalEcho
            promptLabel={promptLabel}
            rawInput={rawInput}
          />,
          { rawInput, isEcho: true },
        );
      }

      if (rawInput) {
        const input = rawInput.split(' ');
        const rawCommand = input.splice(0, 1)[0]; // Removed portion is returned...
        const args = input; // ...and the rest can be used

        commandResult.rawInput = rawInput;
        commandResult.command = rawCommand;
        commandResult.args = args;

        const exists = commandExists(
          _commands,
          rawCommand,
          ignoreCommandCase,
        );

        if (!exists) {
          pushToStdout(errorText
            ? errorText.replace(/\[command\]/gi, rawCommand)
            : `Command '${rawCommand}' not found!`);
        } else {
          const cmd = _commands[rawCommand.toLowerCase()];
          const res = await cmd.fn(...args);
          if (res) {
            pushToStdout(res);
            commandResult.result = res;
          }
          if (cmd.explicitExec) await cmd.fn(...args);
        }
      }

      setProcessing(false);
      clearInput();
      if (!noAutoScroll) scrollToBottom();
      if (commandCallback) commandCallback(commandResult);
    })();
  };

  const scrollHistory = (direction: 'up' | 'down') => {
    const toUpdate = handleScrollHistory(direction, {
      history,
      historyPosition,
      previousHistoryPosition,
      terminalInputRef,
    });
    if (terminalInputRef.current) {
      setLastPromptPart(terminalInputRef?.current?.value);
    }

    // Only update if there is something to update
    if (toUpdate) {
      setHistoryPosition(toUpdate.historyPosition);
      setPreviousHistoryPosition(toUpdate.previousHistoryPosition);
    }
  };

  const handleEnter = () => {
    if (!isWrap) {
      if (lastPromptPart === '') {
        processCommand();
        return;
      }
      const rawCommand = lastPromptPart.split(' ').splice(0, 1)[0]; // Removed portion is returned...
      const exists = commandExists(
        _commands,
        rawCommand,
        ignoreCommandCase,
      );
      if (exists) {
        processCommand();
        return;
      }
    }
    const newPromot = promptValue === '' ? lastPromptPart : `${promptValue}${lastPromptPart}`;
    const { shouldWrap, leftSybolCount } = needEndWrap(newPromot, matchings);
    if (shouldWrap || (lastPromptPart !== '' && promptValue !== '')) {
      setPromptValue(`${newPromot}\n`);
      setIsWrap(true);
      setLastPromptPart(new Array(leftSybolCount).fill('  ').join(''));
    } else {
      if (!noEchoBack) {
        newPromot.split('\n').forEach((rawInput, i) => {
          pushToStdout(
            <TerminalEcho
              promptLabel={i === 0 ? promptLabel : promptWrapLabel}
              rawInput={rawInput}
            />,
            { rawInput, isEcho: true },
          );
        });
      }
      // TODO
      setProcessing(true);
      (async () => {
        const result = await outerCommander(newPromot);
        if (result) {
          pushToStdout(result);
        }
        setPromptValue('');
        setLastPromptPart('');
        setIsWrap(false);
        setProcessing(false);
      })();
    }
  };

  const handleBackspace = () => {
    if (lastPromptPart === '' && promptValue !== '') {
      const a = promptValue.split('\n');
      if (a.length <= 2) {
        setIsWrap(false);
      }
      setLastPromptPart(`${a[a.length - 2]} `);
      if (a.length <= 2) {
        setPromptValue(`${a.slice(0, a.length - 2).join('\n')}`);
      } else {
        setPromptValue(`${a.slice(0, a.length - 2).join('\n')}\n`);
      }
    }
  };

  const handleInput = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        handleEnter();
        break;
      case 'Backspace':
        handleBackspace();
        break;
      // TODO BUG
      case 'ArrowUp': if (!isWrap) { scrollHistory('up'); } break;
      case 'ArrowDown': if (!isWrap) { scrollHistory('down'); } break;
      default: // do nothing
    }
  };

  const shouldPromptBeVisible = (): boolean => {
    // If prompt should be hidden when disabled...
    /* istanbul ignore if: Covered by interactivity tests */
    if (hidePromptWhenDisabled) {
      if (disabled) {
        // ...hide on explicit prop-controlled disable...
        return false;
      }
      if (disableOnProcess && processing) {
        // ...or when disabling on process is enabled and terminal is processing.
        return false;
      }
    }

    // If no above conditions were met
    // the read-only state controls whether the prompt should be visible or not
    return !readOnly;
  };

  useEffect(() => {
    if (defaultPromptValue === '') {
      return;
    }
    focusTerminal();
    const a = defaultPromptValue.split('\n');
    console.log(a);
    if (a.length === 1) {
      setLastPromptPart(defaultPromptValue);
      return;
    }
    setIsWrap(true);
    setPromptValue(`${a.slice(0, a.length - 1).join('\n')}\n`);
    setLastPromptPart(a[a.length - 1]);
    a.slice(0, a.length - 1).forEach((m) => {
      pushToHistory(m);
    });
  }, [defaultPromptValue]);

  useEffect(() => {
    validateCommands();
  }, [commands]);

  useEffect(() => {
    if (welcomeMessage) {
      showWelcomeMessage();
    }
    if (autoFocus) {
      focusTerminal();
    }
  }, []);

  useEvent(updateEvent, (message: React.ReactNode) => {
    pushToStdout(message, {
      rawInput: '',
      isEcho: false,
    });
    reRender();
    focusTerminal();
  }, [pushToStdout, pushToHistory, stdout]);

  const getPromptStd = () => {
    const a = promptValue.split('\n');
    const b = a.slice(0, a.length - 1);
    if (b.length === 0) {
      return null;
    }
    return (
      <div>
        <TerminalEcho
          promptLabel={promptLabel}
          rawInput={b[0]}
        />
        {
          b.slice(1).map(
            (bb) => (
              <TerminalEcho
                promptLabel={promptWrapLabel}
                rawInput={bb}
              />
            ),
          )
        }
      </div>
    );
  };

  return (
    <div
      ref={terminalRootRef}
      className={clsx('terminal-container', theme, className)}
      style={style}
      onClick={focusTerminal}
    >
      {/* Loading */}
      <div className={clsx('terminal-loading-container', {
        hidden: !loading,
      })}
      >
        <div className="terminal-loading">Waiting for Sandbox</div>
      </div>
      {/* Content */}
      <div
        className={clsx('terminal-content', contentClassName)}
        style={contentStyle}
      >
        {/* Stdout */}
        {getStdout()}
        {getPromptStd()}
        {/* Input area */}
        <div
          className={clsx('terminal-input-area', inputAreaClassName)}
          style={shouldPromptBeVisible() ? inputAreaStyle : { display: 'none' }}
        >
          {/* Prompt label */}
          <span
            className={clsx('terminal-prompt-label', promptLabelClassName)}
            style={promptLabelStyle}
          >
            {isWrap ? promptWrapLabel : promptLabel}
          </span>
          {/* Input */}
          <input
            ref={terminalInputRef}
            className={clsx('terminal-input', inputClassName)}
            style={inputStyle}
            onKeyDown={handleInput}
            type="text"
            autoComplete="off"
            value={lastPromptPart}
            onChange={(e) => { setLastPromptPart(e.target.value); }}
            disabled={disabled || (disableOnProcess && processing)}
          />
        </div>
      </div>
      {flag}
    </div>
  );
};

export default Terminal;
