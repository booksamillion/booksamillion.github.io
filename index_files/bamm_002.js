/**
 * Scroll Extension
 *     
 *     Extends our animation library to include scrolling
 *
 * @access 
 * @param 
 * @return 
 */
Effect.Scroll = Class.create(); 
Object.extend(Object.extend(Effect.Scroll.prototype, Effect.Base.prototype), { 
  initialize: function(element) { 
    this.element = $(element); 
    var options = Object.extend({ 
      x:    0, 
      y:    0, 
      mode: 'absolute' 
    } , arguments[1] || {}  ); 
    this.start(options); 
  }, 
  setup: function() { 
    if (this.options.continuous && !this.element._ext ) { 
      this.element.cleanWhitespace(); 
      this.element._ext=true; 
      this.element.appendChild(this.element.firstChild); 
    } 
     
    this.originalLeft=this.element.scrollLeft; 
    this.originalTop=this.element.scrollTop; 
     
    if(this.options.mode == 'absolute') { 
      this.options.x -= this.originalLeft; 
      this.options.y -= this.originalTop; 
    } else { 
     
    } 
  }, 
  update: function(position) {     
    this.element.scrollLeft = this.options.x * position + this.originalLeft; 
    this.element.scrollTop  = this.options.y * position + this.originalTop; 
  } 
});


