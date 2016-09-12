(function() {

    /**
     * Config
     */
    var moduleName = 'iiHighLow';
    var templateUrl = 'app/shared/directives/ii-high-low.tpl.html';

    /**
     * Module
     */
    var module;
    try {
        module = angular.module(moduleName);
    } catch(err) {
        // named module does not exist, so create one
        module = angular.module(moduleName, []);
    }

    module.directive('iiHighLow', ['$interpolate', '$state', '$http', '$q',
    function($interpolate, $state, $http, $q) {
            return {
                restrict: 'E',
                templateUrl: function(elem, attrs) {
                    return attrs.templateUrl || templateUrl;
                },
                scope: {
                    company: '@',
                },
                link: function(scope, ngModel) {
                    scope.period = 'M';
                    scope.high = 0;
                    scope.low = 0;

                    scope.updateValue = function() {
                      getValues(scope.company, scope.period);
                    }

                    function setHighValue(history) {
                      var temp = 0;
                      angular.forEach(history, function(value, key) {
                        if (temp < value.high ) {
                          temp = value.high;
                        }
                        //console.log( key + ': ' +  value.high  );
                      });
                      scope.high = temp;
                    }

                    function setLowValue(history) {
                      var temp = 99999999;
                      angular.forEach(history, function(value, key) {
                        if (temp > value.low ) {
                          temp = value.low;
                        }
                      });
                      scope.low = temp;
                    }

                    // Init
                    function getValues(company, period) {

                        var API_Url = 'http://188.166.154.233/public/proxy/ii';
                        var deferred = $q.defer();

                        $http.get(API_Url + '/' + company + '/' + period)
                            .then(function(response) {
                                deferred.resolve(response.data);
                                setHighValue(response.data.history);
                                setLowValue(response.data.history);
                            })
                            .catch(function(response) {
                                return $q.reject('Error retrieving activities.');
                            });
                        return deferred.promise;
                    }

                    getValues(scope.company, scope.period);

                }
            };
        }]);
})();
