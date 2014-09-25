'use strict';

/**
 * @ngdoc function
 * @name udecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udecApp
 */
angular.module('udecApp')
  .controller('MainCtrl', ['$scope','$http','passKey','globalIV','CryptoMan','FileOps',
		  function ($scope, $http, passKey, globalIV, CryptoMan, FileOps) {
			  $scope.awesomeThings = [
				  'HTML5 Boilerplate',
				  'AngularJS',
				  'Karma'
	          ];


	          FileOps.getFileList()
	            .then(angular.bind(this, function then() {
		            $scope.files = FileOps.files;
	            }));

	          $scope.getFile = function(blob_key){
		            FileOps.getFile(blob_key,$scope.files);      

	          };

	          $scope.onFileSelect = function(file) {
		            FileOps.uploadFile(file);
	          };
  }]);