BAMM.module = {
	
	/**
	 * Large Module Init
	 *
	 * @access public
	 * @param NULL
	 * @return boolean
	 */
	largeModuleInit:function()
	{	
		$$('.module').each(function(module, count)
		{
			/* error check */
			if(module.hasClassName('small')) return;
			if(module.hasClassName('details')) return;
			
			var product_lists = module.getElementsBySelector('.product-list');
			if(product_lists.length == 0) return;
			
			/* assign variables */
			module_id = 'module-'+((count+1)<10?'0':'')+(count+1);
			module.id = module_id;
			
			module.product_list = product_lists[0];
			
			/* loop through product lists */
			for(var i=0; i<product_lists.length; i++)
			{
				var product_list = product_lists[i];
				product_list.count = i;
				product_list.module = module;
				this._createPagination(product_list, module);
			}
		}.bind(this));
	},
	
	/**
	 * Run Init
	 *
	 * @created Wed Apr 16 13:03:51 EDT 2008
	 * @params null
	 * @return void
	 * @author Mark Huot
	 **/
	debug:false,
	runLargeModuleInit:function(module)
	{
		this.debug = true;
		
		/* error check */
		if(module.hasClassName('small')) return;
		if(module.hasClassName('details')) return;
		
		var product_lists = module.getElementsBySelector('.product-list');
		if(product_lists.length == 0) return;
		
		/* assign variables */
		module_id = module.id;
		
		module.product_list = product_lists[0];
		
		/* loop through product lists */
		for(var i=0; i<product_lists.length; i++)
		{
			var product_list = product_lists[i];
			product_list.count = i;
			product_list.module = module;
			
			if($(product_list.parentNode).getElementsBySelector('.arrow-left').length > 0)
			{
				$(product_list.parentNode).getElementsBySelector('.arrow-left').first().remove();
			}
			
			if($(product_list.parentNode).getElementsBySelector('.arrow-right').length > 0)
			{
				$(product_list.parentNode).getElementsBySelector('.arrow-right').first().remove();
			}
			
			if($(product_list.parentNode).getElementsBySelector('.pages').length > 0)
			{
				$(product_list.parentNode).getElementsBySelector('.pages').first().remove();
			}
			
			this._createPagination(product_list, module);
		}
	},
	
	/**
	 * Create Pagination
	 *
	 * @access private
	 * @param NULL
	 * @return NULL
	 */
	_createPagination:function(list, parent)
	{
		/* total width calculation */
		list.setStyle({ position:'absolute', width:'auto', overflow:'visible' });
		var total_width = list.offsetWidth;
		list.setStyle({ position:'', width:'', overflow:'' });
		
		/* clipped width */
		var clipped_width = list.offsetWidth;
		
		/* count pages */
		var total_pages = Math.floor(total_width/clipped_width);
		if(total_width%clipped_width > 97)
		{
			total_pages += 1;
		}
		
		/* assign variables */
		list.total_pages = total_pages;
		list.current_page = 0;
		
		if(total_pages < 2) return;
		
		/* create arrows */
		var left_arrow = new Element('a', { href:'previous', title:'Previous', className:'arrow-left' });
		left_arrow.appendChild(document.createTextNode('Previous'));
		left_arrow.observe('click', BAMM.module.scrollModule.bindAsEventListener(BAMM.module, list, 'left'));
		left_arrow.observe('mouseover', function(event){left_arrow.className = 'arrow-left-over'});
		left_arrow.observe('mouseout', function(event){left_arrow.className = 'arrow-left'});
				
		var right_arrow = new Element('a', { href:'next', title:'Next', className:'arrow-right' });
		right_arrow.appendChild(document.createTextNode('Next'));
		right_arrow.observe('click', BAMM.module.scrollModule.bindAsEventListener(BAMM.module, list, 'right'));
		right_arrow.observe('mouseover', function(event){right_arrow.className = 'arrow-right-over'});
		right_arrow.observe('mouseout', function(event){right_arrow.className = 'arrow-right'});
						
		/* attach DOM */
		list.insert({before:right_arrow});
		list.insert({before:left_arrow});
	},
	
	/**
	 * Scroll Module
	 *
	 * @access public
	 * @param NULL
	 * @return boolean
	 */
	scrollModule:function(event, list, page)
	{
		if(page == 'left') page = list.current_page - 1;
		if(page == 'right') page = list.current_page + 1;
		
		if(page > list.total_pages-1) page = 0;
		if(page < 0) page = list.total_pages-1;
		list.current_page = page;
		
		this._selectPage(list, page);
		new Effect.Scroll(list, {x:this._calculateX(list, page), y:0, duration:.4});
		
		event.stop();
	},
	
	/**
	 * Calculate X
	 *     
	 *     Calculates the x coord for the given page
	 *
	 * @access private
	 * @param DOMNode
	 * @return int
	 */
	_calculateX:function(list, page)
	{
		var targetX = page * list.offsetWidth;
		targetX += 4*list.current_page;
		
		return targetX;
	},
	
	/**
	 * Select Page
	 *
	 * @access private
	 * @param DOMNode
	 * @return NULL
	 */
	_selectPage:function(list, page)
	{
		list.module.getElementsBySelector('.pages .selected').each(function(selected){
			selected.removeClassName('selected');
		});
		
		list.module.getElementsBySelector('.pages .page-'+(page<10?'0':'')+(page+1)).each(function(page){
			page.addClassName('selected');
		});
	},
	
	
	/**
	 * Select All
	 *
	 * @access private
	 * @param array
	 * @return boolean
	 */
	_selectAll:function(elems)
	{
		for(var i=0; i<elems.length; i++)
		{
			$(elems[i]).addClassName('selected');
		}
		
		return true;
	},
	
	/**
	 * Small Module Init
	 *     
	 *     Simple really, we loop through the small modules and count the number of H4/OL pairs.  If
	 *     for some reason the count's don't match up we select everything (so it's all shown).
	 *     
	 *     If they do match up we ensure there is a 'selected' class on a pair, or add it to the
	 *     first pair if there isn't.  We also want to check that there aren't too many 'selected'
	 *     classes, and if there are strip them all out, except for the first
	 *
	 * @access public
	 * @param NULL
	 * @return boolean
	 */
	smallModuleInit:function()
	{
		$$('.module.small').each(function(module)
		{
			var h4s = module.getElementsByTagName('h4');
			var ols = module.getElementsBySelector('.product-list');
			
			if(h4s.length == 0 || ols.length == 0 || h4s.length != ols.length || (h4s.length == 1 && ols.length == 1))
			{
				BAMM.module._selectAll(h4s);
				BAMM.module._selectAll(ols);
				
				return;
			}
			
			for(var i=0; i<ols.length; i++)
			{
				Element.extend(ols[i]);
				
				ols[i] = ols[i].wrap('div', {className:'product-wrap'});
			}
			
			var sel = module.getElementsBySelector('.selected');
			var h4Sel = false;
			var olSel = false;
			for(var i=0; i<sel.length; i++)
			{
				Element.extend(sel[i]);
				
				if(h4Sel != false && sel[i].nodeName.toLowerCase() == 'h4') sel[i].removeClassName('selected');
				if(olSel != false && sel[i].nodeName.toLowerCase() == 'ol') sel[i].removeClassName('selected');
				
				if(sel[i].nodeName.toLowerCase() == 'h4') h4Sel = sel[i];
				if(sel[i].nodeName.toLowerCase() == 'ol') olSel = sel[i];
			}
			
			if(h4Sel == false)
			{
				h4Sel = $(h4s[0]);
				h4Sel.addClassName('selected');
			}
			
			if(olSel == false)
			{
				olSel = BAMM._nextSibling(h4Sel);
				olSel.addClassName('selected');
			}
			
			if(BAMM._nextSibling(h4Sel) != olSel)
			{
				BAMM.module._selectAll(h4s);
				BAMM.module._selectAll(ols);
				
				return;
			}
			
			for(var i=0; i<h4s.length; i++)
			{
				$(h4s[i]).observe('mouseover', BAMM.module.expandOlTimer);
				$(h4s[i]).observe('closeOl', BAMM.module.contractOl);
			}
			
		});
		
		return true;
	},
	
	/**
	 * Prevent Flickers
	 *
	 * @access public
	 * @param Event
	 * @return NULL
	 */
	expandOlTimer:function(e)
	{
		if(typeof expandTimeout == 'undefined') expandTimeout = false;
		
		clearTimeout(expandTimeout);
		expandTimeout = setTimeout(BAMM.module.expandOl.bind(null, e), 200);
	},

	/**
	 * Small Module Effects
	 *
	 * @access public
	 * @param Event
	 * @return NULL
	 */
	expandOl:function(e)
	{
		var h4 = Event.element(e);
		if(h4.hasClassName('selected')) return;
		
		var list = BAMM._nextSibling(Event.element(e));
		
		h4.addClassName('selected');
		list.addClassName('selected');
		
		list.style.position = 'absolute';
		list.style.display = 'block';
		list.style.width = '100%';
		list.style.height = 'auto';
		list.style.visibility = 'hidden';
		
		var targetHeight = list.offsetHeight;
		list.targetHeight = targetHeight;
		
		list.style.position = '';
		list.style.height = '0';
		list.style.visibility = 'visible';
		
		$(h4.parentNode).getElementsBySelector('h4.selected').each(function(openH4)
		{
			if(openH4 == h4) return;
			openH4.fire('closeOl');
		});
		
		new Effect.Morph(list,
		{
			style:{height:targetHeight+'px'},
			duration:.3,
			afterFinish:function(effect)
			{
				if(effect.element.offsetHeight == effect.element.targetHeight)
				{
					effect.element.style.height = 'auto';
				}
			}
		});
	},
	contractOl:function(e)
	{
		var h4 = Event.element(e);
		if(!h4.hasClassName('selected')) return;
		
		var list = BAMM._nextSibling(Event.element(e));
		list.style.position = 'relative';
		list.style.display = 'block';
		
		var ol = list.firstChild;
		ol.style.position = 'static';
		
		if(!list.style.height || list.style.height == 'auto')
		{
			list.style.height = (list.offsetHeight)+'px';
		}
		
		h4.removeClassName('selected');
		list.removeClassName('selected');
		
		new Effect.Morph(list,
		{
			style:{height:'0px'},
			duration:.3,
			afterFinish:function(e)
			{
				e.element.style.display = 'none';
			}
		});
	}
};

function loadModule(sID, sUrl) {
	if ($(sID) != null) {
		if (sUrl.indexOf('module_name=') == -1) sUrl += "&module_name=" + sID;

		new Ajax.Updater(sID, sUrl, {
			evalScripts: true, 
			method: 'get',
			onCreate: function() {
					if ($(sID + '_loader') != null) {
						$(sID + '_loader').innerHTML = '<img src=\"http://images.booksamillion.com/images/widgets/ajax-loader.gif\"/>';	
					} else {
						$(sID).innerHTML = '<img src=\"http://images.booksamillion.com/images/widgets/ajax-loader.gif\"/>';	
					}
				}
			});
		$(sID).style.display = 'inline';
	}
}
