var exclude=1;
var agt=navigator.userAgent.toLowerCase();
var win=0;var mac=0;var lin=1;
if(agt.indexOf('win')!=-1){win=1;lin=0;}
if(agt.indexOf('mac')!=-1){mac=1;lin=0;}
var lnx=0;if(lin){lnx=1;}
var ice=0;
var ie=0;var ie4=0;var ie5=0;var ie6=0;var com=0;var dcm;
var op5=0;var op6=0;var op7=0;
var ns4=0;var ns6=0;var ns7=0;var mz7=0;var kde=0;var saf=0;
if(typeof navigator.vendor!="undefined" && navigator.vendor=="KDE"){
	var thisKDE=agt;
	var splitKDE=thisKDE.split("konqueror/");
	var aKDE=splitKDE[1].split("; ");
	var KDEn=parseFloat(aKDE[0]);
	if(KDEn>=2.2){
		kde=1;
		ns6=1;
		exclude=0;
		}
	}
else if(agt.indexOf('webtv')!=-1){exclude=1;}
else if(typeof window.opera!="undefined"){
	exclude=0;
	if(/opera[\/ ][5]/.test(agt)){op5=1;}
	if(/opera[\/ ][6]/.test(agt)){op6=1;}
	if(/opera[\/ ][7-9]/.test(agt)){op7=1;}
	}
else if(typeof document.all!="undefined"&&!kde){
	exclude=0;
	ie=1;
	if(typeof document.getElementById!="undefined"){
		ie5=1;
		if(agt.indexOf("msie 6")!=-1){
			ie6=1;
			dcm=document.compatMode;
			if(dcm!="BackCompat"){com=1;}
			}
		}
	else{ie4=1;}
	}
else if(typeof document.getElementById!="undefined"){
	exclude=0;
	if(agt.indexOf("netscape/6")!=-1||agt.indexOf("netscape6")!=-1){ns6=1;}
	else if(agt.indexOf("netscape/7")!=-1||agt.indexOf("netscape7")!=-1){ns6=1;ns7=1;}
	else if(agt.indexOf("gecko")!=-1){ns6=1;mz7=1;}
	if(agt.indexOf("safari")!=-1 || (typeof document.childNodes!="undefined" && typeof document.all=="undefined" && typeof navigator.taintEnabled=="undefined")){mz7=0;ns6=1;saf=1;}
	}
else if((agt.indexOf('mozilla')!=-1)&&(parseInt(navigator.appVersion)>=4)){
	exclude=0;
	ns4=1;
	if(typeof navigator.mimeTypes['*']=="undefined"){
		exclude=1;
		ns4=0;
		}
	}
if(agt.indexOf('escape')!=-1){exclude=1;ns4=0;}
if(typeof navigator.__ice_version!="undefined"){exclude=1;ie4=0;}

