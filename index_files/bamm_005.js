function storelocator () {
	$j_1_11('#store-locator').show().css('display','inline');
	$j_1_11('#search-zip').focus();
}

//select the clicked giftcard (image).
function select_gc(sku) {
	$j_1_11("#gc_sku_" + sku).prop('checked', true);
}

// Dialog for what is a bargain popup 
$j_1_11(function() {
	$j_1_11( "#whatisabargain-icon" ).on ("click keydown",function (e ) {
		if( ((e.type == "keydown") && (e.keyCode == 13)) || (e.type == "click")  )   {
			$j_1_11("#dialog-what-is-a-bargain").dialog("open");
			e.preventDefault();
		}
	}); 
});

$j_1_11(function() {

	$j_1_11( "#dialog-what-is-a-bargain" ).dialog({
	      autoOpen: false,
	      modal: true,
	      width: "auto",
	      height: 198,
	      title : 'What is a BARGAIN item?',
	      position: ( { my: "center", at: "center", of: window } ),
	      resizable: false,
	      open: function(){
			$j_1_11('.whatisabargain-dialog-titlebar').css("width","auto");
			$j_1_11('.ui-widget-overlay').bind('click',close_whatisabargain);
			$j_1_11('#dialog-what-is-a-bargain').dialog('option', 'position', { my: "center", at: "center", of: window });
		},
	      close: function() {
			$j_1_11('.ui-widget-overlay').unbind('click',close_whatisabargain);
	      }
	});	

	$j_1_11(".ui-dialog-titlebar").addClass("whatisabargain-dialog-titlebar");
	$j_1_11(".ui-dialog-content,.ui-widget-content").addClass("whatisabargain-dialog-content");
		
	function close_whatisabargain(evt) {
		$j_1_11("#dialog-what-is-a-bargain").dialog("close");
	}	
});
//End Dialog for what is a bargain popup 

