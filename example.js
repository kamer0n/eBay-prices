const puppeteer = require('puppeteer');

const searchTerm = "one pound";
const formattedSearchTerm = searchTerm.replace(' ', '+');
console.log(formattedSearchTerm);


(async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.goto(`https://www.ebay.co.uk/sch/i.html?_nkw=${formattedSearchTerm}&rt=nc&LH_Sold=1&LH_Complete=1`);
	const listings = await page.$$(".s-item, .s-item__pl-on-bottom");

	wait(5000);
	for (let i = 0; i < listings.length; i++) {
		
				
		const listingTitle = await listings[i].$('.s-item__title, .s-item__title--has-tags');
		const listingTitleText = (await (await listingTitle.getProperty('innerText')).jsonValue());

		const listingPrice = await listings[i].$('.s-item__price');
		const listingPriceText = (await (await listingPrice.getProperty('innerText')).jsonValue());

		const shippingPrice = await listings[i].$('.s-item__shipping, .s-item__logisticsCost');
		if (shippingPrice) {
			const shippingPriceText = (await (await shippingPrice.getProperty('innerText')).jsonValue());
			console.log(listingPriceText + " " + shippingPriceText);
		}

		const soldDate = await listings[i].$('div.s-item__title--tagblock > span.POSITIVE');
		if (soldDate) {
			const soldDateText = (await (await soldDate.getProperty('innerText')).jsonValue());
			console.log(soldDateText);
		}

		console.log(listingTitleText);
	}

	await page.screenshot({path: 'example.png', fullPage: true});


	await browser.close();
})();

async function wait(time) {

	return new Promise(function(resolve) {

		setTimeout(resolve, time)

	});

}