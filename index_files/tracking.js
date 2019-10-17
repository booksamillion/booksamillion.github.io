// ////////////////////////////////////////////////////////////////////////////////
// Transmit Google Universal Analytics Tracking object if needed
//	orderDetails is an array of objects, each of which contain a summary and an items array
//
//	orderDetails[i].summary looks like
//	{
//	'id': 		$ga_order_id,	// order ID - required
//	'affiliation': 'Books-A-Million',	// affiliation or store name
//	'revenue':	$ga_total,	// order total - NOT listed as required per the google docs, but - certainly necessary
//	'shipping':	$ga_shipping,	// shipping costs
//	'tax':		$ga_tax});	// tax
//	}
//
//	orderDetails[i].items is an array of items, each of which looks like
//	{
//	'id': 		$items_ref->{'sid'},		// Order ID - required
//	'name':		$items_ref->{'title'},		// Product Name - required
//	'sku':		$items_ref->{'pid'},		// SKU / code
//	'category':	$ga_product,			// Category or variation
//	'price':		$items_ref->{'club_price'},	// SKU / code
//	'quantity':	$items_ref->{'qty_ord'}});	// Quantity
//	}
function track_google_universal_analytics(action,orderDetails) {
	if (typeof ga == 'undefined') {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		// Create the ga object
		ga('create', 'UA-2131347-1', 'auto', {'allowLinker': true});
		ga('require', 'linker');
	}

	var linkTo = (/^https/.test(location.protocol)) ? 'booksamillion.com' :  'secure.booksamillion.com';
	ga('linker:autoLink',[linkTo]);

	// Add action dimensions if received
	if (action != null) {
		ga('set', 'dimension1',action);
		if (/Complete/i.test(action)) { // possible use. otherwise, action itself may be 'Converted'
			ga('set', 'dimension2','Converted');
		}
	}
	// Send the pageview and dimensions
	ga('send', 'pageview');

	// the orderDetails object is populated by //ncom_3_0/stores/bam/cgi/order
	// ONLY defined upon order completion
	if (typeof orderDetails != "undefined" && orderDetails.length >= 1) {
	//	REQUIRE the e-commerce plugin AFTER creating the tracker object, but before first use
		ga('require', 'ecommerce');

		orderDetails.forEach( function(order) {
			ga('ecommerce:addTransaction', order.summary); 
			order.items.forEach( function(item) { ga('ecommerce:addItem', item); });
		});

	//	Send transaction and item data to Google Analytics.
		ga('ecommerce:send');
	}
}


// OwnerIQ response to whether this needed to be JS global or not was ambiguous
// At time of development, one vendor (YA) required a global for a similar variable, setting this to be JS global
var _oiq_lifecycle = 'rcpt'; window._oiqq = window._oiqq || []; 
function track_ownerIQ_conversion(orderDetails) {
	if (orderDetails && orderDetails.length >= 1) {
		orderDetails.forEach(function(order) {
			_oiqq.push(['oiq_addPageLifecycle', _oiq_lifecycle]); 
			_oiqq.push(["oiq_addCustomKVP",["total_cost_notax",order.summary.revenue]]);
			_oiqq.push(["oiq_addCustomKVP",["customer_type",customerType]]);
			_oiqq.push(["oiq_addCustomKVP",["customer_value",customerValue]]);
		//	_oiqq.push(["oiq_addCustomKVP",["customer_id",customerRID]]);
			_oiqq.push(["oiq_addCustomKVP",["order_id",order.summary.id]]);
			dataLayer[1].purchaseQuantity = orderDetails.length;
			// Item details - FOR EACH item sold, push the addItemDetail operation
			// as an array of [ PID/SKU, QTY, PRICE ]
			for (var i=1; i<= order.items.length; i++) {
				item = order.items[i-1];
				_oiqq.push(["oiq_addCustomKVP",["title_" + i,item.name]]);  // == item.title
				_oiqq.push(["oiq_addCustomKVP",["gtin_" + i,item.sku]]);    // == item.isbn / pid
				_oiqq.push(["oiq_addCustomKVP",["quantity_" + i,item.quantity]]);
				_oiqq.push(["oiq_addCustomKVP",["price_" + i,item.price]]); // == unit price
				_oiqq.push(['oiq_doTag']); 
			}
			(function() { 
				var oiq = document.createElement('script'); oiq.type = 'text/javascript'; oiq.async = true; 
				oiq.src = document.location.protocol + '//px.owneriq.net/stas/s/ag3rxq.js'; 
				var oiq_doctitle = 'Default Conversion - do not edit'; 
				if (typeof document != 'undefined' && document){ if(document.title!=null && document.title!='') {oiq_doctitle = document.title; } } 
				var oiq_conv = document.createElement('script'); oiq_conv.type = 'text/javascript'; oiq_conv.async = true; 
				oiq_conv.src = document.location.protocol + '//px.owneriq.net/j?pt=ag3rxq&s='+_oiq_lifecycle+'&sConvTitle='+oiq_doctitle+'&cnv=true';
				var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(oiq, s); 
				s.parentNode.insertBefore(oiq_conv, s); 
			})();
		});
	}
}
