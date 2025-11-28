api.controller = function(spUtil, $scope, $rootScope, $http) {
    /* widget controller */
    var c = this;

    c.isLoading = true;
    setTimeout(function() {
        $scope.$applyAsync();
    }, 10);

    c.ritms = [];

    angular.forEach(c.data.result, function(requestSysId) {
        $http.get('/api/now/table/sc_req_item', {
            params: {
                sysparm_query: 'request=' + requestSysId.sysID,
                sysparm_fields: 'number,sys_id'
            }
        }).then(function(resp) {

            $rootScope.$emit('sendConfirmation', {
                value: true
            });

            c.isLoading = false;
            var ritms = resp.data.result;
            angular.forEach(ritms, function(ritm) {
                c.ritms.push({
                    number: ritm.number,
                    sysID: ritm.sys_id
                });
            });
					 if (c.ritms.length > 0) {
              c.caseSysId = c.ritms[0].sysID;
            } else {
              c.caseSysId = null;
            }
        });
    });


    c.selectedOption = null;
    c.footerWidget = 'access_footer_buttons';
    c.nextStep = '';



    spUtil.get(c.footerWidget).then(function(response) {
        c.dinamycFooterWidget = response;
    });

  c.surveySysId = '';

  c.rating = 0;
  c.thankYou = false;

  c.setRating = function(star) {
    c.rating = star;

    var payload = {
      case_sys_id: c.caseSysId,
      survey_sys_id: c.surveySysId,
      rating: c.rating
    };

    $http.post('/api/nree/rating', payload).then(function() {
      c.thankYou = true;
    }, function(error) {
      alert('Erro ao enviar avaliação: ' + error.statusText);
    });
  };


};
