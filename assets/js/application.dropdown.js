function Dropdown(el, config) {
	this.config = {
		triggerSelector: '[data-dropdown-trigger]',
	};
	if (!config) config = {};
	$.extend(this.config, config)
	this.$dropdown = $(el);
	this.$trigger = this.$dropdown.find(this.config.triggerSelector);
	this.$target = this.$dropdown.find(this.$trigger.data('dropdown-trigger'));
	this.$body = $('body');
	this.closeTime = null;
	this.init();
}

Dropdown.prototype.open = function() {
	var $trigger = this.$trigger;
	var $target = this.$target;
	var self = this;
	if ($target && $target.length) {
		this.close();
		var positionLeft = $trigger.position().left + ($trigger.outerWidth(true)/2) - ($target.width()/2);
				positionLeft = Math.ceil(positionLeft);
		var positionTop = ($trigger.parent().height() * 0.5) + ($trigger.height() * 0.7);
				positionTop = Math.ceil(positionTop);
		$target.toggleClass('open closed');
		if ($target.hasClass('pull-right')) {
			$target.css({
				'top' : positionTop + 'px',
				'right' : Math.ceil($trigger.position().left + ($trigger.outerWidth(true)/2) - ($trigger.outerWidth(true)/3)) + 'px',
			});
		} else if ($target.hasClass('pull-left')) {
		} else {
			$target.css({
				'top' : positionTop + 'px',
				'left' : positionLeft + 'px',
			});
		}
		$('<div class="dropdown-backdrop"/>').insertAfter(document.body).on('click', function () {
			self.close();
			var onClose = $trigger.data('dropdown-on-close');
			if (onClose) { eval(onClose); }
		});
	}
};

Dropdown.prototype.close = function() {
	var closeFn = this.$trigger.data('dropdown-on-close');
	if (window[closeFn]) {
		window[closeFn](this.$dropdown);
	}
	this.$body.find('.dropdown-target').addClass('closed').removeClass('open');
	$('.dropdown-backdrop').remove();
};

Dropdown.prototype.init = function() {
	var self = this;
	if (!this.$dropdown.hasClass('lazy')) {
		this.$target.find('a').click(function() { self.close(); });
	}
	if (!this.$dropdown.hasClass('sticky')) {
		this.$target.mouseleave(function() { 
			self.closeTimer = setTimeout(function() { self.close(); }, 2500);
		});
		this.$target.mouseenter(function() { clearTimeout(self.closeTimer); });
	}
	this.$trigger.click(function() {
		if (self.$target.hasClass('open')) {
			self.close();
		} else {
			self.open();
		}
		event.preventDefault();
	});
	var href = this.$trigger.attr('href');
	if (!href || this.$trigger.attr('href').indexOf('#') != 0) {
		this.$trigger.mouseenter(function() { self.open(); });
		this.$trigger.mouseleave(function() {
			self.closeTimer = setTimeout(function() { self.close(); }, 300);
		});
	}
};

$.extend(Application.prototype.ui, {
	initDropdowns: function(container) {
		var $dropdowns = $(container).find('div.dropdown');
		$dropdowns.each(function() {
			var $dropdown = $(this);
			if ($dropdown.data('dropdown')) return;
			$dropdown.data('dropdown', new Dropdown($dropdown));
		});
	}
});
