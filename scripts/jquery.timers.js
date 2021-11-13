/**
 * jQuery.timers - Timer abstractions for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2008/08/26
 *
 * @author Blair Mitchelmore
 * @version 1.0.0
 *
 **/

jQuery.fn.extend({
	everyTime: function(interval, label, fn, times, belay) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, times, belay);
		});
	},
	oneTime: function(interval, label, fn) {
		return this.each(function() {
			jQuery.timer.add(this, interval, label, fn, 1);
		});
	},
	stopTime: function(label, fn) {
		return this.each(function() {
			jQuery.timer.remove(this, label, fn);
		});
	}
});

jQuery.extend({
	timer: {
		guid: 1,
		global: {},
		regex: /^([0-9]+)\s*(.*s)?$/,
		powers: {
			// Yeah this is major overkill...
			'ms': 1,
			'cs': 10,
			'ds': 100,
			's': 1000,
			'das': 10000,
			'hs': 100000,
			'ks': 1000000
		},
		timeParse: function(value) {
			if (value == undefined || value == null)
				return null;
			var result = this.regex.exec(jQuery.trim(value.toString()));
			if (result[2]) {
				var num = parseInt(result[1], 10);
				var mult = this.powers[result[2]] || 1;
				return num * mult;
			} else {
				return value;
			}
		},
		add: function(element, interval, label, fn, times, belay) {
			var counter = 0;
			
			if (jQuery.isFunction(label)) {
				if (!times) 
					times = fn;
				fn = label;
				label = interval;
			}
			
			interval = jQuery.timer.timeParse(interval);

			if (typeof interval != 'number' || isNaN(interval) || interval <= 0)
				return;

			if (times && times.constructor != Number) {
				belay = !!times;
				times = 0;
			}
			
			times = times || 0;
			belay = belay || false;
			
			if (!element.$timers) 
				element.$timers = {};
			
			if (!element.$timers[label])
				element.$timers[label] = {};
			
			fn.$timerID = fn.$timerID || this.guid++;
			
			var handler = function() {
				if (belay && this.inProgress) 
					return;
				this.inProgress = true;
				if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
					jQuery.timer.remove(element, label, fn);
				this.inProgress = false;
			};
			
			handler.$timerID = fn.$timerID;
			
			if (!element.$timers[label][fn.$timerID]) 
				element.$timers[label][fn.$timerID] = window.setInterval(handler,interval);
			
			if ( !this.global[label] )
				this.global[label] = [];
			this.global[label].push( element );
			
		},
		remove: function(element, label, fn) {
			var timers = element.$timers, ret;
			
			if ( timers ) {
				
				if (!label) {
					for ( label in timers )
						this.remove(element, label, fn);
				} else if ( timers[label] ) {
					if ( fn ) {
						if ( fn.$timerID ) {
							window.clearInterval(timers[label][fn.$timerID]);
							delete timers[label][fn.$timerID];
						}
					} else {
						for ( var fn in timers[label] ) {
							window.clearInterval(timers[label][fn]);
							delete timers[label][fn];
						}
					}
					
					for ( ret in timers[label] ) break;
					if ( !ret ) {
						ret = null;
						delete timers[label];
					}
				}
				
				for ( ret in timers ) break;
				if ( !ret ) 
					element.$timers = null;
			}
		}
	}
});

if (jQuery.browser.msie)
	jQuery(window).one("unload", function() {
		var global = jQuery.timer.global;
		for ( var label in global ) {
			var els = global[label], i = els.length;
			while ( --i )
				jQuery.timer.remove(els[i], label);
		}
	});

function checkIsInsterKey(width, height, sessionKeyValue) {
	$("body").append('<div id="dialogTjgis" align="left" title="天津市地理信息系统" style="display:none;color:red;font-size: 13px;"></div>');
	$(document).everyTime(1000, function(i) {// 1秒，检测一次
		var title = "";
		var info = "";
		var isIe = false;
		var browserInfo = "“未知”";
		if($.browser.msie) {
			isIe = true;
			var jdxxKey = jdxxusbkey.GetInfo();
			if (!(jdxxKey=='-1' || jdxxKey=='-2' || jdxxKey=='-4')) {
				if (undefined != sessionKeyValue && (-1 == sessionKeyValue.indexOf(jdxxKey))) {
					info = "系统检测到当前插入的密钥值和你用户所绑定的密钥值不匹配，请核查！"; 
					$("#dialogTjgis").text(info).dialog({
						width: width,
						height: height,
						resizable: false,
						open: function() {
							$(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar-close").remove();
						},
						modal : true
					});
				} else {
					$("#dialogTjgis").dialog("close");
				}
			} else {
				info = "未检测到USBKEY设备，请插入USBKEY设备！"; 
				$("#dialogTjgis").text(info).dialog({
					width: width,
					height: height,
					resizable: false,
					open: function() {
						$(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar-close").remove();
					},
					modal : true
				});
			}
		} else if($.browser.safari) {
			browserInfo = "“safari or chrome”";
		} else if($.browser.mozilla) {
			browserInfo = "“mozilla”";
		} else if($.browser.opera) {
			browserInfo = "“opera”";
		}
		if(!isIe){
			info = '系统检测到您当前使用的是<span id="browserInfo" style="font-weight:bold;">'+browserInfo+'</span>浏览器，由于系统升级使用密钥登陆，所以请使用<span style="font-weight:bold;">“IE”</span>浏览器登陆！';
			$("#dialogTjgis").html(info).dialog({
				width: width,
				height: height,
				resizable: false,
				//show: 'blind',
				//hide: 'blind',
				//position:['right','bottom'],
				open: function() {
					$(this).parents(".ui-dialog:first").find(".ui-dialog-titlebar-close").remove();
				},
				modal : true
			});
		}
	});
}