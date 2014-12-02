$.extend(Application.prototype.ui, {
	initAjaxifySpinner: function(container) {
		$('a[data-spinner]').each(function() {
			var $a = $(this);
			$a.bind('ajaxify-click', function(event, target) {
				var $target = $(target);
				App.showSpinner($target, $a.data('spinner'));
				var _ajaxifyComplete = function() {
					App.hideSpinner();
					$target.unbind('ajaxify complete', _ajaxifyComplete);
				};
				$target.bind('ajaxify-complete', _ajaxifyComplete);
			});
		});
	}
})

Application.prototype.showSpinner = function(target, conf) {
	this.resetTimeout();
	var $target = $(target);
	if (!$target.size()) return;
	
	if ($target.data('spinner')) App.hideSpinner(target);
	
	var _css = { };
	var _offset = 2;
	var _size;
	var _conf = ['large', 'center', 'faded'];
	if (!conf) {
		conf = $target.data('spinner');
	}
	if (conf) {
		_conf = conf.replace(/[\s,]+/g,' ').split(' ');
	}

	if (_conf.indexOf('small') > -1) _size = 16;
	else if (_conf.indexOf('medium') > -1) _size = 32;
	else _size = 60;
	
	$.extend(_css, { width: _size + 'px', height: _size + 'px' });
	if (_conf.indexOf('left') > -1) {
		$.extend(_css, { position: 'absolute',
			left: $target.position().left + _offset,
			top: $target.position().top + _offset
		});
	} else if (_conf.indexOf('right') > -1) {
		$.extend(_css, { position: 'absolute',
			left: $target.position().left + $target.outerWidth() - _size - _offset,
			top: $target.position().top + _offset
		});
	} else if (_conf.indexOf('to-left') > -1) {
		$.extend(_css, { position: 'absolute',
			left: $target.position().left - _size - _offset,
			top: $target.position().top + _offset
		});
	} else if (_conf.indexOf('to-right') > -1) {
		$.extend(_css, { position: 'absolute',
			left: $target.position().left + $target.outerWidth() + _offset,
			top: $target.position().top + _offset
		});
	} else if (_conf.indexOf('after') > -1 || _conf.indexOf('before') > -1) {
		$.extend(_css, { display: 'inline' });
	} else if (_conf.indexOf('internal') > -1) {
		var m1 = ($target.outerWidth() - _size) / 2;
		var m2 = 140;
		$.extend(_css, { position: 'relative',
			margin: m1 + 'px ' + m2 + 'px'
		});
	} else {
		var h = Math.min($(window.top).height() - $target.position().top, $target.height());
		$.extend(_css, { position: 'absolute',
			left: $target.position().left + $target.width() / 2 - (_size / 2),
			top: $target.position().top + h / 2 - _size / 2
		});
	}
	if (_conf.indexOf('faded') > -1) {
		$target.addClass('faded');
	}
	var spinnerId = 'spinner-' + Math.floor((Math.random() * 10000) + 1);
	$target.data('_spinner', spinnerId);
	
	var $spinner = $('<div/>', { "class": 'spinner',
		id: spinnerId,
	}).css(_css);
	if (_conf.indexOf('before') > -1) {
		$target.before($spinner);
	} else if (_conf.indexOf('internal') > -1) {
		$target.append($spinner);
	} else {
		$target.after($spinner);
	}
};

Application.prototype.hideSpinner = function(target) {
	var $spinner = $('.spinner:not(.sticky)');
	var $target
	if (target) {
		$target = $(target);
		$spinner = $('#' + $target.data('_spinner'));
	}
	if (!$target) {
		if ($spinner.prev().data('_spinner')) {
			$target = $spinner.prev();
		} else {
			$target = $spinner.next();
		}
	}
	$target.removeClass('faded');
	$target.removeAttr('data-_spinner');
	$spinner.remove();
};