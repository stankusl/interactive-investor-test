(function() {

    angular.module('application', ['ui.bootstrap', 'ui.router', 'iiHighLow'])

    .run(['$rootScope', '$state', function($rootScope, $state) {
        'use strict';

        // this is available from all across the app
        $rootScope.appName = 'Interactive Investor';

        // make $state available from templates
        $rootScope.$state = $state;
    }])

    .config(['$locationProvider', function($locationProvider) {
        $locationProvider.html5Mode(true);
    }])

    .config(['$httpProvider', function($httpProvider) {
        //initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }           
    }])

    .run(['$rootScope', '$log', function($rootScope, $log) {

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $log.debug('successfully changed states');
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            $log.error('The requested state was not found: ', unfoundState);
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.error('An error occurred while changing states: ', error);
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });
    }]);

})();

// .filter('range', function () {
//     return function (val, range) {
//         range = parseInt(range);
//         for (var i = 1; i < range; i++)
//             val.push(i);
//         return val;
//     };
// })
