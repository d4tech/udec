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
          var file;
          var files = data;
          angular.forEach( files , function(file, key){
            //console.log(file);
            file.file_name = CryptoMan.decrypt({
                ct : file.file_name,
                key : passKey,
                iv  : globalIV
            });

	    file.kind = (file.file_name).split('.')[1];
	  });
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

    exports.getFile = function(blob_key) {
         var link = '/rest/serve/' + blob_key;
         console.log(link);
        $http.get(link)
        .success(function(data) {
          //console.log(headers);
          console.log(data);
          var secureFile = data;
          var header = secureFile.slice(0,128);
          var encryptedFile = secureFile.slice(128, secureFile.length);
          // expect(encryptedFile).toEqual(encrypted.ct);
          // console.log(header);
          console.log(encryptedFile);
          console.log(typeof(encryptedFile));
          var decryptedHeader = JSON.parse(CryptoMan.decrypt({
                ct : header,
                key: passKey,
                iv: globalIV
          }));
          // expect(decryptedHeader).toEqual(args);
           console.log(decryptedHeader);
          // decryptedHeader = JSON.parse(decryptedHeader);
          var decryptedFile = CryptoMan.decrypt({
              ct: encryptedFile,
              key: decryptedHeader.key,
              iv: decryptedHeader.iv
          });
          console.log(typeof(decryptedFile));
          var reader = new FileReader();
          var fileBlob = new Blob([decryptedFile], {type : 'text/plain'});
	      reader.onloadend = function(){
                console.log(reader.result);
          };
          reader.readAsText(fileBlob, {type : 'text/plain'}); 
          
        }).error(function(data,headers,config,status,statusText) {
          alert('ERR');
          console.log('data : ' + data);
          console.log('headers : ' + headers);
          console.log('config : ' + config);
          console.log('status : ' + status );
          console.log('statusText : ' + statusText);
        });
      };

    exports.uploadFile = function(file,list) {
		    //Stores the Final encrypted file
		    var secureFileBlob; 
		    var secureFile;
		    //Select the first file only
		    // console.log(file[0].name);
		    var fileBlob = new Blob([file], {type : 'text/plain'});

		    var reader = new FileReader();
		    reader.onloadend = function (list) {
			    // Generate the key and iv
			    var args = {
				    key : CryptoMan.setKey(),
				    iv  : CryptoMan.getRand()
			    };
			    // encrypt the reader.result
			    var encrypted = CryptoMan.encrypt(reader.result, args);
			    // encrypt the file name with the passKey and GlobalIV
		    	    var uploadedFile = {
		    	    	file_name : undefined,
				blob_key : undefined,
				modified_date : undefined
		    	    };
			    uploadedFile.file_name = file[0].name; 
			    var encryptedFileName = CryptoMan.encrypt(file[0].name, {
					    key: passKey,
					    iv: globalIV
			    });
			    // Proceed to creating Header by encrypting the key and iv used to encrypt the file
			    var header = CryptoMan.encrypt({
					    key: encrypted.key,
					    iv: encrypted.iv
			    },{
				    key: passKey,
				    iv: globalIV
			    });
			    // Attach the header and the encrypted file
			    secureFile = header.ct + encrypted.ct;
			    secureFileBlob = new Blob([secureFile], {type: 'text/plain'});
			    // Create the FormData() object as GAE's BlobStoreUploader will only accept multipart/form-data 
			    var fd = new FormData();
			    // add the securedFile to the form with the field name file
			    fd.append("file",secureFileBlob, encryptedFileName.ct);
			    // Prep to launch, get the create_upload() URL from the server
			    $http.get("/rest/getBlobUploader").success(function(data) {	
				    // 3)the response string is parsed into the data with an extra double quotes..""http://localhost...""
				    // 2)So to remove that extra quotes we do data.split('"') and select the url at the return array index 1
				    // 1)then to remove the baseURL from the data perform slice where the window.location.origin.length  
				    var url = data.split('"')[1].slice(window.location.origin.length);
				    // 0)Houston, we have Lift Off...	
				    $http.post(url, fd,{
						    withCredentials: true,
						    headers: {
							    'Content-Type': undefined 
						    },
						    transformRequest: angular.identity
				    }).success(function(data) {
				    alert('Hallelujah... ' + data);
				    $http.get("/rest/lastUploadKey").success(function(data){
				    	uploadedFile.blob_key = data;
					uploadedFile.modified_date = Date.now();
					console.log(uploadedFile);
					list.push(uploadedFile);	
				    }).error(function(){
				    alert('ERR: lastUploaded');
				    });
				    }).error(function() {
				    alert('Gods good all the time');
				    });
			    }).error(function() {
			    alert('ERROR');
			    });
		    };
		    reader.readAsText(fileBlob,{type : 'text/plain'});
	    };

    //}
    return exports;		
}]);
