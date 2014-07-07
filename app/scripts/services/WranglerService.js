'use strict'

angular.module('udecApp').service('Wrangler', [function WranglerService() {
	var self = this;


	this.set = function (argument) {
		//parse the argument to Hex type
		return CryptoJS.enc.Hex.parse(argument);
	};

	this.getString = function  (argument) {
		//stringify the argument
		return argument.toString();
	};

	this.getRand = function () {
		//return a Random value of 128bits
		return CryptoJS.lib.WordArray.random(128/8);
	};

	this.setKey = function(key) {
		//if key is null then generate random value
		var key = key || self.getRand();
		//generate salt
		var salt = self.getRand();
		//if key is String then parse it
		if(typeof key === 'string'){
			key = self.set(key);
		}
		//return PBKDF2'ed key
		//even if a file is previously encrypted
		//pss its key as the argument and again apply PBKDF2 over it
		//so that the no of iterations increases
		return CryptoJS.PBKDF2(
	        key,
	        salt,
	        {keySize: 256/32, iterations: 1000}
        );
	};

}]);