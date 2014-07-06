'use strict';

/**
 * @ngdoc function
 * @name udecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udecApp
 */
angular.module('udecApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
