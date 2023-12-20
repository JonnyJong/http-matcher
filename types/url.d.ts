import { URLSearchParams } from "url";

export class IURLPath {
  /**
   * @readonly
   */
  length: number;
  constructor(...args: string[]);
  entries(): IterableIterator<string>;
  forEach(callbackfn: (value: string, index: number, urlPath: IURLPath) => void): void;
  static isURLPath(urlPath: any): boolean;
  join(...args: string[]): void;
  toString(): string;
  values(): IterableIterator<string>;
  [Symbol.iterator](): IterableIterator<string>;
}

export class IURL {
  path: IURLPath;
  parmas: URLSearchParams;
  hash: string;
  constructor(url: string);
  toString(): string;
}