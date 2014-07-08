'use strict'

angular.module('udecApp').service('Wrangler', [function WranglerService() {
	this.set = function (argument) {
		//parse the argument to Hex type
		return CryptoJS.enc.Hex.parse(argument);
	};

	this.getString = function  (argument) {
		//stringify the argument
		return argument.toString();
	};

}]);