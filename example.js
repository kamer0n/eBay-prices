import * as puppeteer from 'puppeteer';
import { Coin } from './coin.js';
import { getDB, addCoin, decomposeDB } from './firebase_functions.js';

const searchTerm = "gibraltar one pound coin 2012";
const formattedSearchTerm = searchTerm.replace(/[ ]/g, '+');
console.log(formattedSearchTerm);


(async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.goto(`https://www.ebay.co.uk/sch/i.html?_nkw=${formattedSearchTerm}&rt=nc&LH_Sold=1&LH_Complete=1`);
	const listings = await page.$$(".s-item, .s-item__pl-on-bottom");

	let coinList = [];
	wait(5000);
	for (let i = 0; i < listings.length; i++) {
		let before_answer = false;

		if ((await (await listings[i].getProperty('className')).jsonValue()).includes('s-item__before-answer')) {
			before_answer = true;
		}
				
		const listingTitle = await listings[i].$('.s-item__title, .s-item__title--has-tags');
		const listingTitleDirty = (await (await listingTitle.getProperty('innerText')).jsonValue());
		const listingTitleText = listingTitleDirty.replace(/[^A-Za-z0-9 ]+/g, "");

		const listingPrice = await listings[i].$('.s-item__price');
		const listingPriceText = (await (await listingPrice.getProperty('innerText')).jsonValue());

		const shippingPrice = await listings[i].$('.s-item__shipping, .s-item__logisticsCost');
		if (!shippingPrice) {
			continue
		}
		const shippingPriceText = (await (await shippingPrice.getProperty('innerText')).jsonValue());

		const soldDate = await listings[i].$('div.s-item__title--tagblock > span.POSITIVE');
		if (!soldDate) {
			continue
		}
		const soldDateText = (await (await soldDate.getProperty('innerText')).jsonValue());

		//console.log(listingTitleText + " " + listingPriceText + " " + shippingPriceText + " " + soldDateText);

		let newCoin = new Coin(listingTitleText, listingPriceText, shippingPriceText, soldDateText);
		coinList.push(newCoin);

		if (before_answer) {
			i = listings.length;
		}

	}

	var db = getDB();
	try {
		const groups = groupBye("date", coinList);
	
		for (let j = 0; j < groups.length; j++) {
			await addCoin(db, searchTerm, groups[j]['items']);
		};
		console.log("database updated")
	  } catch (err) {
		console.error("Failed to update database", err);
	  }
	db.goOffline();
	console.log(decomposeDB(db));


	await page.screenshot({path: 'example.png', fullPage: true});

	await browser.close();
})();

async function wait(time) {

	return new Promise(function(resolve) {

		setTimeout(resolve, time)

	});

}

function groupBye(key, array) {
	var result = [];
	for (var i = 0; i < array.length; i++) {
	  var added = false;
	  for (var j = 0; j < result.length; j++) {
		if (result[j][key] == array[i][key]) {
		  result[j].items.push(array[i]);
		  added = true;
		  break;
		}
	  }
	  if (!added) {
		var entry = {items: []};
		entry[key] = array[i][key];
		entry.items.push(array[i]);
		result.push(entry);
	  }
	}
	return result;
  }