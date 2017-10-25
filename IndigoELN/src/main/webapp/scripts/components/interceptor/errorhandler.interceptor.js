angular
    .module('indigoeln')
    .factory('errorHandlerInterceptor', errorHandlerInterceptor);

/* @ngInject */
function errorHandlerInterceptor($q, $injector, $rootScope, $log) {
    return {
        responseError: responseError
    };

    function responseError(httpResponse) {
        var i;
        var addErrorAlert = function() {
            $log.error(angular.toJson(arguments));
        };
        switch (httpResponse.status) {
            // connection refused, server not reachable
            case 0:
                addErrorAlert('Server not reachable', 'error.server.not.reachable');
                break;

            case 400:
                var errorAlertHeader = httpResponse.headers('X-indigoeln-error-alert');
                var errorHeader = httpResponse.headers('X-indigoeln-error');
                var entityKey = httpResponse.headers('X-indigoeln-params');
                if (_.isString(errorAlertHeader)) {
                    $log.error(errorAlertHeader);
                } else if (errorHeader) {
                    addErrorAlert(errorHeader, {
                        entityName: entityKey
                    });
                } else if (httpResponse.data && httpResponse.data.fieldErrors) {
                    _.forEach(httpResponse.data.fieldErrors, function(error) {
                        var convertedField = error.field.replace(/\[\d*\]/g, '[]');
                        var fieldName = convertedField.charAt(0).toUpperCase() + convertedField.slice(1);
                        addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + error.message, {
                            fieldName: fieldName
                        });
                    });
                } else if (httpResponse.data && httpResponse.data.message) {
                    $log.error(httpResponse.data.message);
                } else {
                    addErrorAlert(httpResponse.data);
                }
                break;

            case 401:
                if (httpResponse.config.url !== 'login') {
                    var Auth = $injector.get('Auth');
                    var $state = $injector.get('$state');
                    var params = $rootScope.toStateParams;
                    Auth.logout();
                    $rootScope.previousStateName = $rootScope.toState;
                    $rootScope.previousStateNameParams = params;
                    $state.go('login');
                }
                break;

            default:
                if (httpResponse.data && httpResponse.data.message) {
                    addErrorAlert(httpResponse.data.message);
                } else {
                    addErrorAlert(angular.toJson(httpResponse));
                }
        }

        return $q.reject(httpResponse);
    }
}

