/* 
	General Methods 
*/

// Don't conflict Prototype's use of the $ var.
// var $j_1_11 = jQuery.noConflict();

// If jQuery is available but $j_1_11 just not yet defined, go ahead & define it
if (typeof $j_1_11 == 'undefined' && window.jQuery) {
	jqversion = jQuery.fn.jquery.split('.');
	if (jqversion[0] >= 1 && jqversion[1] >= 10) { $j_1_11 = jQuery.noConflict(); }
}

if ($j_1_11) {
jqueryBamm = true;

$j_1_11(document).ready(function() {
	/*
		Site Navigation delayed activation handling. 
	*/
	var navArray = [
		'#home', 
		'#books',
		'#toys',
		'#kidsamillion',
		'#teen',
		'#nook',
		'#ebooks',
		'#tech2',
		'#entertainment',
		'#magazine',
		'#bargains',
		'#more'
	];
	for (var i = 0; i < navArray.length; i++) {
		/* 
			open delay and animation for the site navigation drop downs
		*/
		$j_1_11('#header #nav ' + navArray[i]).hover(function() {
			/* close any that might be open because of animation delay */
			for (var i = 0; i < navArray.length; i++) {
				$j_1_11(this).children('ul').stop().hide();
			}
			$j_1_11(this).children('ul').delay(500).fadeIn();
			$j_1_11(this).children('a').addClass('active-header-nav-button-rounded');
		}, function() {
			$j_1_11(this).children('ul').stop().hide();
			$j_1_11(this).children('a').removeClass('active-header-nav-button-rounded');
		});
	}

	/*
		Other formats open animation
	*/
	if ($j_1_11('#displayText').length > 0) {
		$j_1_11('#displayText').click(function() {
			$j_1_11('#toggleText').slideToggle(800);
		});
	}
/*
	if ($j_1_11('#goodreads-reviews').length > 0) {
		$j_1_11.getScript('//js.booksamillion.com/javascript/jquery/plugins/jquery.goodreads.js', function(data, textStatus, jqxhr) {
            console.log(textStatus);
            console.log(jqxhr.status);
            console.log('goodreads loaded');
			if (bookIsbn) {
				$j_1_11('#goodreads-reviews').getGoodReadsReviews(bookIsbn);	
			}
        });
	}
*/

	/*
		Move videos embedded into the overview up to the top of the page.
	*/
	if ($j_1_11('#overview').length > 0) {
		if ($j_1_11('#overview object').length > 0) {
				$j_1_11('#titledetail-video-content').append($j_1_11('#overview object').clone()).html();
				$j_1_11('#overview object').remove();	
		}
	}


	/* 
		Apply link sliding to all the anchor tags on the page. 
	*/
	$j_1_11('a[href^=\\#]').each(function() {
		$j_1_11(this).linkSlide(800);
	});

	/*
		Title detail page image gallery handling
	*/	
	if ($j_1_11('.image-gallery-thumbnails').length > 0) {

		/* the main '0' image was src'd during page load,
			now we try to load all the alternates. Trying
			to speed up delivery once hovered over, without 
			slowing down the main page load
		*/

		var gallerysize = $j_1_11('.image-gallery-thumbnails').children('img').length;
		for (var i = 1; i < gallerysize; i++) {
			var theimageid = "#titledetail-prod-image_" + i;
			var theimage = $j_1_11(theimageid);
			var thedest = theimage.attr('data-rel');
			theimage.attr('src', thedest);
		}
			
	

		/* Resize the top of the page to accomodate the thumbnails */
		/* 
		 	increase and decrease the top columns on the titledetail page by 37 pixels, (32 for the image, 5 for a right margin)	
		*/

		$j_1_11('.image-gallery-thumbnails .image-gallery-thumbnail').hover(function() {
			/* set the border on the thumbnail */
			$j_1_11(this).css('border-color', 'rgb(72, 183, 232)').css('cursor','pointer');

			/* hide all the children */
			$j_1_11('.image-gallery-main-image-container').children('a').hide();

			/* and show the one corresponding to the thumbnail over which we are hovering */
			var index = $j_1_11(this).attr('data-index');
			var theimagelink = ".titledetail-prod-image-link_" + index;
			$j_1_11(theimagelink).show();

		}, function() { 
			$j_1_11(this).css('border-color', '');
		});	
	} else {
		var imgSideWidth = $j_1_11('#details-imgage').width(); 
		var detSideWidth = $j_1_11('#details-block').width();
	$j_1_11('#details-imgage').css('width', (imgSideWidth - 32));
		$j_1_11('#details-block').css('width', (detSideWidth + 32));
	}

//	when the search field gains focus, select whatever text is present
	$j_1_11("#query").focus(function() {
		// Select the contents of the search field on focus
		this.select();
	});
});

/* Handle search type-ahead / auto-complete.  Don't wait for the whole document to be ready, just the query field */
$j_1_11("#query").ready(function() {
//	on submit - close the TypeAhead suggestion list - open or not
	$j_1_11('#query').closest('form').on('submit', function () { $j_1_11('#query').bamComplete('close'); });

	function highlightText(text, $node) {
		var searchText = $j_1_11.trim(text).toLowerCase(), currentNode = $node.get(0).firstChild, matchIndex, newTextNode, newSpanNode;
		while ((matchIndex = currentNode.data.toLowerCase().indexOf(searchText)) >= 0) {
			newTextNode = currentNode.splitText(matchIndex);
			currentNode = newTextNode.splitText(searchText.length);
			newSpanNode = document.createElement("strong");
			currentNode.parentNode.insertBefore(newSpanNode, currentNode);
			newSpanNode.appendChild(newTextNode);
		}
	}

//	Propogate tuning settings from the environment 
	var theDelay = 250;
	if (typeof typeAheadDelay != 'undefined') {
		theDelay = typeAheadDelay;
	}
	var theMinLength = 4;
	if (typeof typeAheadWhen != 'undefined') {
		theMinLength = typeAheadWhen;
	}
	var theResultsPer = 10;
	if (typeof typeAheadResults != 'undefined') {
		theResultsPer = typeAheadResults;
	}

//	Typehead - OFF if typeAheadWhen set as 0 in the environment
	if (theMinLength > 0) {
		$j_1_11.widget( "custom.bamComplete", $j_1_11.ui.autocomplete, {
			_renderMenu: function( ul, items) {
				var one = this, lagCategory = "";
				$j_1_11.each( items, function( index, item) {
					if (item.category != lagCategory) {
						ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>");
						lagCategory = item.category;
					}
					one._renderItemData( ul, item );
				});
			},
			_renderItem: function(ul, item) {
			//	The trailing space is an IE8 only hack fix
			//	Without it - IE8 fails if any suggestion is EXACTLY the search query
				var $a = $j_1_11("<a></a>").text(item.label + " "); 
				highlightText(this.term, $a);
				return $j_1_11("<li class='ui-autocomplete-term'></li>").append($a).appendTo(ul);
			}
	 	});

		var theAuthority = window.location.origin;
		var thePath      = "/search?action=typeahead&Dp=" + theResultsPer;
		$j_1_11( "#query" ).bamComplete({
			appendTo: "#autoContainer",
			delay: theDelay,
			minLength: theMinLength,
			source: function( request, response ) {
				$j_1_11.ajax({
					url:  theAuthority + thePath,
					dataType: "json",
					data: {
						query: request.term + '*'
					}, success: function( data ) { //	traverse each dimension, build the suggestion list for each
						var results = [];
						for (var i=0; i<data.length; i++) {
							var dimensionName = data[i]["dimension"];
							for (var j=0; j<data[i]["suggestions"].length; j++) {
								var item = { category: dimensionName, value: data[i]["suggestions"][j], label: data[i]["suggestions"][j] };
								results.push(item);
							}
						}
						response(results);
					},
					error: function (error) { console.log('failed to receive typeahead response',error); }
				})
			},
			select: function( event, ui ) {
				$j_1_11("#query").val(ui.item.value);
				$j_1_11(this).closest('form').submit();
			}
		});
	}
	$j_1_11( "#query" ).bamComplete({
		appendTo: "#autoContainer"
	});
});

$j_1_11(window).load(function() {
// remove 2007 search input field style mandate, current theme styling is being overwritten!
	$j_1_11("#query").removeClass('grey'); 

//	on rendering, set the initial value of the search field ('#query') to the previously submitted value
//	THIS needs to run LAST - AFTER everything is done, or else the value here becomes the placeholder value of the field
	$j_1_11("#query").val($j_1_11("#queryWas").val()); 
});

} else {
	console.log("jquery 1.11.* not loaded");
}

/* Add to Cart Overlay */
$j_1_11(document).ready(function(){
    if (Modernizr.touch) {
        // show the close overlay button
        $j_1_11(".close-overlay").removeClass("hidden");
        // handle the adding of hover class when clicked
        $j_1_11(".img").click(function(e){
            if (!$j_1_11(this).hasClass("hover")) {
                $j_1_11(this).addClass("hover");
            }
        });
        // handle the closing of the overlay
        $j_1_11(".close-overlay").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            if ($j_1_11(this).closest(".img").hasClass("hover")) {
                $j_1_11(this).closest(".img").removeClass("hover");
            }
        });
    } else {
        // handle the mouseenter functionality
        $j_1_11(".img").mouseenter(function(){
            $j_1_11(this).addClass("hover");
        })
        // handle the mouseleave functionality
        .mouseleave(function(){
            $j_1_11(this).removeClass("hover");
        });
    }
});

//Newsletter Popup
var emailPopup = false;
