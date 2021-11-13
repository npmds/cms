var toast = new Object;
toast.init = function() {
	var modalId=this.generateId();
	var html = '<div id="'+modalId+'" role="dialog" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5>操作提示</h5></div><div class="modal-body"><p style="font-weight:bold"></p></div><div class="modal-footer"><center><button type="button" class="btn btn-success" data-dismiss="modal">我知道了</button></center></div></div></div>';
	$('body').append(html);
	return modalId;
}
toast.clearAlertDiv = function(divId) {
	//console.log("销毁div"+divId);
	$("#" + divId).remove();
};
//deprecated
toast.intervalShow = function(divId) {
	setTimeout(function() {
		$("#" + divId).modal("hide");
		setTimeout(function(){toast.clearAlertDiv(divId);},2000);
	}, 30000);
}
toast.generateId = function() {
	var date = new Date();
	return 'alert_div_container' + date.valueOf();
};
toast.success = function(msg,callback) {
	var modalId=this.init();
	var html = '';
	if (msg) {
		html = '<div class="text-success text-center">'
				+ msg + '</div>';
	} else {
		html = '<div class="text-success text-center"><strong>操作成功!</strong></div>';
	}
	$('#'+modalId).find(".modal-body>p").html(html);
	$('#'+modalId).modal("show");
	var modal=$('#'+modalId);
	if (callback && callback instanceof Function) {
		modal.on('hidden.bs.modal', function(e) {
			//console.log("移除div"+modalId);
			toast.clearAlertDiv(modalId);
			callback();
		});
	}else{
		modal.on('hidden.bs.modal', function(e) {
			//console.log("移除div"+modalId);
			toast.clearAlertDiv(modalId);
		});
	}
	return this;
};
toast.error = function(msg,callback) {
	var modalId=this.init();
	var html = '';
	html = '<div class="text-danger text-center">'
		+ msg + '</div>';
	$('#'+modalId).find(".modal-body>p").html(html);
	$('#'+modalId).modal("show");
	var modal=$('#'+modalId);
	if (callback && callback instanceof Function) {
		modal.on('hidden.bs.modal', function(e) {
			//console.log("移除div"+modalId);
			toast.clearAlertDiv(modalId);
			callback();
		});
	}else{
		modal.on('hidden.bs.modal', function(e) {
			//console.log("移除div"+modalId);
			toast.clearAlertDiv(modalId);
		});
	}
	return this;
};
(function($) {
	toast.confirm = function() {
		var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">'
				+ '<div class="modal-dialog modal-sm">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'
				+ '<h4 class="modal-title" id="modalLabel">[Title]</h4>'
				+ '</div>'
				+ '<div class="modal-body">'
				+ '<p>[Message]</p>'
				+ '</div>'
				+ '<div class="modal-footer">'
				+ '<button type="button" class="btn btn-primary cancel">[BtnCancel]</button>'
				+ '<button type="button" class="btn btn-primary ok">[BtnOk]</button>'
				+ '</div>' + '</div>' + '</div>' + '</div>';
		var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
		var generateId = function() {
			var date = new Date();
			return 'mdl' + date.valueOf();
		}
		var init = function(options) {
			options = $.extend({}, {
				title : "操作确认框",
				message : "提示内容",
				btnok : "确定",
				btncl : "取消",
				width : 200,
				auto : false
			}, options || {});
			var modalId = generateId();
			var content = html.replace(reg, function(node, key) {
				return {
					Id : modalId,
					Title : options.title,
					Message : options.message,
					BtnOk : options.btnok,
					BtnCancel : options.btncl
				}[key];
			});
			$('body').append(content);
			$('#' + modalId).modal({
				width : options.width,
				backdrop : 'static'
			});
			$('#' + modalId).on('hide.bs.modal', function(e) {
				console.log("执行隐藏时方法");
			});
			return modalId;
		}
		return {
			show : function(options) {
				var $object=new Object();
				$object.id=Math.random();
				$object.okEvents=[];
				$object.cancelEvents=[];
				$object.doOkFunc=function(){
					for(var $i=0;$i<this.okEvents.length;$i++){
						console.log("执行ok方法:"+$i);
						this.okEvents[$i]();
					}
				};
				$object.doCancelFunc=function(){
					for(var $i=0;$i<this.cancelEvents.length;$i++){
						console.log("执行cancel方法:"+$i);
						this.cancelEvents[$i]();
					}
				};
				var id = init(options);
				console.log("新确认框对象:"+$object.id);
				$object.id=id;
				var modal = $('#' + id);
				modal.find('.ok').removeClass('btn-primary').addClass(
						'btn-success');
				modal.find('.cancel').show();
				modal.find('.ok').click(function() {
					modal.on('hidden.bs.modal', function(e) {
						modal.remove();
						$object.doOkFunc();
					});
					modal.modal("hide");
				});
				modal.find('.cancel').click(function() {
					modal.on('hidden.bs.modal', function(e) {
						modal.remove();
						$object.doCancelFunc();
					});
					modal.modal("hide");
				});
				return {
					id : id,
					bind : function(callbackOk, callbackCancel) {
						if (callbackOk && callbackOk instanceof Function) {
							$object.okEvents.push(callbackOk);
						}
						if (callbackCancel && callbackCancel instanceof Function) {
							$object.cancelEvents.push(callbackCancel);
						}
					}
				};
			}
		}
	}();
})(jQuery);