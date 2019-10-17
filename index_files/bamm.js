/* 
 * bamm.utility.js
 *
 * $Id: //ncom_3_0/booksamillion.com/htdocs/javascript/bamm.utility.js#86 $
 * $Date: 2019/09/27 $
 * 
 * BAMM.COM javascript library, where all the one off utility functions go.
 *
 */


// Check (or un-check) ALL checkboxes displayed per the checkbox with id 'checkall'
function un_check(){
	var prods = $j_1_11(':input');
	var state = $j_1_11('#checkall').is(':checked');
	for (var i = 0; i < prods.length; i++) {
		var e = prods[i];
		if ((e.id != 'checkall') && (e.type == 'checkbox')) {
			e.checked = state;
		}
	}
}

function show_zip (event) {
	//Leave cookie until it is changed by selecting a store
	$j_1_11("#store-locator2,#store-locator2-link").show();
	$j_1_11("#search-zip2").attr("placeholder","Enter ZIP Code");

	var myStoreCookie = atob(Cookies.get('_bamsi') || '' );
	if(myStoreCookie){
		var myStoreInfo = myStoreCookie.split('|');
		$j_1_11("#search-zip2").val(myStoreInfo[9]);
	}

	$j_1_11("#search-zip2").show();
	$j_1_11('#search-zip2').focus();
	$j_1_11('body').bind("click",closezip );
	if(event.currentTarget === $j_1_11("div.changeStoreButton")[0]){
		$j_1_11("#selectedStore").hide();
		$j_1_11(".changeStoreButton").off("click keydown", show_zip);
	}
}

// so clicking from outside will close zip box but not if you click on the store selector
function closezip (event) {
	if(!$j_1_11(event.target).closest('#store-locator2-container').length    //zip code entry container
	&& !$j_1_11(event.target).is('#store-locator2-container')
	&& !$j_1_11(event.target).closest('.changeStoreButton').length   // change store button container
	&& !$j_1_11(event.target).is('.changeStoreButton')
	&& !$j_1_11(event.target).closest('.set_store').length
	&& !$j_1_11(event.target).is('.set_store')
	&& !$j_1_11(event.target).is('i.material-icons.md-15') ) {  // icon on header where you change the store
		$j_1_11("#store-locator2,#zip-error-div2").hide();
		$j_1_11('body').unbind("click",closezip );
	}
}

function engageMagnusTD(formId) {
//	pass the active formId to Magnus via Cookie, engageMagnusTD
/*
	var theDate = new Date();
	var minutes = 15;
	theDate.setTime(theDate.getTime() + (minutes * 60 * 1000));
	Cookies.set("FORM_ID", formId, { expires: theDate }); // allow 15 minutes to enter login credentials
	_MAGNUS_201();
*/
}

