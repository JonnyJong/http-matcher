import { IServer } from "./types/server";
import { IURL, IURLPath } from "./types/url";
export { Responser, Matcher } from "./types/server";

export function tryPort(port: number): Promise<string | void>;

export class Server extends IServer {}

export class URLPath extends IURLPath {}
export class Url extends IURL {}