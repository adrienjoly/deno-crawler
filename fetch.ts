// fetches a web page using HTTP client

import {request} from "./../deno-request/request.ts"

(async () => {
  // warning: does not support HTTPS
  const {status, headers, body} = await request("http://example.com");
  const buf = new Deno.Buffer();
  await Deno.copy(buf, body);
  console.log(buf.toString());
})();