$j_1_11(function() {
	$j_1_11("#store-locator2").submit(
		function( e ) {
			$j_1_11("#search_help2").trigger( "click" );
			e.preventDefault();
			return false;
		}
	);

	$j_1_11("#search_help2").on("click keydown",
		function( event ) {
			if( ( event.type == 'click' )  || ( event.type == 'keydown' && event.which  == 13 ) ) {
				$j_1_11('#zip-error-div2').hide();
				$j_1_11('#selectable-stores2').hide();
				$j_1_11("#selectable-stores2").html('');
				storesinzipcode("setMyStore");
			}	
		}
	);

	$j_1_11( "#selectable-stores2" ).selectable(	{
		 "stop": function(event, ui){
				$j_1_11(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
			},
		filter: "li",
		cancel: "a",
	   }).hide();
	   
	var selected_store_click = function(e) {
		if($j_1_11('#selectedStore').is(":visible")) {
				$j_1_11("#selectedStore").hide();
		} else {
				if ( $j_1_11(e.target).is(".setStoreText") ) {
					return;
				}
				var myStoreCookie = atob(Cookies.get('_bamsi') || '' );
				var myStoreInfo = myStoreCookie.split('|');

				var myStoreHTML = '<div id="selectedStoreImageDiv"><img src="' + myStoreInfo[8] + '" alt="Store ' + myStoreInfo[1] + ' Picture"></div>' +
								'<div style="float:right; width: 250px; color:#000;"><div style="font-size: 20px;">Store #'+myStoreInfo[0]+ ' ' +myStoreInfo[1]+'</div><br>Address: ' +myStoreInfo[2] +
								'<br>' + myStoreInfo[6] + ', ' + myStoreInfo[4] + ' ' + myStoreInfo[5] +
								'<br>Phone: ' + myStoreInfo[3];
				
				    var hours = $j_1_11(".store_hdr_info").data("be-hours").split("|");
				    
					
					var currentHours = getCurrentStoreHours(hours);
						
					myStoreHTML += "<br>"+currentHours;
					
					
				
				     myStoreHTML += '<div class="changeStoreButton" tabindex="0"><div class="changeStoreBtnText">Change Store</div> <div class="changeStoreIcon"><i style="font-size: 21px;" class="material-icons md-15"></i></div></div>';

				$j_1_11('#selectedStore').html(myStoreHTML);

				$j_1_11("#selectedStore").show();
				
				$j_1_11(".changeStoreButton").on("click keydown", show_zip);
	



		}
		e.stopImmediatePropagation();
	};   

	$j_1_11( "#selectable-stores2" ).on( "selectableselected", function( event, ui ) {
		var selected_element_id = $j_1_11(event.target).children('.ui-selected').attr("id");
		var store = selected_element_id.replace(/store_/g, '');
		$j_1_11( "#selectable-stores2").data("myselectedstore",store);
		//Extract data stored in selected li
		var address = $j_1_11( "#selectable-stores2  #store_"+store).data("address");
		var phone = $j_1_11( "#selectable-stores2  #store_"+store).data("phone");
		var shortname =	 $j_1_11( "#selectable-stores2  #store_"+store).data("shortname");
		var state  =  $j_1_11( "#selectable-stores2  #store_"+store).data("state");
		var zipcode =  $j_1_11( "#selectable-stores2  #store_"+store).data("zipcode");
		var city = $j_1_11( "#selectable-stores2	 #store_"+store).data("city");
		var miles = $j_1_11( "#selectable-stores2  #store_"+store).data("distance-miles");
		var be_image_url = $j_1_11( "#selectable-stores2  #store_"+store).data("be_image_url");
		var be_hours = $j_1_11( "#selectable-stores2  #store_"+store).data("businesshours");
		var zipcodein = $j_1_11("#search-zip2").data("zip_in");
		phone = phone.replace(/[{()}]/g, '');
		if(store){
			var exdate=new Date();
			exdate.setDate(exdate.getDate() + 90/* days */);
			document.cookie = "_bamsi=;expires=Thu, 01-Jan-70 00:00:01 GMT;Path=/;domain=.booksamillion.com;";
			var cookie_string = btoa(store + "|" +shortname + "|" + address + "|" + phone + "|" + state + "|" + zipcode + "|" + city + "|" + miles + "|" + be_image_url + "|" + zipcodein);
			cookie_string = "_bamsi=" + cookie_string + ";expires=" + exdate.toUTCString() + ";Path=/;domain=.booksamillion.com;";
			document.cookie = cookie_string;
			$j_1_11('#store-locator2').hide();
			if ( document.location.href.match(/booksamillion.com\/p/) ) {
				location.reload();
			} else if (document.location.href.match(/booksamillion.com\/cart/)) {
				$j_1_11('.loading-container').slideDown('1000');
				$j_1_11('form[name="cart"]').submit();
			} else {
				var storeName;
				if(shortname.length > 11) {
					storeName = shortname.substring(0, 11) + "...,";
				} else {
					storeName = shortname + ",";
				}
				if ( $j_1_11(".store_hdr_info").data("store-there") ) { 
					$j_1_11("#viewSelectedStore").html("My Store:"+ storeName +" " + state);
				} else {
					$j_1_11("#store_hdr-container").html('<span title="My Store" style="padding: 0 6px;"><a href="javascript:void(0)" id="viewSelectedStore">My Store: '+ storeName + state + '</a></span> <a class="store_hdr_info" data-store-there="1" data-be-hours="' + be_hours + '" href="javascript:void(0)" ><i style="margin-top:-6px;" class="material-icons md-15">&#xe8d1;</i></a>');
					$j_1_11("#viewSelectedStore").on("click",selected_store_click );
					$j_1_11(".store_hdr_info").on("click", show_zip);			
				}
				$j_1_11(".store_hdr_info").data("be-hours",be_hours);
			}
		}
		$j_1_11( "#dialog-nearby-stores2" ).dialog( "close" );
	});

	$j_1_11(".store_hdr_info").on("click", show_zip);

	$j_1_11( "#dialog-nearby-stores2" ).dialog({
	      dialogClass: "nearbyStoresDialog",
		  modal: true,
	      width: 780,
	      position: ( { my: "center", at: "center", of: window } ),
	      open: function(){
			$j_1_11('.ui-widget-overlay').bind('click',close_sp);
			$j_1_11('#dialog-nearby-stores2').dialog('option', 'position', { my: "center", at: "center", of: window });
		},
	      close: function() {
			$j_1_11('.ui-widget-overlay').unbind('click',close_sp);
		}
	});

	function close_sp(evt) {
		closeSP();
	}

	var styles = {
      backgroundColor : "#7c98ab",
      width : "750px",
	  color : "#FFF"
    };
	$j_1_11(".ui-dialog-titlebar,.ui-dialog-content,.ui-widget-content").css("width", "750px");
	$j_1_11(".ui-dialog-titlebar").css(styles);
	$j_1_11(".ui-dialog-titlebar").css("font-weight", "bold");
	$j_1_11(".ui-dialog-content,.ui-widget-content").css("backgroundColor", "#fcfcfc");
	$j_1_11( "#dialog-nearby-stores2" ).dialog("close");
	$j_1_11('div[aria-describedby="dialog-nearby-stores2"]').width("780px");

	var shadowStyle = {
		backgroundColor : "rgba(0,0,0,.6)",
		zIndex : "100",
		height : "100%",
		width : "100%"
	};
	$j_1_11("#shadowbox_container").css(shadowStyle);
	
	$j_1_11("#viewSelectedStore").on("click",selected_store_click );

	var selectedStore = $j_1_11("#selectedStore");

	$j_1_11(document).on("click", function(e) {

		if(!selectedStore.is(e.target) && selectedStore.has(e.target).length === 0) {
			selectedStore.hide();
		}
		
	});

});

// SP - Store Picker
function closeSP() {
	$j_1_11("#dialog-nearby-stores2").dialog("close");
	$j_1_11("#store-locator2,#zip-error-div2").hide();
}


function getCurrentStoreHours(hours) {
	var initialString = hours;
	var dayCount = initialString.length;

	
	
	for (var x = 0; x < dayCount; x++) {
		var dayHourArray = initialString[x].split(" "); //"Mon-Sat 10:00 AM-9:30 PM".split(" ");
		var days = dayHourArray[0].split("-"); //['Mon'],[Sat]
		var day1 = getDayValue(days[0]);
		var day2 = (days.length > 1) ? getDayValue(days[1].substring(0, 3)) : 8;
		var d = new Date();
		var currentDay = d.getDay(); // Returns 4 for Thursday
		var currentHours;
		var currentHoursArray;

		if(day2 != 8) {
			if (currentDay >= day1 && currentDay <= day2) {
				dayHourArray.splice(0, 1);
				currentHours = "Today: "+dayHourArray.join(" ");
				break;
			} else {
				currentHours = "Closed";
			}
		} else if (currentDay == day1) {
				dayHourArray.splice(0, 1);
				currentHours = "Today: "+dayHourArray.join(" ");
				break;	
		} else {
			currentHours = "Closed";
		}
		
	}
	return currentHours;
}


function getDayValue(val) {
	switch (val) {
		case "Mon":
			return 1;
			break;
		case "Tue":
			return 2;
			break;
		case "Wed":
			return 3;
			break;
		case "Thu":
			return 4;
			break;
		case "Fri":
			return 5;
			break;
		case "Sat":
			return 6;
			break;
		case "Sun":
			return 7;
			break;
		default:
			return 8;
			break;
	}
}
