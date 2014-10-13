(function($) {
	$.fn.autocomplete = function(c) {
		this.each(function() {
			if ($(this).is('input') && !$(this).data('autocomplete')) {
				$(this).data('autocomplete', new Autocomplete(this, c));
			}
		});
		return this;
	}
})(jQuery);

function Autocomplete(input, conf) {
	this.conf = {
		activeClass: 'active',
		minLength: 1
	};
	if (!conf) {
		conf = $(input).data('conf');
	}
	if (conf) {
		$.extend(this.conf, conf)
	}
	this.$input = $(input);
	this.isInAutoBox = false;
	this.$input.attr('autocomplete', 'off');
	this.autoBoxId = this.$input.attr('name') + '-autobox';
	this.autoBox$ = "#" + this.autoBoxId;
	this.$autoBox = this.createAutoBox();
	this.preventSubmit = false;
	var _this = this;
	this.$input.keydown(function(event) {
		return _this.keydown(event);
	});
	this.$input.keyup(function(event) {
		return _this.keyup(event);
	});
	this.$input.keypress(function(event) {
		if (_this.preventSubmit) {
			_this.preventSubmit = false;
			event.preventDefault();
			return false;
		} 
	});
	this.$input.blur(function(event) {
		if (!_this.isInAutoBox) {
			_this.hideAutoBox();
		}
	});
}

Autocomplete.prototype.createAutoBox = function() {
	var $autoBox = $('<ul>')
		.css({
			'position': 'absolute'
		})
		.attr('id', this.autoBoxId)
		.addClass('module')
		.addClass('hide')
		.addClass('module--autocomplete');
	var _this = this;
	$autoBox.mouseover(function() {
		_this.isInAutoBox = true;
	});
	$autoBox.mouseout(function() {
		_this.isInAutoBox = false;
	});
	$('body').append($autoBox);
	return $autoBox;
};

Autocomplete.prototype.fillAutoBox = function() {
	this.cleanAutoBox();
	if (this.conf.source instanceof Array) {
		this.populateAutoBox(this.normalizeData(this.conf.source, true));
		return;
	}
	var url = this.conf.source || this.$input.data('url');
	if (url.indexOf('?') > -1) {
		url += '&term=' + this.$input.val();
	} else {
		url += '?term=' + this.$input.val();
	}
	var _this = this;
	$.get(url, function(data) {
		_this.cleanAutoBox();
		_this.populateAutoBox(_this.normalizeData(data));
	});
};

Autocomplete.prototype.populateAutoBox = function(data) {
	var _this = this;
	$.each(data, function(index, row) {
		var $row = $('<li>');
		var $link = $('<a>')
			.attr('href', 'javascript:void()')
			.text(row.label || row.value);
		$row.data('row', row);
		$row.click(function(event) {
			_this.select(event, row);
		});
		$row.append($link);
		_this.$autoBox.append($row);
	});
	_this.showAutoBox();
};

Autocomplete.prototype.normalizeData = function(data, filter) {
	var result = [];
	for (var i = 0; i < data.length; i++) {
		var row = data[i];
		if (typeof row == 'string') {
			result.push({value: row, label: row})
		} else {
			result.push(row)
		}
	}
	if (filter == true) {
		var _this = this;
		result = result.filter(function(row) {
			var str = row.label || row.value;
			return str.toLowerCase().indexOf(_this.$input.val().toLowerCase()) > -1
		});
	}
	return result;
};

Autocomplete.prototype.cleanAutoBox = function() {
	this.$autoBox.children().remove();
};

Autocomplete.prototype.hideAutoBox = function() {
	this.$autoBox.addClass('hide');
};

Autocomplete.prototype.showAutoBox = function() {
	this.$autoBox.removeClass('hide');
	this.$autoBox.css('width', this.$input.outerWidth());
	this.$autoBox.css('top', this.$input.offset().top + this.$input.outerHeight());
	this.$autoBox.css('left', this.$input.offset().left);
};

Autocomplete.prototype.select = function(event, data) {
	this.$input.val(data.value);
	this.hideAutoBox();
	var select = this.conf.select || this.$input.data('select');
	if (!select) {
		return
	}
	if (select instanceof Function) {
		return select(event, data);
	} else if (window[this.$input.data('select')]) {
		return window[this.$input.data('select')](event, data);
	} else {
		window.location = this.$input.data('select') + data.selectValue;
	}
};

Autocomplete.prototype.getActiveItem = function() {
	if (this.$autoBox.is(':visible')) {
		return this.$autoBox.find('.' + this.conf.activeClass);
	}
};

Autocomplete.prototype.keyup = function(event) {
	var key = (event.keyCode) ? event.keyCode : event.which;
	if (this.$input.val().length < this.conf.minLength) {
		this.hideAutoBox();
		return true;
	}
	if ($.inArray(key, [40, 38, 13, 9]) == -1) {
		this.fillAutoBox();
	}
	return true;
};

Autocomplete.prototype.keydown = function(event) {
	var key = (event.keyCode) ? event.keyCode : event.which;
	var $selected = this.getActiveItem();
	if (key == 40) { // down		
		if ($selected.size() == 0) {
			this.$autoBox.find('li:first').addClass(this.conf.activeClass);
		} else {
			$selected.removeClass(this.conf.activeClass);
			$selected.next('li').addClass(this.conf.activeClass);
		}
		event.preventDefault();
		return false;
	} else if (key == 38) { // up
		if ($selected.size() == 0) {
			this.$autoBox.find('li:last').addClass(this.conf.activeClass);
		} else {
			$selected.removeClass(this.conf.activeClass);
			$selected.prev('li').addClass(this.conf.activeClass);
		}
		event.preventDefault();
		return false;
	} else if (key == 13) { // enter
		if ($selected && $selected.size() > 0) {
			this.preventSubmit = true;
			this.select(event, $selected.data('row'));
			event.preventDefault();
			return false;
		} else {
			return true;
		}
	}
	return true;
};