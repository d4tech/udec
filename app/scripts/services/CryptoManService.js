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

	this.stringify = function (argument) {
		// Create json object with ciphertext
		var jsonObj = {};

	    // optionally stringify ciphertext, iv, salt and key
      	if(argument.ciphertext){
        	jsonObj.ct = Wrangler.getString(argument.ciphertext);
      	}

      	if (argument.iv) {
        	jsonObj.iv = Wrangler.getString(argument.iv);
      	}
      	if (argument.salt) {
     		jsonObj.s = Wrangler.getString(argument.salt);
      	}

      	if (argument.key){
      		jsonObj.key = Wrangler.getString(argument.key);
      	}

      // stringify JSON object
      return JSON.stringify(jsonObj);
    };

    this.parse = function (jsonStr) {
	    //initialize json Object
	    var jsonObj= {};

	    //if the input argument, jsonStr is a String type
	    //Convert it to json, provided the string has a JSON ordering
	    if(typeof(jsonStr) === typeof('')){
		    jsonObj = JSON.parse(jsonStr);
	    } else {
	        jsonObj = jsonStr;
	    }
	    //optionally set ciphertext(ct), key, iv and salt only if they are of String type 

	    if(jsonObj.ct && typeof jsonObj.ct === 'string'){
	        jsonObj.ct = Wrangler.set(jsonObj.ct);
	    }
	      
	    //convert only if key is of string type or if its the Global Angular value PassKey
	    if(jsonObj.key === passKey || typeof jsonObj.key === 'string') {
	        jsonObj.key = Wrangler.set(jsonObj.key);  
	    }
	      
	    if (jsonObj.iv && (typeof jsonObj.iv === 'string')) {
	        jsonObj.iv = Wrangler.set(jsonObj.iv);
	    }
	    if (jsonObj.s && (typeof jsonObj.s === 'string')) {
	        jsonObj.s = Wrangler.set(jsonObj.s);
	    }
	    return jsonObj;
    };

	this.encrypt = function(plaintext, args) {
		var args = self.parse(args);
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
			throw new Error('Invalid args for Encrypt' + args);
		}
		
	};

	this.decrypt = function (args) {
		//parse the arguments
		args = self.parse(args);
		//again check if they have all the required vals else throw an ERR
		if(typeof args === "object" && args.key && args.iv && args.ct){
			
			var cipherStuff = CryptoJS.lib.CipherParams.create({ciphertext : args.ct});
			return  CryptoJS.AES.decrypt(
				cipherStuff,
				args.key,
				{
					iv:args.iv,
					mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
				}
			).toString(CryptoJS.enc.Utf8);
		} else {
			throw new Error('Invalid args for Decrypt' + args)
		}
	}
}]);	