'use strict';
angular.module('udecApp').service('CryptoMan',['passKey','globalIV', function CryptoManService (passKey, globalIV) {
	
	var self = this;

	this.set = function (argument) {
		//parse the argument to Hex type
		return CryptoJS.enc.Base64.parse(argument);
	};

	this.getString = function  (argument) {
		//stringify the argument
		return argument.toString(CryptoJS.enc.Base64);
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
		key = CryptoJS.PBKDF2(
	        key,
	        salt,
	        {keySize: 256/32, iterations: 1000}
        );

        return self.getString(key); 
	};

	this.stringify = function (argument) {
		// Create json object with ciphertext
		var jsonObj = {};

	    // optionally stringify ciphertext, iv, salt and key
      	if(argument.ciphertext){
        	jsonObj.ct = self.getString(argument.ciphertext);
      	}

      	if (argument.iv) {
        	jsonObj.iv = self.getString(argument.iv);
      	}
      	if (argument.salt) {
     		jsonObj.s = self.getString(argument.salt);
      	}

      	if (argument.key){
      		jsonObj.key = self.getString(argument.key);
      	}

      	// stringify JSON object
      	return jsonObj;
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
	        jsonObj.ct = self.set(jsonObj.ct);
	    }
	      
	    //convert only if key is of string type or if its the Global Angular value PassKey
	    if(jsonObj.key === passKey || typeof jsonObj.key === 'string') {
	        jsonObj.key = self.set(jsonObj.key);  
	    }
	    //convert only if iv is of string type or if its the Global Angular value globalIV
	    if (jsonObj.iv && ((typeof jsonObj.iv === 'string') || jsonObj.iv === globalIV)) {
	        jsonObj.iv = self.set(jsonObj.iv);
	    }
	    if (jsonObj.s && (typeof jsonObj.s === 'string')) {
	        jsonObj.s = self.set(jsonObj.s);
	    }
	    return jsonObj;
    };

	this.encrypt = function(plaintext, args) {
		var encrypted;
		var args = self.parse(args);

		// If the incoming plaintext is an object then stringify the object 
		if (typeof plaintext === 'object'){
			plaintext = JSON.stringify(plaintext);
		}

		// Check if the args are correct else throw an error
		if(typeof args === typeof {} && args.key && args.iv){
			encrypted = CryptoJS.AES.encrypt(
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
		return self.stringify(encrypted);		 
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