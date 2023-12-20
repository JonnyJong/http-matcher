# http-matcher
Simple wrapper for node:http to handle different page requests by using matcher and responder.

## Usage
```javascript
const { Server, tryPort } = require('../dist/index');

(async ()=>{
  if (!(await tryPort(80))) {
    throw new Error('Port Occupancy.');
  }

  let server = new Server(80);
  server.defaultResponser = (req, res)=>{
    // Using node's API
    res.statusCode = 200;
    res.write(/* HTML */);
    res.end();
  };

  server.setHandler(/\/page*/, (req, res)=>{
    // Other page's responser
  });
})();
```

## Build
```sh
npm install
tsc
```