/*
THIS FACTORY IS RESPONSIBLE FOR DATA INTERCHANGE, It has two methods namely stringify and parse
This is the same example given in the CryptoJS documentation.
*/


"use strict";

angular.module('udecApp').factory('JSONFormatter',['passKey',function JSONFormatterFactory(passKey) {    
  return {
    stringify : function (encrypted) {
      // Create json object with ciphertext
      var jsonObj = {};

      if(encrypted.ciphertext){
        jsonObj.ct = encrypted.ciphertext.toString();
      }

      // optionally add iv and salt
      if (encrypted.iv) {
        jsonObj.iv = encrypted.iv.toString();
      }
      if (encrypted.salt) {
        jsonObj.s = encrypted.salt.toString();
      }

      // stringify JSON object
      return JSON.stringify(jsonObj);
    },

    parse : function (jsonStr) {
      //parse json string
      var jsonObj= {};

      if(typeof(jsonStr) === typeof('')){
        jsonObj = JSON.parse(jsonStr);
      } else {
        jsonObj = jsonStr;
      }
      // console.log(jsonObj);
      if(jsonObj.ct){
        jsonObj.ct = CryptoJS.enc.Hex.parse(jsonObj.ct);
      }
       /*Key handling Method, needs to be only invoked if passkey is not the key
       *if passkey is used as the key then
       *  just parse the passKey as its the header that is going to be encrypted
       *else apply PBDKF2 as its the file thats getting encrypted
       */
      if(jsonObj.key) {
        // if (jsonObj.key === passKey){          
          jsonObj.key = CryptoJS.enc.Hex.parse(jsonObj.key);
        
        /*} else {
          //Create the salt for the PBDKF2
          var salt =  CryptoJS.lib.WordArray.random(128/8);

          //Generate the new key
          jsonObj.key = CryptoJS.PBKDF2(
            jsonObj.key,
            salt,
            {keySize: 256/32, iterations: 1000}
          );
        }*/
      }
      //optionally extract iv and salt
      if (jsonObj.iv) {
        jsonObj.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
      /*else {
        jsonObj.iv = CryptoJS.lib.WordArray.random(128/8);
      }*/
      if (jsonObj.s) {
        jsonObj.s = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
      console.log(jsonObj);
      return jsonObj;
    }
  }
}]);