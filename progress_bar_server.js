(function() {
    var minStep = 10;
    var maxStep = 100;


    data.firstStep = minStep;
    data.lastStep = maxStep;

    var rowCount = new global.GlideQuery('x_dynamic_access_flow')
        .count();
    data.totalSteps = rowCount;

    if (input) {
        data.currentStep = input.current_step;
		data.title = input.title;
    } else {
        data.currentStep = minStep;
    }
})();