BAMM.tabset = {
	
	/**
	 * Tabset Ini
	 *
	 * @access public
	 * @param NULL
	 * @return boolean
	 */
	tabsetInit:function()
	{
		$$('.tabset').each(function(tabset)
		{
			if(tabset.nodeName.toLowerCase() == 'dl' && !tabset.hasClassName('vertical')) return;
			if(tabset.hasClassName('search')) return;
			
			var tabs = tabset.getElementsBySelector('.tab');
			var tab_content = tabset.getElementsBySelector('.tab-content');
			
			if(tabs.length != tab_content.length) return;
			
			var tab_container = new Element('div', {className:'tab-container'});
			tabset.insert({top:tab_container});
			
			var selected = 0;
			
			tabs.each(function(tab, count)
			{
				var tab_anchors = tab.getElementsByTagName('a');
				if(tab_anchors.length > 0 && tab_anchors[0].parentNode == tab)
				{
					anchor = $(tab_anchors[0]);
					var tabText = anchor.innerHTML;
				}
				else
				{
					var anchor = new Element('a');
					
					var tabText = tab.innerHTML;
					anchor.innerHTML = tabText;
				}
				
				var tabId = BAMM._dirify(tabText);
				
				anchor.href = '#'+tabId;
				anchor.id = 'tab-'+tabId;
				anchor.tabset = tabset;
				anchor.tab = tab;
				anchor.tab_content = tab_content[count];
				anchor.observe('click', BAMM.tabset._tabSwitch);
				
				tab.innerHTML = '';
				tab.insert(anchor);
				
				regex = new RegExp(tabId+'$');
				if(document.location.toString().match(regex))
				{
					tab.addClassName('selected');
					tab_content[count].addClassName('selected');
					
					selected = count;
				}
				else
				{
					tab.removeClassName('selected');
					tab_content[count].removeClassName('selected');
					
					tab_content[count].style.display = 'none';
				}
				
				if($(tabset.parentNode).getElementsBySelector('.product-actions').first())
				{
					/* image has height fix */
					var product_actions = $(tabset.parentNode).getElementsBySelector('.product-actions').first();
					var target_height = product_actions.offsetHeight;
					var actual_height = tab_content[count].offsetHeight;
					
					if(product_actions.select('img').first())
					{
						var img = product_actions.select('img').first();
						if(!img.height || img.height < 241)
						{
							target_height+= 241
						}
					}
					/* end image has height fix */
					
					if(ie6)
					{
						// if(actual_height < target_height)
						// {
							// tab_content[count].style.minHeight = (target_height-291)+'px';
							tab_content[count].style.height = (target_height-291)+'px';
						// }
					}
					else
					{
						// if(actual_height < target_height)
						// {
							tab_content[count].style.minHeight = (target_height-291)+'px';
						// }
					}
				}
				
				tab_container.insert({bottom:tab});
			});
			
			tabs[selected].addClassName('selected');
				
			tab_content[selected].addClassName('selected');
			tab_content[selected].style.display = 'block';
		});
		
		return true;
	},
	
	/**
	 * Tab Switch
	 *
	 * @access private
	 * @param Event
	 * @return NULL
	 */
	_tabSwitch:function(e)
	{
		var anchor = Event.element(e);
		var tabset = $(anchor.tabset);
		var tab = $(anchor.tab);
		var tab_content = $(anchor.tab_content);
		
		tabset.getElementsBySelector('.selected').each(function(element)
		{
			element.removeClassName('selected');
			if(element.hasClassName('tab-content'))
			{
				element.style.display = 'none';
			}
		});
		
		tab.addClassName('selected');
		tab_content.addClassName('selected');
		tab_content.style.display = 'block';
	},
	
	/**
	 * Switch Ajax Tab
	 *
	 * @access private
	 * @param element
	 * @return NULL
	 */
	_ajaxTabSwitch:function(e)
	{
		var anchor = e;
		var tabset = $(anchor.parentNode.parentNode.parentNode);
		var tab = $(anchor.parentNode);
		tabset.getElementsBySelector('.selected').each(function(element)
		{
			element.removeClassName('selected');
		});
		
		tab.addClassName('selected');
	},
	
	/**
	 * Fetch Tab Content
	 *
	 * @created Wed Apr 16 12:00:11 EDT 2008
	 * @params null
	 * @return void
	 * @author Mark Huot
	 **/
	fetchTabContent:function(p)
	{
		var date = new Date();
		var ajaxReq = new Ajax.Request('/minicomp?id='+p.id+'&'+p.tn+'='+p.tc+'&tp='+p.tp+'&ta='+p.ta+'&wide='+p.wide, 
		{
			method: 'get',
			onSuccess: this.returnTabContent.bind(this, p.e)
		});
	},
	
	/**
	 * Return Tab Content
	 *
	 * @created Wed Apr 16 12:06:03 EDT 2008
	 * @params null
	 * @return void
	 * @author Mark Huot
	 **/
	returnTabContent:function(e, req)
	{
		var module = $(e.parentNode.parentNode.parentNode);

		var old = module.select('.product-list').first();

		old.replace(req.responseText);

		this._ajaxTabSwitch(e);

		BAMM.module.runLargeModuleInit(module);

	}
};
