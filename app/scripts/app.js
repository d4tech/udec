'use strict';

/**
 * @ngdoc overview
 * @name udecApp
 * @description
 * # udecApp
 *
 * Main module of the application.
 */
var udecApp = angular.module('udecApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute'
  ])
  .value('passKey','0306a1f107b14a4ef1a73aa7cd96cb501e07e3fefaa0dc4fe5fa85e40cefa41d')
  .value('globalIV', '5a33ef277c4930636fcf0f83e9162807')
  .config(function ($routeProvider) {
      $routeProvider
      .when('/', {
              templateUrl: 'views/main.html',
              controller: 'MainCtrl'
      })
      .when('/about', {
              templateUrl: 'views/about.html',
              controller: 'AboutCtrl'
      })
      .otherwise({
              redirectTo: '/'
      });
  });
