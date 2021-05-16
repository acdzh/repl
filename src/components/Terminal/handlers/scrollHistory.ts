import React from 'react';

const cleanArray = <T>(dirtyArray: T[]): T[] => {
  const newArray = Array.from(dirtyArray);
  return newArray.filter((i: T): boolean => i !== undefined);
};

const sendCursorToEnd = (inputElement: HTMLInputElement): void => {
  if (inputElement) {
    const cursorStart = inputElement.selectionStart;
    const cursorEnd = inputElement.selectionEnd;

    // eslint-disable-next-line max-len
    // Decouple execution for 2 ms (1 doesn't work for... Reasons) in order to properly send cursor to end
    setTimeout(() => inputElement.setSelectionRange(cursorStart, cursorEnd), 10);
  }
};

const handleScrollHistory = (direction: 'up' | 'down', options: {
  history: string[];
  historyPosition: number | null;
  previousHistoryPosition: number | null;
  terminalInputRef: React.RefObject<HTMLInputElement>;
}): ({
  historyPosition: number | null;
  previousHistoryPosition: number | null;
}) | null => {
  const {
    history,
    historyPosition,
    previousHistoryPosition,
    terminalInputRef,
  } = options;

  // Clean potential empty items and reverse order to ease position tracking
  // (Reverse = starting from the newest first when going up and vice versa)
  const commandHistory = cleanArray(history).reverse();
  const position = historyPosition || 0;
  const previousPosition = previousHistoryPosition;
  const terminal = terminalInputRef.current;

  if (terminal && commandHistory.length > 0) { // Only run if history is non-empty and in use
    switch (direction) {
      case 'up': {
        // eslint-disable-next-line max-len
        // Declaring variables for these here to better clarify this block which can get pretty convoluted
        const latest = commandHistory[0];
        const first = commandHistory[commandHistory.length - 1];
        const next = commandHistory[position + 1];

        if (position === null) {
          // If at no yet defined position, get most recent entry
          terminal.value = latest;
          sendCursorToEnd(terminal);

          return {
            historyPosition: 0,
            previousHistoryPosition: null,
          };
        } if (position + 1 === commandHistory.length) {
          // If the first entry will be reached on this press
          // get it and decrement position by 1 to avoid confusing downscroll
          // EXCEPT: If there is only 1 unit in the history
          // our previous position was actually null, not zero as defined above
          // Hence why in one-unit histories the previous position has to be set to null, not 0
          terminal.value = first;
          sendCursorToEnd(terminal);

          return {
            historyPosition: commandHistory.length - 1,
            previousHistoryPosition: commandHistory.length === 1 ? null : commandHistory.length - 2,
          };
        }
        // Normal increment by one
        terminal.value = next;
        sendCursorToEnd(terminal);

        return {
          historyPosition: position + 1,
          previousHistoryPosition: position,
        };
      }
      case 'down': {
        // Declaring variables for these here to better clarify this block
        // which can get pretty convoluted
        const latest = commandHistory[0];
        const empty = '';
        const next = commandHistory[position - 1];

        if (position === null || !commandHistory[position]) {
          // If at initial or out of range, clear (Unix-like behaviour)
          terminal.value = empty;
          sendCursorToEnd(terminal);

          return {
            historyPosition: null,
            previousHistoryPosition: null,
          };
        } if (position - 1 === -1) {
          // Clear because user is either pressing up once
          // and is now pressing down again, or is reaching the latest entry
          if (
            previousPosition === null
            || (position === 0 && previousPosition === 1)
          ) {
            terminal.value = empty;
          } else {
            terminal.value = latest;
          }
          sendCursorToEnd(terminal);

          return {
            historyPosition: null,
            previousHistoryPosition: null,
          };
        }
        // Normal decrement by one
        terminal.value = next;
        sendCursorToEnd(terminal);

        return {
          historyPosition: position - 1,
          previousHistoryPosition: position,
        };
      }
      default: // do nothing
    }
  }
  return {
    historyPosition,
    previousHistoryPosition,
  };
};

export default handleScrollHistory;
