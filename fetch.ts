// fetches a web page using HTTP client

const RE_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

async function fetchLinks({ url }) {
  const res = await fetch(url);
  const { contentType } = res.body;
  const html = await res.text(); // we should await text() in all cases, otherwise a promise prevents the program to exit in the non-html case
  if (contentType.includes('text/html')) {
    const urls = html.match(RE_URL);
    return urls;
  }
}

(async () => {
  const ALGOLIA_BLOG = 'https://blog.algolia.com/';
  const NOT_HTML = 'https://blog.algolia.com/wp-content/uploads/2019/03/cropped-favicon-270x270.png';
  const urls = await fetchLinks({ url: ALGOLIA_BLOG });
  // const urls = await fetchLinks({ url: NOT_HTML });
  console.log(urls ? urls.join('\n') : 'not a html page');
  
})();
