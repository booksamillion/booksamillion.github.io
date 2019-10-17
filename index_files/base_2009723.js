Event.onDOMReady(function()
{
	var head = document.getElementsByTagName('head').item(0);

	
	var enhanced_css = document.createElement('link');
	enhanced_css.href = 'https://images.booksamillion.com/stylesheets/enhanced_20090723.css';
	enhanced_css.rel = 'stylesheet';
	enhanced_css.media = 'screen, projection';
	enhanced_css.type = 'text/css';
	
	var enhanced_print_css = document.createElement('link');
	enhanced_print_css.href = 'https://images.booksamillion.com/stylesheets/enhanced-print.css';
	enhanced_print_css.rel = 'stylesheet';
	enhanced_print_css.media = 'print';
	enhanced_print_css.type = 'text/css';
	
	head.appendChild(enhanced_css);
	head.appendChild(enhanced_print_css);
});

Event.onDOMReady(function(){
	//BAMM.cart.cartInit();
	BAMM.module.largeModuleInit();
	BAMM.module.smallModuleInit();
	BAMM.tabset.tabsetInit();
	//BAMM.livesearch.init();
	BAMM.refineSearch();
	BAMM.greyInitialValues();
});
