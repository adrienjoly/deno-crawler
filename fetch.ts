// fetches a web page using HTTP client

import {request} from "./../deno-request/request.ts"

(async () => {
  // GET
  const {status, headers, body} = await request("http://httpbin.org/get?deno=land");
  const buf = new Deno.Buffer();
  await Deno.copy(buf, body);
  const json = JSON.parse(buf.toString());
  console.log(json);
})();