$j_1_11(function() {
	$j_1_11("#store-locator").submit(
		function( e ) {
			$j_1_11("#search_help").trigger( "click" );
			e.preventDefault();
			return false;
		}
	);

	$j_1_11("#search_help").on("click keydown",
		function( event ) {
			if( ( event.type == 'click' )  || ( event.type == 'keydown' && event.which  == 13 ) ) {
				$j_1_11('#zip-error-div').hide();
				$j_1_11('#selectable-stores').hide();
				$j_1_11("#selectable-stores").html('');
				storesinzipcode("stock") ;
			}	
		}
	);

	$j_1_11( "#selectable-stores" ).selectable(	{
		 "stop": function(event, ui){
				$j_1_11(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
			},
		filter: "li",
		cancel: "a",
	   }).hide();

	$j_1_11( "#selectable-stores" ).on( "selectableselected", function( event, ui ) {
		var selected_element_id = $j_1_11(event.target).children('.ui-selected').attr("id");
		$j_1_11( "#selectable-stores").data("myselectedstore",store);
		//Extract data stored in selected li
		var store = $j_1_11( "#selectable-stores").data("myselectedstore");
		var address = $j_1_11( "#selectable-stores  #store_"+store).data("address");
		var phone = $j_1_11( "#selectable-stores  #store_"+store).data("phone");
		var shortname =	 $j_1_11( "#selectable-stores  #store_"+store).data("shortname");
		var state  =  $j_1_11( "#selectable-stores  #store_"+store).data("state");
		var zipcode =  $j_1_11( "#selectable-stores  #store_"+store).data("zipcode");
		var city = $j_1_11( "#selectable-stores	 #store_"+store).data("city");
		var miles = $j_1_11( "#selectable-stores  #store_"+store).data("distance-miles");
		var be_image_url = $j_1_11( "#selectable-stores  #store_"+store).data("be_image_url");
		phone = phone.replace(/[{()}]/g, '');
		var zipcodein = $j_1_11("#search-zip").data("zip_in");
		if(store){
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + 90/* days */);
			document.cookie = "_bamsi=;expires=Thu, 01-Jan-70 00:00:01 GMT;Path=/;domain=.booksamillion.com;";
			var cookie_string = btoa(store + "|" +shortname + "|" + address + "|" + phone + "|" + state + "|" + zipcode + "|" + city + "|" + miles + "|" + be_image_url + "|" + zipcodein);
			cookie_string = "_bamsi=" + cookie_string + ";expires=" + exdate.toUTCString() + ";Path=/;domain=.booksamillion.com;";
			document.cookie = cookie_string;
			$j_1_11('#store-locator').hide();
			location.reload();
		}
		$j_1_11( "#dialog-nearby-stores" ).dialog( "close" );
	});

	$j_1_11( "#close-zip").click(
		function () {
			$j_1_11('#store-locator').hide();
		}
	);

	$j_1_11("#changeMyStore a").on("click keydown",
		function (event) {
			if( ( event.type == 'click' )  || ( event.type == 'keydown' && event.which  == 13 ) ) {
				//Leave cookie until it is changed by selecting a store
				$j_1_11("#store-locator,#store-locator-link").show();
				$j_1_11("#myStoreContainer").hide();
				var myStoreCookie = atob(Cookies.get('_bamsi') || '' );
				if(myStoreCookie){
					var myStoreInfo = myStoreCookie.split('|');
					$j_1_11("#search-zip").val(myStoreInfo[9]);
				}
			}	
		}
	);

	$j_1_11( "#dialog-nearby-stores" ).dialog({
	      modal: true,
	      width: 780,
	      position: ( { my: "center", at: "top+150px", of: "body" } ),
	      open: function(){
			$j_1_11('.ui-widget-overlay').bind('click',close_isa);
			$j_1_11('#dialog-nearby-stores').dialog('option', 'position', 'center');
		},
	      close: function() {
			$j_1_11('.ui-widget-overlay').unbind('click',close_isa);
		}
	});

	function close_isa(evt) {
		closeISA();
	}

	var styles = {
      backgroundColor : "#002855",
      width : "750px",
	  color : "#FFF"
    };
	$j_1_11(".ui-dialog-titlebar,.ui-dialog-content,.ui-widget-content").css("width", "750px");
	$j_1_11(".ui-dialog-titlebar").css(styles);
	$j_1_11(".ui-dialog-titlebar").css("font-weight", "bold");
	$j_1_11(".ui-dialog-content,.ui-widget-content").css("backgroundColor", "#fcfcfc");
	$j_1_11( "#dialog-nearby-stores" ).dialog("close");
	$j_1_11('div[aria-describedby="dialog-nearby-stores"]').width("780px");

	var shadowStyle = {
		backgroundColor : "rgba(0,0,0,.6)",
		zIndex : "100",
		height : "100%",
		width : "100%"
	};
	$j_1_11("#shadowbox_container").css(shadowStyle);

	//google recaptcha
	$j_1_11("#gr_click_here").click(
		function () {
			var secure_url;
			var url = window.location.hostname;
			if(url.match(/dev/g)){
				secure_url = "https://securedev.booksamillion.com/ncom/gift_card_balance";
			} else if(url.match(/qa/g)){
				secure_url = "https://secureqa.booksamillion.com/ncom/gift_card_balance";
			} else {
				secure_url = "https://secure.booksamillion.com/ncom/gift_card_balance";
			}
			var gc_window_ref = window.open(secure_url,'GC balance','location=no,width=430,height=475,top=50,left=400,scrollbars=1');
		}
	);
});

