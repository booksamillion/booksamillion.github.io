/* 
	jQuery plugin for sliding the page to the 
	anchor tag clicked on.
*/
(function($) {

	$.fn.linkSlide = function(slideSpeed) {
		var speed = slideSpeed || 1000; 
		this.click(function() {
			$('html, body').animate({
				scrollTop: $('[name="' + $(this).attr('href').substr(1) + '"]').offset().top }, speed
			);

		});
	}

}) (jQuery);
