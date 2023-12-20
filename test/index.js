const { Server, tryPort } = require('../dist/index');

function html(path, label) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${path}<div>${label}</div><a href="/test">Go test page</a><br><a href="/end">END SERVER</a></body></html>`;
}

async function test() {
  let port = 49152;
  while (!(await tryPort(port))) {
    port++;
    if (port > 50000) {
      console.warn('Unable to start the test, ports 49152 through 50000 are occupied.');
      return;
    }
  }
  
  const server = new Server(port);
  console.log('http://localhost:' + port + '\n\n');

  let testPage = false;
  server.defaultResponser = (req, res)=>{
    res.statusCode = 200;
    res.write(html(req.url, 'default'));
    res.end();

    if (testPage) return;
    testPage = true;
    server.setHandler(/\/test*/, (req, res)=>{
      res.statusCode = 200;
      res.write(html(req.url, 'IN TEST PAGE: ' + Math.random()));
      res.end();
    });
    console.log(server.getAllHandlers());
  };

  server.setHandler(/\/end*/, (_req, res)=>{
    res.statusCode = 200;
    res.write('GOOD BYE!');
    res.end();
    server.server.close();
    process.exit();
  });
  console.log(server.getAllHandlers());
}
test();