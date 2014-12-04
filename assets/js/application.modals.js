(function() {
	
var _getModal = function() {
//		var $modal = $('<div id="active-modal" class="md-modal md-effect-3">')
//			.append($('<div class="module module--modal-body md-content">')
//				.append($('<div id="md-modal-content" class="module--modal-content">')));
//		$('body').append($modal);
//		$('body').append($('<div class="md-overlay">'));
//		return $modal;
	return $('#md-modal-content').parent().parent();
};
	
Application.prototype.openModal = function(modal) {
	if (modal === undefined) modal = '';
	var $modal = _getModal();
	var $modalContent = $modal.find('#md-modal-content')
	if (modal.indexOf('#') == 0) { // id
		var $content = $(modal).clone(true);
		$modalContent.empty();
		$modalContent.append($content);
	} else if (modal.indexOf('/') == 0 || modal.indexOf('http') == 0) { // url/uri
		
	} else { // html
		$modalContent.html(modal);
		App.initUi($modalContent);
	}
	$modal.addClass('md-show');
	$('html').css({'overflow-y': 'hidden'});
};

Application.prototype.closeModal = function() {
	var $modal = _getModal();
	$modal.removeClass('md-show');
	$('html').css({'overflow-y': ''});
	setTimeout(function () {
		//$('#active-modal').next('div.md-overlay').remove();
		//$('#active-modal').remove();
		$modal.find('#md-modal-content').html('');
	}, 300);
};

})();