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

function Application() {}

Application.prototype.init = function() {
  this.initUi();
  this.initialized = true;
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
        $input.autocomplete({
          source: $input.data('url'),
          select: function(event, data) {
            if (window[$input.data('select')])
              return window[$input.data('select')](event, data);
            else
              window.location = $input.data('select') + data.item.selectValue;
          }
        });
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
  initTabs: function(container) {
    var $tabs = $(container).find('div.tabs');
    var $defaultTab = $tabs.find('a.active');

    // console.log(Date.now());

    $tabs.find('a').each(function() {
      var $tab = $(this);
      $tab.on('click', function(event) {
        var targetId      = $tab.attr('href');
        var targetTabs    = $tab.closest('.tabs');
        var targetContent = targetTabs.next('.tabs--content');

        // App.showTab($tab.attr('href'));
        App.showTab(targetId, targetTabs, targetContent);
        //
        // console.log(
        //   targetId, targetTabs, targetContent
        //
        // );

        event.preventDefault();
        // return false;
      });
    });
    if ($tabs.size() > 0) {
      if (window.location.hash) {
        App.showTab(window.location.hash);
      } else if ($defaultTab.size() > 0) {
        App.showTab($defaultTab.attr('href'));
      } else {
        App.showTab($tabs.find('a:first').attr('href'));
      }
    }
  },
  initPhone: function(container) {
    if ($.fn.mask) {
      $(container).find('input.phone').each(function() {
        $(this).mask("? (999) 999-9999");
      });
    }
  }
};

Application.prototype.ajax = {
  success: function(data, textStatus, target) {
    App.initUi(target);
  },
  loaded: function(data, textStatus, target) {
    var redirectPtrn = /^__redirect:\s*/;
    if (redirectPtrn.test(data)) {
      window.location = data.replace(/^__redirect:\s*/, '');
      return false;
    }
  }
};

Application.prototype.showTab = function(id, targetTabs, targetContent) {

  // default
  var $tabContainer = $('.tabs--content');

  // contextual
  if (targetContent) {
    $tabContainer = $(targetContent);

    var $targetTabs = $(targetTabs);
    var $targetContent = $(targetContent).find(id);
    var $target = $targetTabs.find('a[href = "'+ id +'"]');

    console.log($target[0]);
    console.log($targetTabs[0]);
    console.log($targetContent[0]);
  }

  var $tabContent = $tabContainer.find(id);
  var $tab = $('.tabs a[href = "' + id + '"]');

  if ($tabContent.size() > 0) {
    var _toggle = function() {
      $('section, .tab--content').removeClass('open');
      $('.tabs a').removeClass('active');
      window.location.hash = id;
      $tabContent.addClass('open');
      $tab.addClass('active');
    };
    if ($tabContent.data('ajax')) {
      $tabContent.load($tabContent.data('ajax'), function(event) {
        _toggle();
        App.initUi($tabContent);
      });
    } else {
      _toggle();
    }
  }
};
