(function() {
    if (input) {
        var stepInfo = input.stepInfo;
        data.stepInfoData = JSON.stringify(input.stepInfo);
		console.log(data.stepInfoData);
        var userId = gs.getUserID();
        var itemId = stepInfo.request_options || '';

        var variables = {};
        for (var key in stepInfo) {
            if (stepInfo.hasOwnProperty(key) && key !== 'vs_emp_employee') {
                variables[key] = stepInfo[key];
            }
        }

        variables.phone_number = '31978009988';

        var emp = stepInfo.vs_emp_employee || {};
        var empFields = [
            'vs_emp_employee', 'vs_emp_fullname', 'vs_emp_employee_id', 
            'vs_emp_employee_company', 'vs_emp_employee_branch', 'vs_emp_employee_section',
            'vs_emp_email', 'vs_emp_cpf'
        ];
        empFields.forEach(function(f){
            if (typeof emp[f] !== 'undefined') variables[f] = emp[f];
        });

        var vs_sys_profiles = Array.isArray(stepInfo.vs_sys_profile) ? stepInfo.vs_sys_profile : (stepInfo.vs_sys_profile ? [stepInfo.vs_sys_profile] : []);

        data.result = [];

        if (vs_sys_profiles.length > 0) {
            vs_sys_profiles.forEach(function(profileId){
                variables.vs_sys_profile = profileId;
                var cart = new sn_sc.CartJS();
                var item = {
                    'sysparm_id': itemId,
                    'sysparm_quantity': '1',
                    'variables': variables
                };
                var cartItemId = cart.addToCart(item);
                if (cartItemId) {
                    cart.setRequestedFor(variables.requested_for.toString());
                    var result = cart.orderNow(cartItemId);
                    data.result.push({
                        profile: profileId,
                        number: result.number,
                        sysID: result.sys_id
                    });
                } else {
                    gs.info('Erro ao criar pedido para: ' + userId + ' - perfil: ' + profileId);
                }
            });
        } else {
            var cart = new sn_sc.CartJS();
            var item = {
                'sysparm_id': itemId,
                'sysparm_quantity': '1',
                'variables': variables
            };
            var cartItemId = cart.addToCart(item);
            if (cartItemId) {
                cart.setRequestedFor(variables.requested_for.toString());
                var result = cart.orderNow(cartItemId);
                data.result.push({
                    profile: null,
                    number: result.number,
                    sysID: result.sys_id
                });
            } else {
                gs.info('Erro ao criar pedido para: ' + userId + ' - sem perfil');
            }
        }
    }
})();
