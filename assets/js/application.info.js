Application.prototype.info = function(input, msg, _class, icon) {
	this.removeInfos(input);
	var $input = $(input);
	$input.addClass(_class);
	var $msg = $('<small/>')
		.attr('class', 'val-message ' + _class)
		.text(msg);
	if (icon) {
		var $icon = $('<span class="val-icon ' + _class + '"><div class="icon-box"><svg class="icon" viewBox="0 0 100 100"><use xlink:href="#svg-icon-' + icon + '"></use></svg></div></span>');
		$input.after($icon);
	}
	$input.after($msg);
};

Application.prototype.error = function(input, msg, icon) {
	icon = icon ? 30 : 0;
	this.info(input, msg, 'error', icon);
};

Application.prototype.success = function(input, msg, icon) {
	icon = icon ? 31 : 0;
	this.info(input, msg, 'success', icon);
};

Application.prototype.removeInfos = function(inputs) {
	var _removeInfos = function(input) {
		var $input = $(input);
		$input.removeClass('error');
		$input.removeClass('success');
		$input.nextAll('small.val-message').remove();
		$input.nextAll('span.val-icon').remove();
	};
	$(inputs).each(function() {
		_removeInfos(this);
	});
};

Application.prototype.removeErrors = function(inputs) {
	this.removeInfos(inputs);
};

Application.prototype.removeSuccesses = function(inputs) {
	this.removeInfos(inputs);
};

Application.prototype.infoBox = function(container, msg, addNew, _class) {
	if (!addNew) this.removeInfoBoxes();
	if (!_class) _class = '';
	var $alertBox = $('<div class="module alert-box ' + _class + '">' + msg + '<a href="#" class="close">&times;</a></div>');
	var $container = $(container);
	$container.prepend($alertBox);
};

Application.prototype.errorBox = function(container, msg, addNew) {
	this.infoBox(container, msg, addNew, 'alert-box--error');
};

Application.prototype.successBox = function(container, msg, addNew) {
	this.infoBox(container, msg, addNew, 'alert-box--success');
};

Application.prototype.removeInfoBoxes = function(container, _class) {
	var $container = $(container || 'body');
	if (!_class) _class = '';
	else _class = '.' + _class;
	$container.find('div.alert-box' + _class).remove();
};

Application.prototype.removeErrorBoxes = function(container) {
	this.removeInfoBoxes(container, 'alert-box--error');
};

Application.prototype.removeSuccessBoxes = function(container) {
	this.removeInfoBoxes(container, 'alert-box--success');
};

Application.prototype.alert = function(message, close) {
	this.popMessage({message: message});
};

Application.prototype.popMessage = function(args) {
	if (!args) args = {};
	var _conf = {
		buttons: { 'Done': 'App.uiModal.close()' }
	}
	$.extend(_conf, args);
	if (!_conf.buttons) _conf.buttons = { "Done": function() { App.uiModal.close(); } };
	var $textDiv = $('<div class="message-text">');
	if (_conf.message) $textDiv.html(_conf.message);
	var $messageDiv = $('<div class="message">')
		.append($textDiv);
	var buttonClass = 'button--secondary';
	for (var name in _conf.buttons) {
		var $a = $('<a class="button">')
			.addClass(buttonClass)
			.text(name)
			.attr('onclick', _conf.buttons[name]);
		$messageDiv.append($a);
		buttonClass = 'button--tertiary';
	}
	var $modalDiv =	$('<div class="hide">')
		.attr('id', 'alert-modal')
		.append($messageDiv);
	$('#alert-modal').remove();
	$('body').append($modalDiv);
	App.uiModal.open('#alert-modal');
}