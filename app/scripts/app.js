'use strict';

/**
 * @ngdoc overview
 * @name udecApp
 * @description
 * # udecApp
 *
 * Main module of the application.
 */
var udecApp = angular.module('udecApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .value('passKey','123456');

udecApp.factory('formatHandler',[function formatHandlerFactory() {
    
    var stringify = function (encrypted) {
      // Create json object with ciphertext
      var jsonObj = {
        ct: encrypted.ciphertext.toString()
      };

      // optionally add iv and salt
      if (encrypted.iv) {
        jsonObj.iv = encrypted.iv.toString();
      }
      if (encrypted.salt) {
        jsonObj.s = encrypted.salt.toString();
      }

      // stringify JSON object
      return JSON.stringify(jsonObj);
    };

    var parse = function (jsonStr) {
      //parse json string
      var jsonObj= {};

      if(typeof(jsonStr) === typeof('')){
        jsonObj = JSON.parse(jsonStr);
      } else {
        jsonObj = jsonStr;
      }

      /*
       *Key handling Method, needs to be only invoked if passkey is not the key
       *if passkey is used as the key then
       *  just parse the passKey as its the header that is going to be encrypted
       *else apply PBDKF2 as its the file thats getting encrypted
      */
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
        jsonObj.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
      }
      else {
        jsonObj.iv = CryptoJS.lib.WordArray.random(128/8);
      }
      if (jsonObj.s) {
        jsonObj.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
      }
      return jsonObj;
    };
  }]
);
// .factory('Crypto',['passKey','formatHandler', function CryptoFactory(passKey, formatHandler){
//     var encrypt = function(plaintext, params) {
//       cipherParams = formatHandler.parse(params) || {};
//       var encrypted = CryptoJS.AES.encrypt(
//         plaintext,
//         cipherParams.key,
//         {
//           cipherParams.iv,
//           mode: CryptoJS.mode.CBC,
//           padding: CryptoJS.pad.pkcs7
//         }
//       );
//       return {formatHandler.stringify(encrypted)};
//     };

//     var decrypt = function (argument) {
//       // body...
//     };
//   }]
// );

