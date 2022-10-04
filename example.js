const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.ebay.co.uk/sch/i.html?_nkw=one+pound&rt=nc&LH_Sold=1&LH_Complete=1');
  const tweets = await page.$$(".s-item, .s-item__pl-on-bottom");

  wait(5000);
    for (let i = 0; i < tweets.length; i++) {
        const tweetEle = await tweets[i].$('.s-item__title, .s-item__title--has-tags');
        const tweet = (await (await tweetEle.getProperty('innerText')).jsonValue());
        console.log(tweet);
    }

  await page.screenshot({path: 'example.png', fullPage: true});

  /*await items.screenshot({path: 'items.png', fullPage: true}); */

  await browser.close();
  console.log(tweets.frame);
})();

async function wait(time) {

    return new Promise(function(resolve) {

        setTimeout(resolve, time)

    });

}