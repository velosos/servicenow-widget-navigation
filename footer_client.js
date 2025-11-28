api.controller = function($location, $document, $scope) {
	/* widget controller */
	var c = this;
	c.nextStep = function() {
		$location.hash(c.data.nextStep);
		c.data.disabledNextButton = true;
	}

	c.prevStep = function() {
		$location.hash(c.data.prevStep);
		c.data.disabledNextButton = true;
	}

	// keyboard shortcuts
	c.handleKeyCombo = function(event) {
		// shift + seta direita (avançar)
		if (event.shiftKey && event.keyCode === 39 && !c.data.disabledNextButton) {
			c.nextStep();
			event.preventDefault();
		}

		// shift + seta esquerda (voltar)
		if (event.shiftKey && event.keyCode === 37) {
			c.prevStep();
			event.preventDefault();
		}
	};

	// listener 'shift' key
	$document.on('keydown', function(event) {
		if (event.shiftKey && event.keyCode === 16) { // 16 = Shift
			$scope.$apply(function() {
				var footer = angular.element('.modal-footer');
				if (footer.length) {
					footer[0].focus();
				}
			});
		}
	});

	// remove listener on destroy
	$scope.$on('$destroy', function() {
		$document.off('keydown');
	});

};
