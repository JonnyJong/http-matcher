import { IURL, IURLPath } from "../types/url";

export class URLPath implements IURLPath {
  #paths = new Array<string>();
  constructor(...args: string[]) {
    this.join(...args);
  };
  get length(): number {
    return this.#paths.length;
  };
  entries(): IterableIterator<string> {
    return this.#paths.values();
  };
  forEach(callbackfn: (value: string, index: number, urlPath: IURLPath) => void): void {
    let urlPath = new URLPath(this.toString());
    this.#paths.forEach((v, i)=>callbackfn(v, i, urlPath));
  };
  static isURLPath(urlPath: any): boolean {
    return urlPath instanceof URLPath;
  };
  join(...args: string[]) {
    if (!args.every((value)=>typeof value === 'string')) throw new TypeError('`The "path" argument must be of type string.');
    for (const arg of args) {
      for (const i of arg.split(/\/|\\/g)) {
        if (['', '.', '/', '\\'].includes(i)) continue;
        if (i === '..') {
          this.#paths.pop();
          continue;
        }
        this.#paths.push(decodeURIComponent(i));
      }
    }
  };
  toString(): string {
    return '/' + this.#paths.map((v)=>encodeURIComponent(v)).join('/');
  };
  values(): IterableIterator<string> {
    return this.#paths.values();
  };
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this.#paths[i];
    }
  }
};

export class URL implements IURL {
  #path: URLPath;
  #parmas: URLSearchParams;
  #hash: string = '';
  constructor(url: string) {
    let end = url.length;
    let hashStart = url.indexOf('#');
    if (hashStart >= 0) {
      end = hashStart;
    }
    let parmasStart = url.indexOf('?');
    if (parmasStart >= 0 && parmasStart < end) {
      end = parmasStart;
    }
    this.#path = new URLPath(url.slice(0, end));
    if (hashStart >= 0) {
      this.#hash = url.slice(hashStart + 1, parmasStart > hashStart ? parmasStart : undefined);
    }
    let parmas = '';
    if (parmasStart >= 0) {
      parmas = url.slice(parmasStart, hashStart > parmasStart ? hashStart : undefined);
    }
    this.#parmas = new URLSearchParams(parmas);
  };
  get path(): URLPath {
    return this.#path;
  };
  set path(v: URLPath) {
    if (!URLPath.isURLPath(v)) throw new TypeError(`The "path" must be of instance URLPath`);
    this.#path = v;
  };
  get parmas(): URLSearchParams {
    return this.#parmas;
  };
  set parmas(v: URLSearchParams) {
    if (!(v instanceof URLSearchParams)) throw new TypeError(`The "parmas" must be of instance URLSearchParams`);
    this.#parmas = v;
  };
  get hash(): string {
    return this.#hash;
  };
  set hash(v: string) {
    if (typeof v !== 'string') throw new TypeError('`The "hash" must be of type string.');
    this.#hash = v;
  };
  toString(): string {
    let url: string = this.#path.toString();
    if (this.#hash.length) {
      url += '#' + encodeURIComponent(this.#hash);
    }
    if (this.#parmas.size) {
      url += '?' + this.#parmas.toString();
    }
    return url;
  };
};
