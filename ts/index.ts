import http, { IncomingMessage, ServerResponse, createServer } from "node:http";
import net from "node:net";
import { IServer, Matcher, Responser } from "../types/server";
export * from "./url";

export function tryPort(port: number): Promise<string | void> {
  return new Promise((resolve)=>{
    let server = net.createServer();
    server.on('listening', ()=>{
      server.close();
      resolve();
    });
    server.on('error', (err)=>{
      if (['EADDRINUSE', 'EACCES', 'EADDRNOTAVAIL', 'EAFNOSUPPORT', 'EAGAIN', 'EWOULDBLOCK'].includes((err as any).code)) {
        return resolve((err as any).code);
      }
      resolve();
    });
  server.listen(port);
  });
}

export class Server implements IServer {
  #server: http.Server;
  #handlers: Map<Matcher, Responser> = new Map();
  defaultResponser?: Responser;
  #Responser = async (req: IncomingMessage, res: ServerResponse<IncomingMessage> & { req: IncomingMessage })=>{
    let url = req.url ? req.url : '';
    for (const [match, response] of this.#handlers) {
      if (!(match instanceof RegExp && match.test(url)) && !(typeof match === 'function' && match(url))) continue;
      return response(req, res);
    }
    if (typeof this.defaultResponser === 'function') {
      return this.defaultResponser(req, res);
    }
    res.statusCode = 404;
    res.end();
  };
  constructor(port: number) {
    if (typeof port !== 'number') throw new TypeError('The "port" must be of type number.');
    this.#server = createServer(this.#Responser);
    this.#server.listen(port);
  };
  getAllHandlers(): Map<Matcher, Responser> {
    return new Map([...this.#handlers]);
  };
  setHandler(match: Matcher, response: Responser): void {
    if (!(match instanceof RegExp) && typeof match !== 'function') throw new TypeError(`The "match" argument must be of instance RegExp or type function.`);
    if (typeof response !== 'function') throw new TypeError(`The "response" argument must be of type function.`);
    this.#handlers.set(match, response);
  };
  removeHandler(match: Matcher): void {
    this.#handlers.delete(match);
  };
  get server(): http.Server {
    return this.#server;
  };
};