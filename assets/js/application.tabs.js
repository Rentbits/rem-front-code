$.extend(Application.prototype.ui, {
	initTabsSpinner: function(container) {
		var $tabs = $(container).find('div.tabs');
		if ($tabs.data('tabs-spinner')) return;
		$tabs.data('tabs-spinner', 'tabs-spinner');
		$tabs.find('a').each(function() {
			var $tab = $(this);
			var $tabContent = $($tab.attr('href'));
			$tab.bind('show-tab', function() {
				if ($tabContent.data('ajax')) {
					if ($('section.open').size() < 1) {
						$tabContent.empty();
						$tabContent.addClass('open');
					}
					App.showSpinner('section.open');
				}
			});
			$tab.bind('showed-tab', function() {
				if ($tabContent.data('ajax')) {
					App.hideSpinner();
				}
			});
		});
	},
	initTabs: function(container) {
		var $tabs = $(container).find('div.tabs');
		if ($tabs.data('tabs')) return;
		$tabs.data('tabs', 'tabs');
		var $defaultTab = $tabs.find('a.active');
		$tabs.find('a').each(function() {
			var $tab = $(this);
			$tab.click(function(event) {
				App.showTab($tab.attr('href'));
				return false;
			});
		});
		if ($tabs.size() > 0) {
			var hash = window.location.hash || App.urlParam('_tab');
			if (hash && !$('div.tabs a[href=' + hash + "]").hasClass('disabled')) {
				App.showTab(hash);
			} else if ($defaultTab.size() > 0) {
				App.showTab($defaultTab.attr('href'));
			} else {
				App.showTab($tabs.find('a:first').attr('href'));
			}
		}
	}
});

Application.prototype.showTab = function(id) {
	var $tabContainer = $('.tabs--content');
	var $tabContent = $tabContainer.find(id);
	var $tab = $('.tabs a[href = "' + id + '"]');
	if (($tab.hasClass('active') && $tabContent.hasClass('open')) || !$tabContent.size() || $tab.hasClass('disabled')) {
		return;
	}
	var _toggle1 = function() {
		$tab.trigger('show-tab');
		$('.tabs a.active').trigger('hide-tab');
		$('.tabs a.active').removeClass('active');
		window.location.hash = id;
		if ($tabContent.data('ajax')) {
			$tabContent.empty();
		}
		$tab.addClass('active');
	};
	var _toggle2 = function() {
		$('section, .tab--content').removeClass('open');
		$tabContent.addClass('open');
		$tab.trigger('showed-tab');
	};
	_toggle1();
	if ($tabContent.data('ajax')) {
		App.loadRemote($tabContent.data('ajax'), $tabContent, { loaded: _toggle2 } );
	} else {
		_toggle2();
	}
};

Application.prototype.showFlowTab = function(id) {
	// set all tabs disabled
	$('div.tabs a').addClass('disabled');
	// but remove it from the selected tab
	$('div.tabs a[href="' + id + '"]').removeClass('disabled');
	
	// set all tabs before id as complete
	$('div.tabs a[href="' + id + '"]').parent().prevAll().find('a').addClass('complete');

	App.showTab(id);
};

Application.prototype.urlParam = function(name) {
	var templateStr = '[\?&]' + name + '=([^&#]*)';
	var template = new RegExp(templateStr);
	var value = template.exec(window.location.search);
	if(value == null) {
		return null;
	} else {
		return decodeURIComponent(value[1]);
	}
};