// The Emoticon VM
//   Input is a key/value pair consists of :
//     * @arg  source: (Array of instructions, or a String of code)
//     * @arg  print: A function that would be called with any output from the program
//     * @arg  input: A function that would be called when the program is asking for input
//                    . Would be passed a
//                     function that would be called with the input to continue execution.
//     * @arg  result: A function that would be called after the program has finished execution.
//     *                It would be passed the evironment lists as an object.

import { AnyFunctionType } from 'src/sandbox/utils';
import Instruction from './Instruction';
import Parser from './Parser';
import RuntimeError from './RuntimeError';

type ListsKeyType = 'X' | 'Z' | 'A' | 'G' | 'S' | 'E' | ':';

type ListsType = {
  X: number[];
  Z: Instruction[];
  A : ListsKeyType[];
  G: string[];
  S: string[];
  E:string[];
  ':': number[];
};

//     * @arg  logger: Optional,
//      will be called after each step of execution with the current program state.
export default class Interpreter {
  print: any;

  input: any;

  result: any;

  logger: any;

  lists: ListsType;

  constructor(arg: {
    source:any[]; print:any; input:any; result:any; logger?: any,
  }) {
    const {
      source, print, input, result, logger,
    } = arg;
    this.print = print;
    this.input = input;
    this.result = result;
    this.logger = logger;

    source.unshift('START');
    this.lists = {
      X: [1], // The instruction pointer.
      Z: source, // The source code.
      A: [':'], // The current list name.
      G: [], // he list of set markers.
      S: [' '], // A list of a single space.
      E: [], // An empty list.
      ':': [], // The default list.
    };
  }

  debug(): boolean {
    if (this.logger == null) {
      return false;
    }
    this.logger(`step ${this.left('X')}`);
    const log = Object.entries(this.lists).reduce(
      (pre, [i, v]) => `${pre}\n${i}: ${v.toString()}`,
      '',
    );
    this.logger(log);
    return true;
  }

  // Returns the closest block divider or closer from a specified index in the source list
  closestDivideOrClose(index: number): number {
    const list = this.lists.Z;
    while (index < list.length) {
      if (list[index].mouth === ')') {
        return index;
      } if (list[index].mouth === '|') {
        this.lists.G[0] = 'IF';
        return index;
      }
      // eslint-disable-next-line no-param-reassign
      index += 1;
    }
    return Infinity;
  }

  closestCloser(index: number): number {
    const list = this.lists.Z;
    while (index < list.length) {
      if (list[index].mouth === ')') {
        return index;
      }
      // eslint-disable-next-line no-param-reassign
      index += 1;
    }
    return Infinity;
  }

  left(listName: ListsKeyType): any {
    return this.lists[listName][0];
  }

  right(listName: ListsKeyType): any {
    return this.lists[listName][this.lists[listName].length - 1];
  }

  putRight(listName: ListsKeyType, dataItem: any): any {
    return (this.lists[listName] as any).push(dataItem);
  }

  putLeft(listName: ListsKeyType, dataItem: any): any {
    return (this.lists[listName] as any).unshift(dataItem);
  }

  currentList(): ListsKeyType {
    return this.left('A');
  }

  clone(listName: ListsKeyType): any[] {
    const list = this.lists[listName];
    return list.map((v: any) => v);
  }

  run(): ListsType {
    let cont = true;
    let i = 0;
    while (cont && typeof cont !== 'function' && i < 30000) {
      i += 1;
      this.debug();
      cont = this.step();
    }
    if (typeof cont === 'function') {
      (cont as AnyFunctionType)();
    } else if (typeof this.result === 'function') {
      this.result(this.lists);
    }
    return this.lists;
  }

  step(): boolean {
    let instruction: Instruction = this.lists.Z[this.left('X')];
    if (!instruction) {
      return false;
    }
    if (!(instruction instanceof Instruction)) {
      // eslint-disable-next-line prefer-destructuring
      instruction = Parser(instruction as string)[0];
    }
    if (instruction.type === 'data') {
      this.putRight(this.currentList(), instruction.value);
      this.lists.X[0] += 1;
    } else if (instruction.type === 'emoticon') {
      const ret = this.execute(instruction);
      this.lists.X[0] += 1;
      return ret;
    }
    return true;
  }

