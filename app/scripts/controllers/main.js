'use strict';

/**
 * @ngdoc function
 * @name udecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udecApp
 */
angular.module('udecApp')
  .controller('MainCtrl', ['$scope','$http','passKey','globalIV','CryptoMan', function ($scope, $http, passKey, globalIV, CryptoMan) {
	    $scope.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];

	    $scope.onFileSelect = function(file) {
		    var secureFileBlob; //Stores the Final encrypted file
			var secureFile;

			//Select the first file only
			// console.log(file[0].name);
			var fileBlob = new Blob([file], {type : 'text/plain'});

			var reader = new FileReader();
			reader.onloadend = function () {
				// Generate the key and iv
				var args = {
					key : CryptoMan.setKey(),
					iv  : CryptoMan.getRand()
				};
				// encrypt the reader.result
				var encrypted = CryptoMan.encrypt(reader.result, args);
				// encrypt the file name with the passKey and GlobalIV
				var encryptedFileName = CryptoMan.encrypt(file[0].name, args)
				// Proceed to creating Header by encrypting the key and iv used to encrypt the file
				var header = CryptoMan.encrypt({
					key: encrypted.key,
					iv: encrypted.iv
				},{
					key: passKey,
					iv: globalIV
				});
				// Attach the header and the encrypted file
				secureFile = header.ct + encrypted.ct;
				secureFileBlob = new Blob([secureFile], {type: 'text/plain'});
				// Create the FormData() object as GAE's BlobStoreUploader will only accept multipart/form-data 
				var fd = new FormData();
				// add the securedFile to the form with the field name file
				fd.append("file",secureFileBlob, encryptedFileName.ct);
				// Prep to launch, get the create_upload() URL from the server
				$http.get("/rest/getBlobUploader").success(function(data) {	
					// 3)the response string is parsed into the data with an extra double quotes..""http://localhost...""
					// 2)So to remove that extra quotes we do data.split('"') and select the url at the return array index 1
					// 1)then to remove the baseURL from the data perform slice where the window.location.origin.length  
					var url = data.split('"')[1].slice(window.location.origin.length);
					// 0)Houston, we have Lift Off...	
					$http.post(url, fd,{
						withCredentials: true,
				        headers: {
				        	'Content-Type': undefined 
				        },
				        transformRequest: angular.identity
					}).success(function() {
						alert('Hallelujah...');
					}).error(function() {
						alert('Gods good all the time');
					});
				}).error(function() {
					alert('ERROR');
				});
			};
			reader.readAsText(fileBlob,{type : 'text/plain'});
	    };
	}
]);
