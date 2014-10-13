if (typeof jQuery !== 'undefined') {
	(function($) {
		$('#spinner').ajaxStart(function() {
			$(this).fadeIn();
		}).ajaxStop(function() {
			$(this).fadeOut();
		});
	})(jQuery);
}

var App;

$(document).ready(function() {
	App = new Application();
	App.init();
});

function Application() {
	this.ajaxyOn = true;

	// session timout
	this.maxInactiveInterval = 0;
	this.lSesToInterval = 0;
	this.lTimeout = 0;
}

Application.prototype.init = function() {
	this.initUi();
};

Application.prototype.initUi = function(container) {
	if (container === undefined) {
		container = 'body';
	}
	if (!container) {
		return;
	}
	for (var key in this.ui) {
		if (/^init/.test(key)) {
			this.ui[key](container);
		}
	}
};

Application.prototype.ui = {
	initAutocomplete: function(container) {
		if ($.fn.autocomplete) {
			$(container).find('input.autocomplete').each(function() {
				var $input = $(this);
				$input.autocomplete();
			});
		}
	},
	initDatepicker: function(container) {
		if ($.fn.datepicker) {
			$(container).find('input.datepicker').datepicker({
				closeText: 'Clear',
				showButtonPanel: true,
				onClose: function() {
					if ($(window.event.srcElement).hasClass('ui-datepicker-close')) {
						$(this).val('');
					}
				}
			});
		}
	},
	initDdButton: function(container) {
		$(container).find('div.dd-button').each(function () {
			var $dd = $(this);
			var $toggle = $('<a class="toggle expanded">&nbsp;&gt;&nbsp;</a>').click(function() {
				$(this).nextAll('a').toggle();
				$(this).toggleClass('expanded');
			});
			$dd.find('a:first').after($toggle);
			$toggle.click();
		});
	},
	initNumeric: function(container) {
		if ($.fn.numeric) {
			$(container).find('input.numeric').each(function() {
				var $input = $(this);
				$input.numeric();
			});
		}
	},
	initAjaxify: function(container) {
		if ($.fn.ajaxify && App.ajaxyOn) {
			$(container).ajaxify();
		}
	},
	initAjaxyForm: function(container) {
		if ($.fn.ajaxify && App.ajaxyOn) {
			$(container).find('form.ajaxy').each(function() {
				var $form = $(this);
				$(this).submit(function() {
					App.gotoPage($form.attr('action') + '?' + $form.serialize());
					return false;
				});
			});
		}
	},
	initPhone: function(container) {
		if ($.fn.mask) {
			$(container).find('input.phone').each(function() {
				$(this).mask("? (999) 999-9999");
			});
		}
	},
	initNoAjaxCache: function(container) {
		$.ajaxSetup({
			cache: false,
			beforeSend : function(xhr,setting){
				var url = setting.url;
				url = url.replace("&_=","&_ajax_redirect_ts=");
				url = url.replace("?_=","?_ajax_redirect_ts=");
				setting.url = url;
			}
		});
	}
};

Application.prototype.ajax = {
	success: function(data, textStatus, target) {
		App.initUi(target);
	},
	loaded: function(data, textStatus, target) {
		var redirectPtrn = /^__redirect:\s*/;
		if (redirectPtrn.test(data)) {
			App.gotoPage(data.replace(/^__redirect:\s*/, ''));
			return false;
		}
	}
};

Application.prototype.loadRemote = function(url, target, conf) {
	if (conf === undefined) {
		conf = {}
	}
	$.ajax({type: 'GET',
		url: url,
		success: function(data,textStatus) {
			if (App.ajax.loaded(data, textStatus, target) == false) 
				return false;
			if (conf.loaded && conf.loaded(data) == false) 
				return false;
			$(target).html(data);
			App.ajax.success(data, textStatus, target);
			if (conf.success) conf.success(data);
		},
		error: function(XMLHttpRequest,textStatus,errorThrown) {
			
		}
	});
};

Application.prototype.reload = function(target) {
	var ajaxUrl = $(target).data('ajax');
	if (ajaxUrl) {
		App.loadRemote(ajaxUrl, target);
	}
};

Application.prototype.gotoPage = function(url) {
	if (History && History.pushState) {
		if (url != window.location.pathname) {
			History.pushState('', '', url);
		} else {
			$(window).trigger('statechange');
		}
	} else {
		window.location = url;
	}
};

Application.prototype.reloadPage = function() {
	if (History && History.pushState) {
		$(window).trigger('statechange');
	} else {
		window.location.reload();
	}
};

Application.prototype.gotoLastPageMatch = function(pattern, defaultUrl) {
	if (!History || !History.getStateByIndex) {
		if(defaultUrl) {
			this.gotoPage(defaultUrl);
		} else {
			return;
		}
	}
	var _matchesPattern = function(url) {
		if (pattern instanceof RegExp) {
			return url.match(pattern);
		} else {
			return url.indexOf(pattern) > -1;
		}
	}
	for (var i = History.getCurrentIndex(); i >= 0; i--) {
		var url = History.getStateByIndex(i).url
		if (_matchesPattern(url)) {
			this.gotoPage(url);
			break;
		}
	}
	this.gotoPage(defaultUrl);
};

Application.prototype.ajaxyOff = function() {
	this.ajaxyOn = false;
	$('a').addClass('no-ajaxy');
};



Application.prototype.updateLabel = function(sourceFieldValue, labelId) {
	$('label#' + labelId).each(function() {
		$(this).html(sourceFieldValue);
	});
};

Application.prototype.setMaxInactiveInterval = function(interval) {
	this.maxInactiveInterval = interval; 
};

Application.prototype.resetTimeout = function() {
	this.lTimeout = this.maxInactiveInterval;
};

Application.prototype.restartSessionToInterval = function(maxInactiveInterval) {
	if (maxInactiveInterval) {
		this.setMaxInactiveInterval(maxInactiveInterval);
	}
	
	this.resetTimeout();
	if (this.maxInactiveInterval) {
		if (!this.lSesToInterval) { 
			window.clearInterval(this.lSesToInterval);
		}
		this.lSesToInterval = window.setInterval('App.calculateSessionTimeout();', 1000);
	}
};

Application.prototype.calculateSessionTimeout = function() {
	this.lTimeout -= 1;
	var lHrs = Math.floor(this.lTimeout / (60 * 60));
	var lMins = Math.floor((this.lTimeout - (lHrs * 60 * 60)) / 60);
	var lSecs = this.lTimeout % 60;
	var lText = 'Session expires: ';
	if (lHrs > 0) {
		lText += lHrs + ' h ';
	}
	if (lMins > 0) {
		lText += lMins + ' m ';
	}
	lText += lSecs + ' s';
	if (lSecs < 0) {
		lText = '';
	}
	if (lSecs < 0) {
		if (this.lSesToInterval) {
			window.clearInterval(this.lSesToInterval);
			this.lSesToInterval = 0
		}
		window.location.replace("/rem/login?uri=" + window.location.pathname);
	}
};