import { IncomingMessage, Server, ServerResponse } from "node:http";

export type Responser = (req: IncomingMessage, res: ServerResponse<IncomingMessage> & { req: IncomingMessage; })=>void;

export type Matcher = RegExp | ((url: string)=>boolean);

export class IServer {
  constructor(port: number);
  /**
   * @readonly
   */
  server: Server;
  defaultResponser?: Responser;
  getAllHandlers(): Map<Matcher, Responser>;
  setHandler(match: Matcher, response: Responser): void;
  removeHandler(match: Matcher): void;
}