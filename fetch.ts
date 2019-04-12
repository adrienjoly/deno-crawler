// fetches a web page using HTTP client

const RE_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const RE_TITLE = /<title>(.*)<\/title>/;

async function fetchLinks({ url }) {
  const res = await fetch(url);
  const { contentType } = res.body;
  const html = await res.text(); // we should await text() in all cases, otherwise a promise prevents the program to exit in the non-html case
  if (contentType.includes('text/html')) {
    const title = html.match(RE_TITLE).pop();
    const urls = html.match(RE_URL) || [];
    return {
      title,
      urls
    };
  }
}

async function crawl ({ remainingUrls = 1, url, addRecord }) {
  if (remainingUrls <= 0) return;
  //console.log('fetching', {url});
  const page = await fetchLinks({ url });
  if (!page) return; // not an html page
  addRecord({ url, title: page.title });
  for (let i in page.urls) {
    await crawl({
      remainingUrls: remainingUrls - Number(i) - 1,
      url: page.urls[i],
      addRecord
    });
  }
}

(async () => {
  const ALGOLIA_BLOG = 'https://blog.algolia.com/';
  const NOT_HTML = 'https://blog.algolia.com/wp-content/uploads/2019/03/cropped-favicon-270x270.png';

  const url = ALGOLIA_BLOG;

  // state management: list of crawled records
  const crawledRecords = []
  const addRecord = ({ url, title }) => crawledRecords.push({ url, title });
  
  // actual crawling process
  const remainingUrls = 2;
  console.log(`crawling ${remainingUrls} pages from ${url}...`)
  await crawl({ remainingUrls, url, addRecord });

  // end of crawling
  console.log('crawled records:', JSON.stringify(crawledRecords, null, 2));
  
})();
