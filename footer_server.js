(function() {

    data.disabledNextButton = true;

    if (input) {
        data.prevStep = input.prev_step;
        if (input.next_step) {
            data.disabledNextButton = false;
            data.nextStep = input.next_step;
        }
    }

})();