function storesinzipcode (action) {

	var suffix, dialogTitle, locatorID, hideLocator;
	if (/stock/i.test(action)) {
		suffix       =  "";
		dialogTitle  = "In-Store Availability";
		hideLocator  = false;
	} else {
		suffix       =  "2";
		dialogTitle  = "Pick Your Store";
		hideLocator  = true;
	}
	var zipID       = "#search-zip" + suffix;
	var zipcode     = $j_1_11(zipID).val(); 
	var dialogName  = "dialog-nearby-stores" + suffix;
	var dialogID    = "#" + dialogName;
	var zipErrorID  = "#zip-error" + suffix;
	var zipErrDivID = "#zip-error-div" + suffix;
	var selectorID  = "#selectable-stores" + suffix;
	locatorID       = "#store-locator" + suffix;

	var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipcode);
	if(!isValidZip){
	      $j_1_11("#zip-error").html("Invalid zipcode "+encodeURI(zipcode));
	      $j_1_11("#zip-error-div").show();
	      return 0;
	}

	$j_1_11(dialogID).dialog('option', 'title', dialogTitle);

	var mydata = {
	  PostalCode: zipcode,
	  Radius: 50,
	  action:"bullseye",
	  sid:$j_1_11(zipID).data("sid"),
	  pid:$j_1_11(zipID).data("isbn10") || $j_1_11(zipID).data("isbn"),
	  code:$j_1_11(zipID).data("code")||'',
	  StartIndex: 0, PageSize: 25
	};

	/*Call to Bulls Eye Api via BCAP*/
	$j_1_11.ajax( {
	  url: "/bullseye",
	  data: mydata,
	  type: "GET",
	  processData: true,
	  timeout: 10000,
	  dataType: "json",
	  success:
		function(data, status, xhr) {
		     /*	  $j_1_11("div #results").text(data.TotalResults +
		      *	  " total results. " +
		      *	  data.ResultList.length +
		      *	  " elements returned in ResultList."); */
			var selectable_html='';
			if(data.pidinfo){
				$j_1_11(zipID).data("is_isbn",data.pidinfo.is_isbn);
				$j_1_11(zipID).data("pid",data.pidinfo.pid);
				$j_1_11(zipID).data("sku",data.pidinfo.sku);
				$j_1_11(zipID).data("code",data.pidinfo.code);
				$j_1_11(zipID).data("title",data.pidinfo.title);
				$j_1_11(zipID).data("retail_price",data.pidinfo.retail_price);
				$j_1_11(zipID).data("is_isbn",data.pidinfo.is_isbn);
				$j_1_11(zipID).data("image_url",data.pidinfo.image_url);
				$j_1_11(zipID).data("td_url",data.pidinfo.td_url);
				$j_1_11(zipID).data("authors",data.pidinfo.authors);
				$j_1_11(zipID).data("page_count",data.pidinfo.page_count);
				$j_1_11(zipID).data("publish_date",data.pidinfo.publish_date);
				if(data.pidinfo.mmoh){
					$j_1_11.each(data.pidinfo.mmoh,function (store,mmoh ){
						$j_1_11(zipID).data("mmoh_" + store ,mmoh); //This is an mmohs array
						var div = "<div id=mmoh" + store + " style=\"display:none\" data-mmoh_" + store + "="+ mmoh + "</div>";
						$j_1_11(zipID).after(div);
					});
				}

			}
			if(data.userinfo){
				$j_1_11(zipID).data("email",data.userinfo.email);
				$j_1_11(zipID).data("fname",data.userinfo.fname);
				$j_1_11(zipID).data("lname",data.userinfo.lname);
				$j_1_11(zipID).data("uphone",data.userinfo.phone);
			}
			
			if (data && (1 == data.Error)) {
				$j_1_11(zipErrorID).html(data.ErrorText);
				$j_1_11(zipErrDivID).show();
				$j_1_11(zipErrDivID).data("error",1);
			} else if(data.ResultList.length < 1){
				$j_1_11(zipErrorID).html("No stores near "+zipcode);
				$j_1_11(zipErrDivID).show();
				$j_1_11(zipErrDivID).data("error",1);
			} else {
				$j_1_11.each(data.ResultList, function(index,val) {
					var cid           = val.ThirdPartyId;
					var address       = "";
					var checkText     = val.Availability;
					var checkImage 
					= (/IN STOCK/.test(checkText))     ? "instore_check-01" 
					: (/OUT OF STOCK/.test(checkText)) ? "instore_x-01"
					: (/STOCK/.test(checkText))        ? "instore_exclamation-01" : "";
					var checkDetails 
					= ((checkImage && val.AvailDetails) ? val.AvailDetails : "")
					.replace(/unavailable\.\s+/, "unavailable.<br>");

					if (val.Address1.indexOf("Ste") >= 0) {
						address = val.Address1.replace("Ste ", "#");
					} else {
						address = val.Address1;
					}

					//Store data returned from call and stored in li data attributes
					selectable_html += '<li id="store_' + cid + '"data-shortname="' + val.ShortName 
					+ '"data-address="' + val.Address1 
					+ '"data-city="' + val.City + '"data-state="' + val.State + '"data-zipcode="' + val.PostCode 
					+ '"data-phone="' + val.PhoneNumber 
					+ '"data-be_image_url="' + val.ImageFileUrl 
					+ '"data-distance-miles="' + val.Distance 
					+ '"class="ui-widget-content">' 
					+ '<div class="storeAvailabilityRowContainer">'
						+ '<div class="storeAvailabilityLeftCol">'
							+ '<div class="storeAvailabilityStoreImageContainer">'
								+ '<div class="storeAvailabilityStoreImage"><img style="display:inline" src="'
									+ val.ImageFileUrl +'" width="104" height="80" alt="Store ' + val.ShortName + ' picture">'
								+ '</div>' 
								+ '<div class="storeAvailabilityMilageBlock">'+ val.Distance+ ' miles</div>' 
							+ '</div>'
						+ '</div>' 

						+ '<div class="storeAvailabilityAddressBlock">' 
							+ '<h2>'+ val.ShortName+ '</h2><br>'+ val.Address1+ '<br>'+ val.City+ ','+ ' '+ val.State+ ' '+ val.PostCode+ '<br>'+ val.PhoneNumber
						+ '</div>'
						+ '<div class="storeAvailabilityRightCol">'
							//	Store hours and directions
							+	'<div class="storeAvailabilityLinks">'
								+ '<a href="/storefinder">Store Hours & Info</a> | <a href="https://maps.google.com/maps?saddr=&daddr='+address
									+' '+ val.City+ ' ' + val.State + ' ' + val.PostCode +'">Directions'
								+ '</a>'
							+ '</div>'

							+ '<div class="storeAvailabilityStockContainer">';

							// Display stock availability information when present
							if (checkImage) {
							selectable_html
								+= '<div class="storeAvailabilityStockImage">'
								 	+ '<img src="http://images.booksamillion.com/images/item_availability/'+checkImage+'.png" width="40" height="40" alt=""/>'
								+ '</div>'
								+ '<div class="storeAvailabilityStockAvailable"><h3>' + checkText + '</h3>' + checkDetails + '</div>';
							}
							selectable_html
							+= '</div>' // <br clear="all">'
						+ '</div>';

					selectable_html += '<br clear="all"><hr>'
					+ '</div>'
					+ '</li>';
					$j_1_11(selectorID).html(selectable_html);
				});
				$j_1_11(selectorID).show();
				$j_1_11(dialogID).dialog("open");
				if (hideLocator) { $j_1_11(locatorID).hide(); }
				$j_1_11(zipID).data("zip_in",zipcode);
			}
		} ,
	  error:
		function(xhr, status, ex) {
						$j_1_11(zipErrorID).html("An Error Occurred");
						$j_1_11(zipErrDivID).show();
						$j_1_11(zipErrDivID).data("error",1);

		}
	} );
	$j_1_11('div[aria-describedby="' + dialogName + '"]').width("780px");
}

