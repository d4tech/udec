/*
angular.module('udecApp').factory('Formatter',['passKey',function (passKey) {
    this.stringify = function (encrypted) {
      // Create json object with ciphertext
      var jsonObj = {
        ct: cipherParams.ciphertext.toString()
      };

      // optionally add iv and salt
      if (cipherParams.iv) {
        jsonObj.iv = cipherParams.iv.toString();
      }
      if (cipherParams.salt) {
        jsonObj.s = cipherParams.salt.toString();
      }

      // stringify JSON object
      return JSON.stringify(jsonObj);
    };
    this.parse = function (jsonStr) {
      //parse json string
      var jsobObj = {};

      if(typeof(jsonStr) === typeof('')){
        jsonObj = JSON.parse(jsonStr);
      } else {
        jsonObj = jsonStr;
      }

      Key handling Method, needs to be only invoked if passkey is not the key
       *if passkey is used as the key then
       *  just parse the passKey as its the header that is going to be encrypted
       *else apply PBDKF2 as its the file thats getting encrypted
       
      if (jsonObj.key === passKey){
        jsonObj.key = CryptoJS.enc.Hex.parse(jsonObj.key);
      }
      else {
        //Create the salt for the PBDKF2
        var salt =  CryptoJS.lib.WordArray.random(128/8);

        //Generate the new key
        jsonObj.key = CryptoJS.PBDKF2(
          jsonObj.key,
          salt,
          {keySize: 256/32, iterations: 1000}
        );
      }
      //optionally extract iv and salt
      if (jsonObj.iv) {
        cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
      else {
        cipherParams.iv = CryptoJS.lib.WordArray.random(128/8);
      }
      if (jsonObj.s) {
        cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
      return cipherParams;
    };

  }]
);
*/