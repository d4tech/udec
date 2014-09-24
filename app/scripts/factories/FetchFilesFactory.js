'use strict';
/**
 *  Factory: FileOps
 *  Does all the major file operations
 */
angular.module('udecApp').factory('FileOps',
	['passKey','globalIV','$http','$q','CryptoMan', 
	function FileOpsFactory (passKey,globalIV,$http,$q,CryptoMan){
    var exports = {};
    exports.files = [];
    //return {
    exports.getFileList = function () {
        var deferred = $q.defer();
        return $http.get('/rest/home').success(function(data){
          console.log(data);
          var file;
          var files = data;
          angular.forEach( files , function(file, key){
            //console.log(file);
            file.file_name = CryptoMan.decrypt({
                ct : file.file_name,
                key : passKey,
                iv  : globalIV
            });
	  });
          console.log(files);
          //var files = data;
          exports.files = files;
          deferred.resolve(files);
        })
        .error(function(data,headers,config,status,statusText) {
          alert('ERR');
          console.log('data : ' + data);
          console.log('headers : ' + headers);
          console.log('config : ' + config);
          console.log('status : ' + status );
          console.log('statusText : ' + statusText);
        });
        return deferred.promise();
      };

    exports.getFile = function(link) {
        /*var link = '/rest/serve/0U22Y4xKUQerhB-36Z5Q2A==';
         console.log(link);*/
        $http.get(link)
        .sucess(function(data,headers,statusText) {
          console.log(headers);
          console.log(typeof data);
          var secureFile = data;
          var header = secureFile.slice(0,128);
          var encryptedFile = secureFile.slice(128, secureFile.length);
          // expect(encryptedFile).toEqual(encrypted.ct);
          // console.log(header);
          // console.log(encryptedFile);
          var decryptedHeader = JSON.parse(CryptoMan.decrypt({
                ct : header,
                key: passKey,
                iv: globalIV
          }));
          // expect(decryptedHeader).toEqual(args);
          // console.log(decryptedHeader);
          // decryptedHeader = JSON.parse(decryptedHeader);
          var decryptedFile = CryptoMan.decrypt({
              ct: encryptedFile,
              key: decryptedHeader.key,
              iv: decryptedHeader.iv
          });
          console.log(decryptedFile);
        }).error(function(data,headers,config,status,statusText) {
          alert('ERR');
          console.log('data : ' + data);
          console.log('headers : ' + headers);
          console.log('config : ' + config);
          console.log('status : ' + status );
          console.log('statusText : ' + statusText);
        });
      };
    //}
    return exports;		
}]);
