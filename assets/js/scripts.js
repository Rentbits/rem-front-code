// Returns a number whose value is limited to the given range.
//
// Example: limit the output of this computation to between 0 and 255
// (x * 255).clamp(0, 255)
//
// @param {Number} min The lower boundary of the output range
// @param {Number} max The upper boundary of the output range
// @returns A number in the range [min, max]
// @type Number
//
// clamp func
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          }

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 200);
      };
  };
	// smartresize
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
//
(function(window, document, $) { // put the vars you need and match them at the bottom

  // All 4 vars are localized in here - makes them read faster b/c they are in local scope
  // $ works as alias for jQuery in here - ensures no conflict with other libs
  // R works as alias for Response in here - R.band(320) instead of Response.band(320)
  // window and document minify down to single letter vars
  // ====

  var $window   = $(window);
  var $body     = $(document.body);
  var scrollPos = 0;

  $('#nav--global').headroom({
    'tolerance': 12,
    'offset': 0,
  });

  $window.on('scroll_perf', function (event) {
    scrollPos = event.scrollTop;
    // console.log(scrollPos);

    uiListFilter.updateTop();

    if (scrollPos > 0) {
      $('.nav--local').find('.nav--local-community-label').css('background', 'none');
    } else {
      $('.nav--local').find('.nav--local-community-label').css('background', '');
    }

  });

  $window.smartresize(function(){
    // code that takes it easy...
    // console.log('smartresize');
    uiListFilter.init();
  });

var s; // global settings for objects

var uiListFilter = {
  'config' : {
    moduleSelector : '.module--f',
    cache: {}
  },
  init: function () {
    s              = this.config;
    s.cache.module = $(s.moduleSelector);

    this.setSize();
    this.updateTop();
  },
  setSize : function () {
    // body...
    var module = s.cache.module;
    if (module) {
      var filterContainer = module.parent();
      var targetWidth     = filterContainer.width();
          targetWidth     = Math.floor(targetWidth);

      module.css({
        width: targetWidth,
        position: 'fixed'
      });
    }
  },
  updateTop : function () {
    // body...
    var module = s.cache.module;
    if (module.length) {
      var targetPos = module.parent().offset();
      var targetTop = (targetPos.top - scrollPos).clamp(0, targetPos.top);
          targetTop = Math.floor(targetTop);

      module.css({top: targetTop + 'px'});
    }
  }
};

// helper function for uiNavigation
$.fn.extend({
  urlPath: function(string, index) {
    var urlIndex = index - 1;
    var match    = null;

    $(this).each(function () {
      // var elem         = this;
      var hrefArray    = $(this).data('href-array');
      var urlPathArray = this.pathname.replace(/^\/+|\/+$/g, '').split( '/' );
      var testUrl = ( urlPathArray.indexOf('rem')  >= 0 ) ? urlPathArray.splice(testUrl, 1) : null ;

      if (hrefArray) {
        for (var i=0,  tot=hrefArray.length; i < tot; i++) {
          if ( string === hrefArray[i] ) {
            match = $(this);
          }
        }
      } else if (this.pathname.length > 1) {
        if ( string === urlPathArray[urlIndex] ) {
          match = $(this);
          // console.log(match);
        }
      }
    });
    return match;
  }
});
//
var uiNavigation = {
  'config': {
    // menu links selectors
    primaryNav   : '#nav--global',
    secondaryNav : '#nav--local',
    cache: {},
  },
  init: function (config) {
    this.popHandler();
  },
  popHandler : function () {
    // body...
    var $primaryNav   = $(this.config.primaryNav);
    var $secondaryNav = $(this.config.secondaryNav);

    var $primaryLinks   = $primaryNav.find('li>a:not([href=#])', '.nav--button-tabs');
    var $secondaryLinks = $secondaryNav.find('li>a:not([href=#])');

    var navHeight       = $secondaryNav.height();
    var tooltip         = $secondaryNav.find('.nav--local-tooltip');
    var tooltipOffset   = tooltip.outerHeight() / 2;

    var path = window.location.pathname.replace(/\/rem/, '');

    $primaryLinks.each(function () {
      // body...
      var $a = $(this);
      var pattern = $a.data('href-match');

      if (pattern) {
        pattern = new RegExp(pattern.replace('*', '.*'));
        //console.log(pattern);
        //console.log(path.match(pattern));
        if (path.match(pattern)) {
    	    $primaryLinks.parent().removeClass('active');
    	    $a.parent().addClass('active');
    	    // console.log("Marking:" + $a.children('p').text());
        }
      }
      //
    });
    $secondaryLinks.each(function () {
      // body...
      var $a = $(this);
      var pattern = $a.data('href-match');

      if (pattern) {
        pattern = new RegExp(pattern.replace('*', '.*'));
        //console.log(pattern);
        //console.log(path.match(pattern));
        if (path.match(pattern)) {
          $secondaryLinks.removeClass('active');
          $a.addClass('active');
          // console.log("Marking:" + $a.children('p').text());
          //
          var parent      = $a.parent();
          var coordinates = parent.position().top + (parent.height() / 2) - tooltipOffset;

          tooltip.transition({'top': coordinates});
        }
      }
      //
    });

  }
};

//
var uiCloseDialog = {
  'config': {
    cache : {}
  },
  init: function () {
    this.close();
  },
  close: function () {
    // var module = $('.alert-box');
    var module = $(document.body);
    if (module.length) {
      module.on('click', '.alert-box .close', function(event) {
        event.preventDefault();
        $(this).parent().hide().remove();
        // $this.parent().remove();
        // console.log($(this));
      });
    }
  }
};

// var self;
//
Application.prototype.uiModal = {
  'config': {
    defaultContent : 'This is a modal window',
    cache : {}
  },
  init: function () {
    // s = this;
    this.attachEvents();
    // console.log('initialized');
  },
  open: function (args, array) {
    $('.md-modal').addClass('md-show');
    $('html').css({'overflow-y': 'hidden'});

    var container = $('.module--modal-content');

    if (args) {
      var modalContent;

      if (args.indexOf('#') === 0) {
        // console.log('hash is: ' + args);
        // $(args).iCheck('destroy');
        modalContent = $(args).html();
      } else {
        // console.log('string is: ' + args);
        modalContent = args;
      }

      // container.html(modalContent);
      // .iCheck({
      //   checkboxClass: 'input-checkbox',
      //   radioClass: 'input-radio',
      //   increaseArea: '20%' // optional
      // });

      container
        .html(modalContent)
        .find('input.timepicker')
        .timepicker({
          'step': 15,
          'scrollDefaultNow': true,
          'showDuration': true
        })
      ;

      container.datepair();
      // $('input.datepicker').datepicker('destroy');

      // console.log('destroyed');
      //
      // container.find('input.datepicker').datepicker({
      //   'autoclose': true,
      //   'todayHighlight': true
      // });

    } else {
      console.log('no arguments');
      // console.log(this.config.defaultContent);
    }

    return false;
  },
  close: function () {
    $('.md-modal').removeClass('md-show');
    $('html').css({'overflow-y': ''});

    setTimeout(function () {
      $('.module--modal-content').html('');
    }, 300);

    return false;
  },
  attachEvents: function () {
    $body.on('click', '.md-trigger', function (event) {
      event.preventDefault();
      App.uiModal.open();
    });
    $body.on('click', '.md-close, .md-overlay', function (event) {
      event.preventDefault();
      App.uiModal.close();
    });
  }
};
//

var uiInputs = {
  init: function () {
    // body...
    $body.find('input').iCheck({
      checkboxClass: 'input-checkbox',
      radioClass: 'input-radio',
      increaseArea: '20%' // optional
    });
  }
};
//

var uiSwitches = {
  'config' : {
    'switchSelector' : '.js-switch',
    'switchColor'    : '#59c8e0',
    'cache' : {}
  },
  init : function () {
    // body...
    this.switchery();
  },
  switchery : function () {
    // body...
    var color = this.config.switchColor;
    var elems = Array
      .prototype.slice.call(document.querySelectorAll(this.config.switchSelector));

    elems.forEach(function(html) {
      var switchery = new Switchery(html, { color: color });
    });
  }
};

$.extend(Application.prototype.ui, {
  initTimepicker: function(container) {
    if ($.fn.timepicker) {
      $(container).find('input.timepicker').timepicker({
        'step': 15,
        'scrollDefaultNow': true,
      });
    }
  }
});
//
$.extend(Application.prototype.ui, {
  initDatepicker: function(container) {
    if ($.fn.datepicker) {
      $(container).find('input.datepicker').datepicker({
        'autoclose': true,
        'todayHighlight': true,
      });
    }
  }
});
//
$.extend(Application.prototype.ui, {
  initModals: function(container) {
    if (App.uiModal) {
      Application.prototype.uiModal.init();
    }
  }
});
//
//
$window.on('ready statechangecomplete', function (event) {
  // object.init()
  uiNavigation.init();
  uiListFilter.init();
  uiCloseDialog.init();
  //
  // datetimePicker.init();
  uiSwitches.init();

  if (App.initialized !== true || event.type === 'statechangecomplete') {App.init();}

});

}(this, this.document, this.jQuery)); // in global scope, this === window