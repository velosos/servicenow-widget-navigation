api.controller = function($rootScope) {
    /* widget controller */
    var c = this;

    c.closeSidePanel = function() {
        $rootScope.$emit('closeSidePanel');
    };


    c.getProgressBarWidth = function() {
        var minStep = c.data.firstStep;
        var maxStep = c.data.lastStep;
        var current = c.data.currentStep;

        var percentage = 0;
        if (maxStep > minStep) {
            percentage = ((current - minStep) / (maxStep - minStep)) * 100;
            percentage = Math.max(0, Math.min(percentage, 100)); // 
        }
        return {
            'width': percentage + '%'
        };
    };


    c.closeModal = function() {
        console.log("Modal closed");
    };
};
