'use strict';

/**
 * @ngdoc function
 * @name udecApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the udecApp
 */
angular.module('udecApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
