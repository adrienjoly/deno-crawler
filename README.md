# Node Crawler

Experimental project, just to play with `deno`.

## Usage

After you install [`deno`](https://github.com/denoland/deno);

```sh
$ deno --allow-net crawl.ts
```

## Learnings

- deno only provides a `dial` API that supports TCP, but not HTTP! => you need to import deno's "standard" lib in order to create a HTTP server
- the version of deno and its "standard" lib must be in sync => if you import a lib that uses an older version, it may result in a linking error at runtime
- imports are processed (downloaded) before running the source code
- it's cool to explicitely give permissions for a node program to use the file system and/or network
- we later found a undocumented `fetch()` function built-in
- unfortunatly, this function hangs on some URLs without throwing... 😱
- We had to create a return type for the `crawl()` function as soon as we made it a Promise
- we did not try to use deno's debugger (if any)
