BAMM.clipping = {
	
	element:false,
	counter:0,
	
	drawTime:2000,
	drawTimeout:false,
	
	clearTime:1500,
	clearTimeout:false,
	
	/**
	 * Show
	 *
	 * @access public
	 * @param object
	 * @return NULL
	 */
	show:function(search)
	{
		this.element = search.e;
		
		if(BAMM.clipping.drawTimeout)
		{
			clearTimeout(BAMM.clipping.drawTimeout);
		}
		
		BAMM.clipping.drawTimeout = setTimeout(BAMM.clipping._startDrawing.bind(BAMM.clipping, search), this.drawTime);
		
		this.element.observe('mouseout', BAMM.clipping._clearDrawTimeout.bind(BAMM.clipping));
	},
	
	/**
	 * Clear the Draw Timeout
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_clearDrawTimeout:function()
	{
		if(BAMM.clipping.drawTimeout)
		{
			clearTimeout(BAMM.clipping.drawTimeout);
		}
	},
	
	/**
	 * Start Counter
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_startDrawing:function(search)
	{
		if(!this.element.counter) this.element.counter = ++this.counter;
		
		var clipping = $('clipping');
		if(!clipping || (clipping && clipping.counter != this.element.counter))
		{
			BAMM._fetch({
				content: 'clipping',
				data: search,
				bind: BAMM.clipping,
				pre: BAMM.clipping._setLoader,
				post: BAMM.clipping._drawClipping
			});
		}
		
		this.element.observe('mouseout', BAMM.clipping._pauseForClearClipping.bind(BAMM.clipping));
		this.element.observe('mousemove', BAMM.clipping._mouseOverClipping.bind(BAMM.clipping));
	},
	
	/**
	 * Set Loader
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_setLoader:function(element)
	{
		
	},
	
	/**
	 * drawClipping
	 *
	 * @access private
	 * @param object
	 * @return NULL
	 */
	_drawClipping:function(r)
	{
		if($('clipping-wrap')) $('clipping-wrap').remove();
		
		$(document.body).insert(r.responseText);
		
		var clipping = $('clipping');
		clipping.counter = this.element.counter;
		
		clipping.wrap('div', {id:'clipping-wrap'});
		var clipping_wrap = $('clipping-wrap');
		
		if(!document.all) clipping_wrap.setStyle({position:'absolute'});
		
		var clipping_top = new Element('div', {id:'clipping-top'});
		clipping_wrap.insert({top:clipping_top});
		
		var clipping_bottom = new Element('div', {id:'clipping-bottom'});
		clipping_wrap.insert(clipping_bottom);
		
		var clipping_arrow = new Element('div', {id:'clipping-arrow'});
		clipping_wrap.insert({top:clipping_arrow});
		
		var documentWidth = document.body.offsetWidth;
		
		var anchorAbsolutePosition = Position.cumulativeOffset(this.element);
		var anchorPagePosition = Position.page(this.element);
		
		var anchorWidth = this.element.offsetWidth;
		var anchorHeight = this.element.offsetHeight;
		var anchorTop = anchorAbsolutePosition[1];
		var anchorLeft = anchorPagePosition[0];
		
		var anchorRelativePosition = Position.page(this.element);
		var anchorRelativeTop = anchorRelativePosition[1];
		
		var clippingWidth = clipping_wrap.offsetWidth;
		var clippingHeight = clipping_wrap.offsetHeight;
		var clippingLeft = (anchorLeft+((anchorWidth/2)-(clippingWidth/2)));
		
		if(clippingLeft < 10) clippingLeft = 10;
		if(clippingLeft + clippingWidth > documentWidth) clippingLeft = documentWidth - clippingWidth - 10;
		
		clipping_wrap.setStyle({position:'absolute', left:clippingLeft+'px'});
		
		if(clippingHeight < anchorRelativeTop-16)
		{
			clipping_wrap.setStyle({top:(anchorTop-clippingHeight-16)+'px'});
			clipping_wrap.addClassName('wrap-down');
		}
		else
		{
			clipping_wrap.setStyle({top:(anchorTop+anchorHeight+16)+'px'});
			clipping_wrap.addClassName('wrap-up');
		}
		
		clipping_arrow.setStyle({left:(anchorLeft-clippingLeft+(anchorWidth/2)-(clipping_arrow.offsetWidth/2))+'px'});
		
		if(document.all)
		{
			clipping.id = 'clipping-ie-wrap';
			clipping.wrap('div', {id:'clipping'});
			
			var clipping_bg = new Element('div', {id:'clipping-bg'});
			clipping.insert({before:clipping_bg});
			
			clipping_bg.setStyle({height:(clipping.offsetHeight+20)+'px'});
		}
		
		clipping_wrap.setOpacity(0);
		clipping_wrap.setStyle({visibility:'visible', height:clipping_wrap.offsetHeight+'px'});
		
		new Effect.Opacity(clipping_wrap, {duration:0.25, from:0, to:1});
		
		clipping_wrap.observe('mouseout', BAMM.clipping._pauseForClearClipping.bind(BAMM.clipping, this.element));
		clipping_wrap.observe('mousemove', BAMM.clipping._mouseOverClipping.bind(BAMM.clipping));
	},
	
	/**
	 * Pause for Clear Clipping
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_pauseForClearClipping:function()
	{
		if(this.clearTimeout)
		{
			clearTimeout(this.clearTimeout);
		}
		
		this.clearTimeout = setTimeout(BAMM.clipping._clearClipping.bind(BAMM.clipping), this.clearTime);
	},
	
	/**
	 * Mousing Over Hit
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_mouseOverClipping:function()
	{
		if(this.clearTimeout != false)
		{
			clearTimeout(this.clearTimeout);
		}
	},
	
	/**
	 * Clear Clipping
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_clearClipping:function()
	{
		var clipping_wrap = $('clipping-wrap');
		if(clipping_wrap)
		{
			new Effect.Opacity(clipping_wrap, {duration:0.25, from:1, to:0, afterFinish:function(){
				$('clipping-wrap').remove();
			}});
		}
	}
};