/* Add to cart */
function addtocart (query_vals) {
	var mydata = JSON.parse('{"' + decodeURI(query_vals.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
	mydata.action = "add_to_modal_cart";
	$j_1_11.support.cors = true;
	/*Call to  BCAP Model*/
	$j_1_11.ajax( {
		url: window.location.origin+"/add_to_modal_cart",
		data: mydata,
		type: "POST",
		processData: true,
		timeout: 10000,
		dataType: "json",
		success: function(data, status, xhr) {
			
			//Send Listrak updated cart information
			function LT_send() { 
					/********** Begin Custom Code **********/ 
					
					var ecomm_prodid = data.pid_list;
					var ecomm_qty = data.qty_list;
					var ecomm_cartPrices = data.price_list;
					var ecomm_prodTitle = data.title_list;
					var ecomm_prod_image = data.imageURL_list;
					var ecomm_prod_link = data.prodURL_list;
			   
			   
					var arrayLength = ecomm_prodid.length;
					if (data.total_price != 0) {
						for (var i = 0; i < arrayLength; i++) {
							_ltk.SCA.AddItemWithLinks(ecomm_prodid[i], ecomm_qty[i], ecomm_cartPrices[i], ecomm_prodTitle[i], ecomm_prod_image[i], ecomm_prod_link[i]);
						}

						_ltk.SCA.Submit(); 
				
					} 
				
					/********** End Custom Code **********/ /********** End Custom Code **********/ 
				}
				
			LT_send();
			
			
			if(data.ret_code == 1){
				var bopisAvail    = data.bopisAvail;
				var pickupStore   = data.pickupStore;
				var storeOnhand   = data.storeOnhand;
				var deliveryAvail = data.deliveryAvail;
				var totalQty      = data.qty_ord;
				var currShipAddr  = data.ship_addr;

				var dialog_html =
					'<script>'
				+	'$j_1_11(document).ready(function(){ '
				+	'$j_1_11(".ui-dialog-titlebar").hide();'                 // hide the title bar after rendering the dialog
				+	'$j_1_11(".ui-dialog-content").css("padding", ".25em");' // adjust the dialog content padding after rendering
				+	'$j_1_11(".img").mouseenter(function(){'
				+	'$j_1_11(this).addClass("hover");'
				+	'}) '
				+	'.mouseleave(function(){ '
				+	'$j_1_11(this).removeClass("hover");'
				+	'});'
				+	'});'
				+	'</script>'
				+	'<div class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 96px; max-height: none; height: auto;">'
					// Instead of close, show "Keep Shopping" instead using absolute positioning
					+ 	'<div id="atcCloseBTN" title="Keep Shopping">Keep Shopping</div>'

					// Left, divider, right cart modal content
					+	'<div class="atcWrapper">'
						+	'<div class="atcBold atcHeader">Added to Cart</div>' + '<br>'
						+	atcLeftContent()
						+	'<div class="atcDividerContainer"><hr class="atcVerticalDividerHR"></div>'
						+	atcRightContent()
						+	'<br clear="all">'
						+	atcActionContent()
						+	'<hr class="atcBottomHR">'
						+	cartRecommendations()
					+	'</div> <!-- atcWrapper -->'
				+	'</div> <!-- cart_popup -->';

				$j_1_11("#cart_popup").dialog({
					autoOpen : false,
					modal : true,
					classes: { "ui-dialog": "ui-corner-all atc-dialog" },
					title: "",
					show : "fade",
					hide : "fade",
					width : "750px",
					height : "auto",
					closeText : "Keep Shopping",
					draggable : false,
					resizable : false,
					position: ( { my: "center", at: "top+150px", of: "body" } ),
					open: function(){
						$j_1_11('.ui-widget-overlay').bind('click',function(){ closeATC(); });
					},
					close: function(event, ui) { 
						$j_1_11(this).dialog('close');
						console.log("Popup CLOSED");
					}
				});

				$j_1_11("#cart_popup").dialog("open");
				$j_1_11("#cart_popup").html(dialog_html);

				/* Update the cart items in top of header */
				$j_1_11("#atcSetStore").on("click keydown", atcSetStore);
				$j_1_11("#atcBopisBTN").on("click keydown", function() { atcToggleBopisMethod(query_vals, pickupStore); } );
				$j_1_11("#atcCloseBTN").on("click keydown", function() {  $j_1_11("#cart_popup").dialog("close"); } );
				$j_1_11('#navCartText').html("Cart " + data.items + " ");
				$j_1_11(".ui-dialog-titlebar").css({ "border-style" : "none", "background" : "#F2F5F7" });
				/* Hide checkout button for Ariba orders */
				if(1 == data.ariba) {
					$j_1_11(".atcCheckoutBTN").hide();
				}
			} else {
				console.log("ERROR: add_to_modal_cart returned"+data.response);
			}


			function atcLeftContent() {
				return ""
				+ '<div class="atcLeftContainer">'
				+	'<div class="atcCoverContainer">'
				+		'<a href=' + data.td_url + '>' + '<img src="' + data.image_url	+ '" alt="' + data.title + '" width="125">' + '</a>'
				+	'</div> <!-- atcCoverContainer -->'
				+	'<div class="atcProdInfo"> '
				+		'<span class="atcTitle">'+ data.title +'</span> <br>'
				+		'<span class="atcAuthor">' + data.authors[0] +'</span>'
				+		'<hr class="atcHRqtyTop">'
				+		'<div class="atcPrice">$'+ data.price +'</div>'
				+		'<hr class="atcHRqtyBottom">'
				+		'<div id="atcBopisInfo">' 
				+			atcBopisInfo() + '<br>'
				+		'</div>'
				+	'</div> <!-- atcProdInfo -->'
				+ '</div> <!-- atcLeftContainer -->';
			}

			// cart Total + view cart button
			function atcRightContent() {
				return ""
				+ '<div class="atcRightContainer">'
				+	'<div class="atcRightSubContainer">'
				+		cartTotal() + '<br>'
				+		atcChangeMode()
				+		'<input type="button" value="View Cart ('+ data.items +')" class="atcActionBTN" onclick="location.href=\''+ data.cart_link +'\'">' 
				+	'</div> <!-- atcRightSubContainer -->'
				+ '</div> <!-- /atcRightContainer -->';
			}

			// Modal Cart PRIMARY action: Proceed to Checkout
			function atcActionContent() {
				return ''
				+ '<div class="atcActionContainer">'
				+	'<input type="button" value="Checkout" class="atcCheckoutBTN" onclick="location.href=\''+ data.checkout_link +'\'">'
				+ '</div>';
			}

			// Buy Online / Pickup In-Store - available or not || Set Your Store to enable store pickup
			function atcBopisInfo() {
				var bopisInfo = '';
				if (bopisAvail) {
					if (currShipAddr < -1) {
						bopisInfo = '<i class="material-icons atcBopisMethod">store</i>For Store Pickup<br>';
					} else {
						bopisInfo = '<i class="material-icons atcBopisMethod">local_shipping</i>For Delivery<br>';
						if (pickupStore) {
							if (storeOnhand < 1) {
								bopisInfo += '<br>Not available for pickup<br>at your store.';
							} else if (totalQty > storeOnhand) {
								bopisInfo += '<br>Not available at your store<br>at that quantity.';
							}
						} else {
							bopisInfo += '<br>You must select a store<br>to enable Store Pickup<br>' +
									'<a href="javascript:void(0)" id="atcSetStore">Set My Store</a>';
						}
					}
				}
				return bopisInfo;
			}

			// Allow toggle between store pickup and delivery
			function atcChangeMode() {
				var bopisBTN = '';
				if (bopisAvail) {
					if (currShipAddr < -1) {
						if (deliveryAvail) {
							bopisBTN = '<input type="button" id="atcBopisBTN" class="atcActionBTN" value="Change to Delivery"><br>';
						}
					} else if (pickupStore && (storeOnhand >= totalQty)) {
						bopisBTN = '<input type="button" id="atcBopisBTN" class="atcActionBTN" value="Change to Store Pickup"><br>';
					}
				}
				return bopisBTN;
			}

			// cart total heading and value
			function cartTotal() {
				//console.log("Data: "+data.toString());
				return ""
				+ '<span class="atcBold atcTotalText">Total in Cart</span> <br>'
				+	'<hr class="atcCartTotalHR">'
				+	'<span class="atcTotal">$' + data.total_price + '</span>';
			}

			function cartRecommendations() {
				var recommendations = '';
				if(data.recommendations){
					// recommendations is an associative array of different elements, each of which is an array - all having the same length:
					// title, add_to_cart_link, td_url, image_url, authors, and price are used here
					// use the length from one of these attributes - title

					// show NO MORE than the first 5 recommendations
					var max = Math.min(data.recommendations.title.length,5);
					for (i=0; i<max; i++) {
						var clear_both = (i % 12 == 0) ? "clear:both;" : "";
						var img_html =
						"<div class='atcSuggestProductContainer' style='" + clear_both + "'>" +
							'<div class="prod-image-container effects effect-2" >' +
								'<div class="img" style="width: 120px;">' +
									'<a href="' + data.recommendations.td_url[i] + '">' +
										'<img src="' + data.recommendations.image_url[i]  + '" alt="' + data.recommendations.title[i] + '" style="width: 120px;" class="product-image">' +
									'</a>' +
									
									
									
									'<div class="overlay">' +
										'<a href="'+ data.recommendations.add_to_cart_link[i] +'" class="expand"><i class="material-icons md-36 md-dark atcIcon" style="margin: 10px 0 0 9px; cursor: pointer; font-size: 36px;">&#xe854;</i></a>' +
										'<a class="close-overlay hidden">x</a>' +
									'</div> <!-- atcSuggestCartImageOverlay -->'+
									
									
								'</div> <!-- atcSuggestProdImage -->' +
							'</div> <!-- atcSuggestImageContainer -->' +
							'<div class="atcSuggestProductInfoContainer">' +
								'<div class="atcSuggestProdInfo">' +
									'<a href="' + data.recommendations.td_url[i] + '"> <strong>' + data.recommendations.title[i] + '</strong> <br>' + data.recommendations.authors[i] + ' <br> $' +	 data.recommendations.price[i] + '</a>' +
								'</div>' +
							'</div> <!-- atcSuggestProductInfoContainer -->' +
						"</div> <!-- atcSuggestProductContainer -->";
						//console.log(i + ': ' + data.recommendations.add_to_cart_link[i]);
						recommendations +=img_html;
					}
				}
				return "" +
						'<div class="atcGuestsAlsoViewedContainer">' +
							'<div class="atcGuestsAlsoViewed">Guests Also Viewed</div>' +
							recommendations +
						'</div> <!-- atcGuestsAlsoViewedContainer -->';
			}

		} ,
		error: function(xhr, status, ex) { console.log("ERROR: Ajax Failure "+status); }
	} );
}

function atcToggleBopisMethod(query_vals, pickupStore) {
	var mydata = JSON.parse('{"' + decodeURI(query_vals.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');
	mydata.action = "add_to_modal_cart";
	mydata.subaction = "toggle_bopis_method";
	mydata.pickupStore = pickupStore;

	/*Call to BCAP Model*/
	$j_1_11.ajax( {
		url: window.location.origin+"/add_to_modal_cart",
		data: mydata,
		type: "POST",
		processData: true,
		timeout: 10000,
		dataType: "json",
		success: function(data, status, xhr) {
			if(data.ret_code == 1){

				var deliveryHTML = '<i class="material-icons atcBopisMethod">local_shipping</i>For Delivery<br>';
				var pickupHTML = '<i class="material-icons atcBopisMethod">store</i>For Store Pickup<br>';

				if (data.newMethod == "delivery") {
						$j_1_11("#atcBopisInfo").html(deliveryHTML);
						$j_1_11("#atcBopisBTN").val("Change to Store Pickup");
				} else {
						$j_1_11("#atcBopisInfo").html(pickupHTML);
						$j_1_11("#atcBopisBTN").val("Change to Delivery");
				}

			} else {
				console.log("ERROR: add_to_modal_cart (toggle BOPIS method) returned"+data.response);
			}
		} ,
		error: function(xhr, status, ex) { console.log("ERROR: Ajax Failure "+status); }
	} );
}

function atcSetStore(event) {
	closeATC();
	show_zip(event);
	$j_1_11("#store-locator2").css("background-color", "#D6D2C4").fadeOut(300).fadeIn(300).fadeOut(250).fadeIn(250);
}

function closeATC() {
	$j_1_11("#cart_popup").dialog("close");
}

//ISA - In Store Availability
function closeISA() {
	$j_1_11("#dialog-nearby-stores").dialog("close");
}


// jQuery plugin to prevent double submission of forms
$j_1_11.fn.preventDoubleSubmission = function() {
  $j_1_11(this).on('submit',function(e){
    var $form = $(this);

    if ($form.data('submitted') === true) {
      // Previously submitted - don't submit again
      e.preventDefault();
    } else {
      // Mark it so that the next submit can be ignored
      $form.data('submitted', true);
    }
  });

  // Keep chainability
  return this;
}
