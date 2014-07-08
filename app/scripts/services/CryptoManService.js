'use strict';
angular.module('udecApp').service('CryptoMan',['passKey','JSONFormatter','Wrangler',function CryptoManService (passKey, JSONFormatter, Wrangler) {
	
	var self = this;
	
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
			key = Wrangler.set(key);
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

	this.encrypt = function(plaintext, args) {
		if(typeof args === typeof {} && args.key && args.iv){
			return CryptoJS.AES.encrypt(
				plaintext,
				args.key,
				{
					iv:args.iv,
					mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
				}
			);
		} else {
			// console.log(args);
			throw new Error('Invalid args');
		}
		
	};

	this.decrypt = function (args) {
		// args = JSONFormatter.parse(args);
		// if(typeof args === {} && args.key && args.iv && args.ct){
			
			// console.log(args);
			var cipherStuff = CryptoJS.lib.CipherParams.create({ciphertext : Wrangler.set(args.ct)});
			// console.log(cipherStuff.ciphertext.toString()===args.ct.toString());
			return  CryptoJS.AES.decrypt(
				cipherStuff,
				args.key,
				{
					iv:args.iv,
					mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
				}
			).toString(CryptoJS.enc.Utf8);
		// }
	}
}]);	