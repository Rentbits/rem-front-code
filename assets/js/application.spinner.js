Application.prototype.showSpinner = function(target, conf) {
	this.resetTimeout();
	var $target = $(target);
	if (!$target.size()) return;
	
	if ($target.data('spinner')) App.hideSpinner(target);
	
	var _css = { };
	var _offset = 2;
	var _size;
	var _conf = ['large', 'center', 'faded'];
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
		
	} else {
		$.extend(_css, { position: 'absolute',
			left: $target.position().left + $target.width() / 2 - (_size / 2),
			top: $target.position().top + $target.height() / 2 - (_size / 2)
		});
	}
	if (_conf.indexOf('faded') > -1) {
		$target.addClass('faded');
	}
	var spinnerId = 'spinner-' + Math.floor((Math.random() * 10000) + 1);
	$target.data('spinner', spinnerId);
	
	var $spinner = $('<div/>', { "class": 'spinner',
		id: spinnerId,
	}).css(_css);
	if (_conf.indexOf('before') > -1) {
		$target.before($spinner);
	} else {
		$target.after($spinner);
	}
};

Application.prototype.hideSpinner = function(target) {
	var $spinner = $('.spinner');
	var $target
	if (target) {
		$target = $(target);
		$spinner = $('#' + $target.data('spinner'));
	}
	if (!$target) {
		if ($spinner.prev().data('spinner')) {
			$target = $spinner.prev();
		} else {
			$target = $spinner.next();
		}
	}
	$target.removeClass('faded');
	$target.removeAttr('data-spinner');
	$spinner.remove();
};