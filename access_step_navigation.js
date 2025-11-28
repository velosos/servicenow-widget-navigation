api.controller = function($location, $http, $scope, spUtil, $timeout, $rootScope) {
    var c = this;

    c.showSidePanel = false;

    c.openSidePanel = function() {
        c.showSidePanel = true;
        if (!$scope.$$phase) {
            $scope.$applyAsync();
        }
    };

    $rootScope.$on('closeSidePanel', function() {
        c.showSidePanel = false;
        $scope.$applyAsync();
    });

    c.showBreadcrumb = false;

    var table = 'x_dinamic_access_flow_options';
    var field = 'u_step.u_step_id';
    var operator = '=';
    c.data.options = [];
    c.breadcrumbTitles = [];
    c.data.title = '';
    c.data.type = '';
    c.data.widgetId = '';
    $scope.progressWidget = null;
    $scope.receivedInfo = [];
    c.progressWidgetTitle = 'Olá, como podemos te ajudar?';
    $scope.sendConfirmation = false;

    $scope.hash = $location.hash();
    if (!$scope.data.hash) {
        $scope.data.hash = 'action_you_want_to_perform';
        $location.hash($scope.data.hash);
    }

    // AGORA SIM: ler o query param DEPOIS de definir openSidePanel
    var params = $location.search();
    console.log('URL params: ', params);
    if (params.access_modal) {
        console.log('access_modal =', params.access_modal);
    }
    if (params.access_modal === 'request_access_navigation') {
        console.log('Abriria a modal aqui...');
        c.openSidePanel();
        console.log('showSidePanel =', c.showSidePanel);
    }

    c.createQueryTerm = function(table, field, sys_id, operator) {
        c.data.options = [];
        c.data.title = '';
        c.data.type = '';

        return $http.get('/api/now/table/' + table, {
            params: {
                sysparm_query: field + operator + sys_id + '^u_active=true',
                sysparm_fields: 'u_step.title,u_step.u_description,u_step.u_step_id,u_step.widget_id,u_step.order,u_step.u_type,u_step.u_previous_step_default.u_step_id,u_options,u_active'
            }
        }).then(function(response) {
            var results = response.data.result.map(function(item) {
                if (item.u_options) {
                    try {
                        c.data.options.push(JSON.parse(item.u_options));
                        c.data.title = item['u_step.title'];
                        c.data.description = item['u_step.u_description'];
                        c.data.type = item['u_step.u_type'];
                        c.data.order = item['u_step.order'];
                        c.data.widgetId = item['u_step.widget_id'];
                        c.data.stepId = item['u_step.u_step_id'];
                        c.data.prevStep = item['u_step.u_previous_step_default.u_step_id'];
                        c.data.hash = '';

                        if (!c.breadcrumbTitles.length || c.breadcrumbTitles[c.breadcrumbTitles.length - 1] !== c.data.title) {
                            c.breadcrumbTitles.push(c.data.title);
                        }

                        $rootScope.$on('sendConfirmation', function(evt, data) {
                            $scope.sendConfirmation = data.value;
                        });

                        if (c.data.stepId == 'last_step') {
                            if ($scope.sendConfirmation == false) {
                                c.progressWidgetTitle = 'Aguarde, estamos criando a solicitação...';
                            }

                            var URL_DESTINO = '/esc?id=request_access_navigation';
                            history.pushState(null, document.title, location.href);
                            window.addEventListener('popstate', function(event) {
                                window.location.replace(URL_DESTINO);
                            });
                        }

                        $rootScope.$on('sendConfirmation', function(evt, data) {
                            if (data.value === true) {
                                var progressWidgetOptionsDone = {
                                    current_step: c.data.order,
                                    title: 'Etapa concluída, sua solicitação foi registrada.'
                                };

                                spUtil.get('access_progress_bar', progressWidgetOptionsDone).then(function(response) {
                                    $scope.progressWidget = response;
                                });
                            }
                        });

                        var progressWidgetOptions = {
                            current_step: c.data.order,
                            title: c.progressWidgetTitle
                        };

                        spUtil.get('access_progress_bar', progressWidgetOptions).then(function(response) {
                            $scope.progressWidget = response;
                        });

                        var mainWidgetOptions = {
                            title: c.data.title,
                            description: c.data.description,
                            options: c.data.options,
                            stepInfo: $scope.steps,
                            type: c.data.type,
                            stepId: c.data.stepId,
                            prevStep: c.data.prevStep
                        };
                        $scope.currentWidget = null;
                        spUtil.get(c.data.widgetId, mainWidgetOptions)
                            .then(function(response) {
                                $scope.currentWidget = response;
                            });
                    } catch (e) {
                        console.error('Erro ao converter u_options:', e);
                    }
                }
                return item;
            });
            return results;
        });
    };

    c.createQueryTerm(table, field, $scope.data.hash, operator);

    $scope.$watch(function() {
        return $location.hash();
    }, function(newHash, oldHash) {
        if (newHash !== oldHash) {
            c.createQueryTerm(table, field, newHash, operator);
        }
    });

    $rootScope.$on('selectedOptions', function(evt, data) {
        if (!$scope.steps) {
            $scope.steps = {};
        }
        $scope.steps[data.key] = data.value;
    });
};