  execute(instruction: Instruction): any {
    // eslint-disable-next-line prefer-const
    let { mouth, nose, face } = instruction;
    const AssertCount = (count: number, listName: ListsKeyType) => {
      if (this.lists[listName].length < count) {
        throw new RuntimeError(`List '${listName}' needs to have at least #${count} items to execute ${instruction} at ${this.left('X')}`);
      }
    };
    let list: any[];
    if (face && face.length === 1 && face[0] === ':') {
      list = this.lists[':'];
    } else if (face && face.length === 2 && face[1] === ':' && face[0] in this.lists) {
      // eslint-disable-next-line prefer-destructuring
      face = face[0];
      list = this.lists[face as ListsKeyType];
    } else if (!this.lists[face as ListsKeyType]) {
      this.lists[face as ListsKeyType] = [];
      list = [];
    } else {
      list = this.lists[face as ListsKeyType];
    }
    const currFace = this.currentList();
    const currList = this.lists[currFace];
    switch (mouth) {
      case 'O':
        this.lists.A[0] = face as any;
        break;
      case 'C':
        currList.unshift(list.length as never);
        break;
      case '<':
        AssertCount(1, currFace);
        this.putLeft(face as ListsKeyType, currList.shift());
        break;
      case '>':
        AssertCount(1, currFace);
        this.putRight(face as ListsKeyType, currList.pop());
        break;
      case '[':
        AssertCount(1, currFace);
        this.putLeft(face as ListsKeyType, this.left(currFace));
        break;
      case ']':
        AssertCount(1, currFace);
        this.putRight(face as ListsKeyType, this.right(currFace));
        break;
      case 'V': {
        AssertCount(2, ':');
        let numToReplace = this.lists[':'].shift() || 0;
        let insertIndex = this.lists[':'].shift() || 0;
        const currentList = this.clone(currFace);
        while (currentList.length) {
          const item = currentList.shift();
          const isReplace = numToReplace > 0 ? 1 : 0;
          numToReplace -= 1;
          const replaced = list.splice(insertIndex, isReplace, item);
          insertIndex += 1;
          if (isReplace) {
            this.putRight(':', replaced[0]);
          }
        }
        break;
      }
      case 'D':
        list = this.clone(currFace);
        (this.lists as any)[face as string] = list;
        break;
      case '@': {
        AssertCount(1, currFace);
        const numToRotate = this.left(currFace);
        for (let x = numToRotate; x <= 1; x += 1) {
          this.putLeft(face as ListsKeyType, list.pop());
        }
        break;
      }
      case 'P':
        AssertCount(1, face as ListsKeyType);
        this.print(list[0].toString());
        break;
      case 'Q':
        AssertCount(1, face as ListsKeyType);
        this.print(list.shift().toString());
        break;
      case '7': {
        AssertCount(1, face as ListsKeyType);
        const tmp: any[] = [];
        list.shift().split('').forEach((v: any) => {
          tmp.push(v);
        });
        list = tmp.concat(list);
        this.lists[face as ListsKeyType] = list;
        break;
      }
      case 'L': {
        AssertCount(1, face as ListsKeyType);
        const tmp: any[] = [];
        list.pop().split('').forEach((v: any) => {
          tmp.push(v);
        });
        this.lists[face as ListsKeyType] = list.concat(tmp);
        break;
      }
      case '#': {
        const count = this.left(currFace);
        const tmp = Number.isNaN(count) ? list.splice(0, list.length) : list.splice(0, count);
        const tmp2 = nose === '~' ? tmp.join(' ') : tmp.join('');
        list.unshift(tmp2);
        break;
      }
      case '$': {
        const count = this.left(currFace);
        const tmp = list.splice(-count, count);
        const tmp2 = nose === '~' ? tmp.join(' ') : tmp.join('');
        list.push(tmp2);
        break;
      }
      case '{':
      case '}': {
        AssertCount(2, face as ListsKeyType);
        const put = (item: any) => {
          if (mouth === '{') {
            return list.unshift(item);
          }
          return list.push(item);
        };
        const pull = () => {
          if (mouth === '{') {
            return list.shift();
          }
          return list.pop();
        };
        const operand1 = pull();
        const operand2 = pull();
        switch (nose) {
          case '+':
            put(operand1 + operand2);
            break;
          case '-':
            put(operand1 - operand2);
            break;
          case 'x':
            put(operand1 * operand2);
            break;
          case '/':
            put(operand1 / operand2);
            break;
          case '\\':
            put(operand1 % operand2);
            break;
          default: // ignore
        }
        break;
      }
      case '\\':
      case '/': {
        const put = (item: any) => {
          if (mouth === '\\') {
            return this.lists[':'].unshift(item.toString().toUpperCase());
          }
          return this.lists[':'].push(item.toString().toUpperCase());
        };

        const operand1 = mouth === '\\' ? this.left(currFace) : this.right(currFace);
        const operand2 = mouth === '\\' ? this.left(face as ListsKeyType) : this.right(face as ListsKeyType);
        switch (nose) {
          case '=':
            put(operand1 === operand2);
            break;
          case '>':
            put(operand1 > operand2);
            break;
          case '<':
            put(operand1 < operand2);
            break;
          case '~':
            put(operand1 !== operand2);
            break;
          default:
        }
        break;
      }
      case '(':
        this.lists.G.push(this.left('X'));
        break;
      case ')': {
        const marker = this.lists.G.pop();
        const nextInstruction = marker === 'IF' ? this.left('X') : (marker as unknown as number) - 1;
        this.lists.X[0] = nextInstruction;
        break;
      }
      case '|':
        this.lists.X[0] = this.closestCloser(this.left('X'));
        break;
      case '3':
      case 'E': {
        const condition = this.left(':');
        if (condition === 'TRUE') {
          this.lists.X[0] = this.closestDivideOrClose(this.left('X'));
        }
        // eslint-disable-next-line no-mixed-operators
        if (mouth === 'E' && condition === 'TRUE' || condition === 'FALSE') {
          this.lists[':'].shift();
        }
        break;
      }
      case '*':
        return () => this.input((result: string) => {
          result.split(/[ \t\v]+/).forEach((word) => {
            this.putRight(currFace, word);
          });
          this.run();
        });

      default: // nothing
    }
    return true;
  }
}
