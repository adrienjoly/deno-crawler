// fetches a web page using HTTP client

const RE_URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
const RE_TITLE = /<title>(.*)<\/title>/;

type CrawledPage = {
  title: String,
  urls: Array<String>,
};

const fetchPage = ({ url }) => new Promise<CrawledPage>(async (resolve, reject) => {
  const timeout = setTimeout(() => reject(new Error('timeout')), 2000);
  const res = await fetch(url);
  clearTimeout(timeout);
  // console.log({ url, res });
  const html = await res.text(); // we should await text() in all cases, otherwise a promise prevents the program to exit in the non-html case
  if (res.body.contentType.includes('text/html')) {
    resolve({
      title: html.match(RE_TITLE).pop(),
      urls: html.match(RE_URL) || []
    });
  } else {
    reject(new Error('not an html page'));
  }
});

async function crawl ({ remainingUrls = 1, url, addRecord }) {
  if (remainingUrls <= 0) return;
  console.log(`- fetching ${url}...`);
  try {
    const page = await fetchPage({ url });
    addRecord({ url, title: page.title });
    for (let i in page.urls) {
      await crawl({
        remainingUrls: remainingUrls - Number(i) - 1,
        url: page.urls[i],
        addRecord
      });
    }
  } catch (err) {
    console.error('crawl error:', err.message);
  }
}

(async () => {
  // const NOT_HTML = 'https://blog.algolia.com/wp-content/uploads/2019/03/cropped-favicon-270x270.png';
  const url = 'https://blog.algolia.com/';

  // state management: list of crawled records
  const crawledRecords = []
  const addRecord = ({ url, title }) => crawledRecords.push({ url, title });
  
  // actual crawling process
  const remainingUrls = 5;
  console.log(`crawling ${remainingUrls} pages from ${url}...`)
  await crawl({ remainingUrls, url, addRecord });

  // end of crawling
  console.log('crawled records:', JSON.stringify(crawledRecords, null, 2));
  console.log(`=> fetched records: ${crawledRecords.length}`);
})();
