var dataLayer = [];
var loc = "";
var salesForceCart = [];

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

function google_remarketing(funnel, val, pid, cart_prices, qty, sfID, prod_link, prod_image, prodTitle) {
	if (cart_prices == undefined) {
			cart_prices = "";
	}
	if (qty == undefined) {
			qty = "";
	}
	if (sfID == undefined) {
			sfID = "";
	}
	
	if (prod_link == undefined) {
			prod_link = "";
	}
	
	if (prod_image == undefined) {
			prod_image = "";
	}
	
	if (prodTitle == undefined) {
			prodTitle = "";
	}
	
	
	
	if (funnel == "") {
		loc = "home";
	} else if (funnel == "wishlist" || funnel == "storefinder" || funnel == "sitelogin" || funnel == "aboutus" || funnel == "businessservices" || funnel == "giftcards" || funnel == "help" || funnel == "privacy_policy" || funnel == "ncom") {
		loc = "other";
	} else if (funnel == "p") {
		loc = 'product';
	} else if (funnel == "cart" || funnel == "purchase") {
		loc = funnel;
	} else {
		loc = "category";
	} 
	
	


	if (cart_prices != null && cart_prices.length > 0) {
		for (i = 0; i < cart_prices.length; i++) { 
			salesForceCart.push({
				item : pid[i],
				quantity : qty[i],
				price : cart_prices[i]
			});
		}
	}
	
	dataLayer.push({
	  'ecomm_pagetype': loc,
	  'ecomm_totalvalue': val,
	  'ecomm_prodid': pid,
	  'ecomm_cartPrices' : cart_prices,
	  'ecomm_sfCart' : salesForceCart,
	  'ecomm_qty' : qty,
	  'ecomm_prod_link' : prod_link,
	  'ecomm_prod_image' : prod_image,
	  'ecomm_sfID' : sfID,
	  'ecomm_prodTitle' : prodTitle
	});
}