// fetches a web page using HTTP client

(async () => {
  const res = await fetch('https://blog.algolia.com');
  console.log(await res.text());
})();
