/*
THIS FACTORY IS RESPONSIBLE FOR DATA INTERCHANGE, It has two methods namely stringify and parse
This is the same example given in the CryptoJS documentation.
*/


"use strict";

angular.module('udecApp').factory('JSONFormatter',['passKey','Wrangler',function JSONFormatterFactory(passKey, Wrangler) { 
  return {
    stringify : function (encrypted) {
      // Create json object with ciphertext
      var jsonObj = {};

      // optionally stringify ciphertext, iv, salt and key
      if(encrypted.ciphertext){
        jsonObj.ct = Wrangler.getString(encrypted.ciphertext);
      }

      if (encrypted.iv) {
        jsonObj.iv = Wrangler.getString(encrypted.iv);
      }
      if (encrypted.salt) {
        jsonObj.s = Wrangler.getString(encrypted.salt);
      }

      if (encrypted.key){
        jsonObj.key = Wrangler.getString(encrypted.key);
      }

      // stringify JSON object
      return JSON.stringify(jsonObj);
    },

    parse : function (jsonStr) {
      //initialize json Object
      var jsonObj= {};

      //if the input argument, jsonStr is a String type
      //Convert it to json, provided the string has a JSON ordering
      if(typeof(jsonStr) === typeof('')){
        jsonObj = JSON.parse(jsonStr);
      } else {
        jsonObj = jsonStr;
      }

      //optionally set ciphertext(ct), key, iv and salt 
      if(jsonObj.ct){
        jsonObj.ct = Wrangler.set(jsonObj.ct);
      }
       
      if(jsonObj.key) {         
          jsonObj.key = Wrangler.set(jsonObj.key);
      }
      
      if (jsonObj.iv) {
        jsonObj.iv = Wrangler.set(jsonObj.iv);
      }
      if (jsonObj.s) {
        jsonObj.s = Wrangler.set(jsonObj.s);
      }
      return jsonObj;
    }
  }
}]);